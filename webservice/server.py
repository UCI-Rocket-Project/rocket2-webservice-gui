from flask import Flask, request
from flask_cors import CORS
from threading import Lock, Thread
from helpers import (
    set_ecu_solenoid,
    set_gse_solenoid,
    dict_to_insert_statement,
    insert_into_gse,
)
from sqlalchemy import create_engine
import logging 
import socket
import time
import os
import math
import struct
import binascii
from constants import GSE_DATA_FORMAT

ecu_ip = os.environ["ECU_IP"]
ecu_port = int(os.environ["ECU_PORT"])
gse_ip = os.environ["GSE_IP"]
gse_port = int(os.environ["GSE_PORT"])

gse_connection = None
ecu_connection = None

is_ecu_initialized = False
is_gse_initialized = False

ecu_lock = Lock()
gse_lock = Lock()
gse_connection_lock = Lock()

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
        ecu_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_ecu_solenoid(ecu_state)
    elif system_name == "gse":
        gse_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_gse_solenoid(gse_state, gse_connection, gse_connection_lock)
    else:
        return {"error": "no system with that name"}
    return {}


def start_gse_listening():
    global gse_connection
    while True:
        try:
            logging.error("connecting")
            gse_connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            gse_connection.settimeout(5)  # 10 seconds timeout, adjust as needed

            gse_connection.connect((gse_ip,gse_port))
            while True:
                with gse_connection_lock:
                    raw_data = gse_connection.recv(79)
                if len(raw_data) == 79:
                    if(binascii.crc32(raw_data[:-4]) == struct.unpack("<L", raw_data[-4:])[0]):
                        handle_update_gse_state(struct.unpack("<L???????????????ffffffffffffff",raw_data[:-4]))
                else:
                    logging.error("DIDN'T GET STUFF")
                    gse_connection.close()
                    break
        except Exception as e:
            gse_connection.close()
            print("Failed to connect to GSE", e)
            time.sleep(0.5)

def handle_update_gse_state(new_state):
    global is_gse_initialized
    state_missmatch = False
    with gse_lock:
        for key, val in zip(GSE_DATA_FORMAT, new_state):
            if "InternalState" in key: # If it is an internal state key
                if not is_gse_initialized:
                   gse_state[key.replace("InternalState", "Expected")] = val
                elif gse_state[key.replace("InternalState", "Expected")] != val:
                    state_missmatch = True
            else:
                if type(val) == bool:
                    gse_state[key] = int(val)
                elif math.isnan(val):
                    gse_state[key] = -1
                else:
                    gse_state[key] = val
    db_thread = Thread(target=insert_into_gse, args=(engine, new_state))
    db_thread.start()

    if state_missmatch and is_gse_initialized:
        set_gse_solenoid(gse_state, gse_connection, gse_connection_lock)
    is_gse_initialized = True

if __name__ == "__main__":
    gse_listening_thread = Thread(target=start_gse_listening, args=())
    gse_listening_thread.daemon = True
    gse_listening_thread.start()
    app.run(host="0.0.0.0", port=8000)
