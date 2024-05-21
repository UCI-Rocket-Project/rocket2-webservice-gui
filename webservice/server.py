import logging
import socket
import time
import os
import math
import struct
from threading import Lock, Thread
import binascii

from flask import Flask, request
from flask_cors import CORS
from sqlalchemy import create_engine
import psycopg2
from sqlalchemy.orm import Session
from sqlalchemy import text


from helpers import send_solenoid_command, insert_into_db
from constants import *

ecu_ip = os.environ["ECU_IP"]
ecu_port = int(os.environ["ECU_PORT"])
ecu_connection = None
is_ecu_initialized = False
ecu_lock = Lock()
ecu_connection_lock = Lock()

ecu_state = {
    "time_recv": 0,
    "solenoidCurrentCopvVent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "solenoidExpectedCopvVent": -1,
    "solenoidExpectedPv1": -1,
    "solenoidExpectedPv2": -1,
    "solenoidExpectedVent": -1,
    "temperatureCopv": 0,
    "pressureCopv": 0,
    "pressureLox": 0,
    "pressureLng": 0,
}

gse_ip = os.environ["GSE_IP"]
gse_port = int(os.environ["GSE_PORT"])
gse_connection = None
is_gse_initialized = False
gse_lock = Lock()
gse_connection_lock = Lock()

gse_state = {
    "time_recv": 0,
    "igniterExpected0": 0,
    "igniterExpected1": 0,
    "alarmExpected": 0,
    "solenoidCurrentGn2Fill": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentMvasFill": 0,
    "solenoidCurrentMvasVent": 0,
    "solenoidCurrentMvas": 0,
    "solenoidCurrentLoxFill": 0,
    "solenoidCurrentLoxVent": 0,
    "solenoidCurrentLngFill": 0,
    "solenoidCurrentLngVent": 0,
    "solenoidExpectedGn2Fill": -1,
    "solenoidExpectedGn2Vent": -1,
    "solenoidExpectedMvasFill": -1,
    "solenoidExpectedMvasVent": -1,
    "solenoidExpectedMvas": -1,
    "solenoidExpectedLoxFill": -1,
    "solenoidExpectedLoxVent": -1,
    "solenoidExpectedLngFill": -1,
    "solenoidExpectedLngVent": -1,
    "temperatureLox": 0,
    "temperatureLng": 0,
    "pressureGn2": 0,
}

app = Flask(__name__)
db_config = {
    "host": "host.docker.internal",
    "port": "5432",
    "database": "rocket2",
    "user": "gs",
    "password": "rocket",
}
engine = create_engine(
    f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
)
CORS(app)
logging.basicConfig(level=logging.INFO)  # Set the logging level to INFO


@app.route("/data/clear", methods=["DELETE"])
def clear_data():
    with Session(engine) as session:
        session.execute(text("DELETE from ecu;"))
        session.commit()
    return "ok"


@app.route("/data/<selected_keys>", methods=["GET"])
def get_data(selected_keys):
    connection = psycopg2.connect(**db_config)
    cursor = connection.cursor()
    key_str = "time_recv, "
    for key in selected_keys.split(","):
        key_str += f"{key}, "
    key_str = key_str[:-2]
    where_claus = ""
    if request.args.get("startTime") or request.args.get("endTime"):
        where_claus = f"WHERE time_recv > {request.args.get('startTime', 0)} \
        AND time_recv < {request.args.get('endTime',200)}"

    cursor.execute(f"SELECT {key_str} FROM ecu {where_claus} ORDER BY time_recv DESC;")
    rows = cursor.fetchall()
    cursor.close()
    return {"sensors": selected_keys.split(","), "data": rows[::-1]}


@app.route("/<system_name>/state", methods=["GET"])
def get_state(system_name):
    """Used by the GUI to get the current state of the given system"""
    if system_name == "ecu":
        with ecu_lock:
            return ecu_state
    elif system_name == "gse":
        with gse_lock:
            return gse_state
    return {"error": "No system"}


@app.route("/<system_name>/solenoid/<solenoid_name>/<new_state>", methods=["POST"])
def set_solenoid(system_name, solenoid_name, new_state):
    """Used by the GUI to set a solenoid
    Solenoid_name: just the name of the solenoid (EX: Lox(NOT solenoid_expected_lox))"""
    if system_name == "ecu":
        logging.info(
            f"Old state {ecu_state['solenoidExpected' + solenoid_name]} new state {new_state} "
        )
        ecu_state["solenoidExpected" + solenoid_name] = int(new_state)
        return send_solenoid_command(
            ecu_state, ecu_connection, ecu_connection_lock, "ecu"
        )
    elif system_name == "gse":
        logging.info(
            f"Old state {gse_state['solenoidExpected' + solenoid_name]} new state {new_state} "
        )
        gse_state["solenoidExpected" + solenoid_name] = int(new_state)
        return send_solenoid_command(
            gse_state, gse_connection, gse_connection_lock, "gse"
        )
    else:
        return {"error": "no system with that name"}


def start_gse_listening():
    global gse_connection
    while True:
        try:
            logging.info("Waiting for connection to GSE")
            gse_connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            gse_connection.settimeout(5)
            gse_connection.connect((gse_ip, gse_port))
            failed_attempts = 0
            while True:
                with gse_connection_lock:
                    raw_data = gse_connection.recv(GSE_DATA_LENGTH)
                if len(raw_data) == GSE_DATA_LENGTH:
                    if (
                        binascii.crc32(raw_data[:-4])
                        == struct.unpack("<L", raw_data[-4:])[0]
                    ):
                        handle_update_gse_state(
                            list(
                                struct.unpack(
                                    "<L???????????????ffffffffffffff", raw_data[:-4]
                                )
                            )
                        )
                else:
                    logging.error(
                        f"Didn't get complete packet from GSE: {len(raw_data)}"
                    )
                    failed_attempts += 1
                    if failed_attempts > 10:  # Assume we have disconnected
                        break
                    time.sleep(0.5)
        except Exception as e:
            gse_connection.close()
            logging.error(f"Failed to connect to GSE: {e}")
            time.sleep(0.5)


def handle_update_gse_state(new_state):
    global is_gse_initialized
    state_missmatch = False
    with gse_lock:
        for index, (key, val) in enumerate(zip(GSE_DATA_FORMAT, new_state)):
            if "InternalState" in key:
                if not is_gse_initialized:
                    gse_state[key.replace("InternalState", "Expected")] = val
                elif gse_state[key.replace("InternalState", "Expected")] != val:
                    state_missmatch = True
            else:
                if type(val) == bool:
                    gse_state[key] = int(val)
                elif math.isnan(val):
                    gse_state[key] = -1
                    new_state[index] = -1
                else:
                    gse_state[key] = val
    db_thread = Thread(
        target=insert_into_db, args=(engine, new_state, "gse", GSE_DATA_FORMAT)
    )
    db_thread.start()

    if state_missmatch and is_gse_initialized:
        send_solenoid_command(gse_state, gse_connection, gse_connection_lock, "gse")
    is_gse_initialized = True


def start_ecu_listening():
    global ecu_connection
    while True:
        try:
            logging.info("Waiting for connection to ECU")
            ecu_connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            ecu_connection.settimeout(5)
            ecu_connection.connect((ecu_ip, ecu_port))
            failed_attempts = 0
            while True:
                with ecu_connection_lock:
                    raw_data = ecu_connection.recv(ECU_DATA_LENGTH)
                if len(raw_data) == ECU_DATA_LENGTH:
                    list_data = struct.unpack("<L", raw_data[-4:])[0]
                    if binascii.crc32(raw_data[:-4]) == list_data:
                        list_data = list(
                            struct.unpack(
                                "<Lff????fffffffffffffffffffffffffffffff", raw_data[:-4]
                            )
                        )
                        handle_update_ecu_state(list_data)
                else:
                    logging.error(
                        f"Didn't get complete packet from ECU: {len(raw_data)}"
                    )
                    failed_attempts += 1
                    if failed_attempts > 10:  # Assume we have disconnected
                        break
                    time.sleep(0.5)
        except Exception as e:
            ecu_connection.close()
            logging.error(f"Failed to connect to ECU: {e}")
            time.sleep(0.5)


def handle_update_ecu_state(new_state):
    global is_ecu_initialized
    state_missmatch = False
    with ecu_lock:
        for index, (key, val) in enumerate(zip(ECU_DATA_FORMAT, new_state)):
            if "InternalState" in key:  # If it is an internal state key
                if not is_ecu_initialized:
                    ecu_state[key.replace("InternalState", "Expected")] = val
                elif ecu_state[key.replace("InternalState", "Expected")] != val:
                    state_missmatch = True
            else:
                if type(val) == bool:
                    ecu_state[key] = int(val)
                elif math.isnan(val):
                    ecu_state[key] = -1
                    new_state[index] = -1
                else:
                    ecu_state[key] = val
    db_thread = Thread(
        target=insert_into_db, args=(engine, new_state, "ecu", ECU_DATA_FORMAT)
    )
    db_thread.start()
    if state_missmatch and is_ecu_initialized:
        send_solenoid_command(ecu_state, ecu_connection, ecu_connection_lock, "ecu")
    is_ecu_initialized = True


if __name__ == "__main__":
    gse_listening_thread = Thread(target=start_gse_listening, args=())
    gse_listening_thread.daemon = True
    gse_listening_thread.start()

    ecu_listening_thread = Thread(target=start_ecu_listening, args=())
    ecu_listening_thread.daemon = True
    ecu_listening_thread.start()
    app.run(host="0.0.0.0", port=8000, debug=True)
