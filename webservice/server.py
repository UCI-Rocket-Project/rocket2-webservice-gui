# Run `pip install flask flask-cors` first!
from flask import Flask, request
from flask_cors import CORS
from threading import Lock, Thread
from helpers import (
    set_ecu_solenoid,
    set_gse_solenoid,
    dict_to_insert_statement,
    insert_into_ecu,
)
from sqlalchemy import create_engine
import logging 

import requests
is_ecu_initialized = False
is_gse_initialized = False
ecu_lock = Lock()
gse_lock = Lock()

ecu_state = {
    "time_recv": 0,
    "solenoidCurrentCopvVent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "temperatureCopv": 0,
    "pressureCopv": 0,
    "pressureLox": 0,
    "pressureLng": 0,
}

gse_state = {
    "time_recv": 0,
    "solenoidCurrentGn2Fill": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentMvasFill": 0,
    "solenoidCurrentMvasVent": 0,
    "solenoidCurrentMvas": 0,
    "solenoidCurrentLoxFill": 0,
    "solenoidCurrentLoxVent": 0,
    "solenoidCurrentLngFill": 0,
    "solenoidCurrentLngVent": 0,
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


@app.route("/<system_name>/state", methods=["POST"])
def update_current_state(system_name):
    """Used by the ecu and GSE to update their state"""
    global ecu_state, gse_state, is_ecu_initialized, is_gse_initialized
    if system_name == "ecu":
        with ecu_lock:
            if not is_ecu_initialized: # If we haven't received any states from ECU, then we dont know what values should be "expected"
                for key in request.json:
                    if "Current" in key: # Initialize each SolenoidExpected key to the current value so the default expected value is not just zero
                        key_name = "solenoidExpected"+ key.split("Current")[-1]
                        ecu_state[key_name] = request.json[key]
                    ecu_state[key] = request.json[key]
                is_ecu_initialized = True
            else:
                for key in request.json:
                    ecu_state[key] = request.json[key]
        db_thread = Thread(target=insert_into_ecu, args=(engine, request.json))
        db_thread.start()
        return ecu_state
    elif system_name == "gse":
        with gse_lock:
            if not is_gse_initialized: # If we haven't received any states from GSE, then we dont know what values should be "expected"
                for key in request.json:
                    if "Current" in key: # Initialize each SolenoidExpected key to the current value so the default expected value is not just zero
                        key_name = "solenoidExpected"+ key.split("Current")[-1]
                        gse_state[key_name] = request.json[key]
                    gse_state[key] = request.json[key]
                is_gse_initialized = True
            else:
                for key in request.json:
                    gse_state[key] = request.json[key]
        # Send new state to database
        return gse_state

import socket
def send_hello(address, port):
    # Create a socket object
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to the server
        client_socket.connect((address, port))
        logging.error(f"Connected to {address}:{port}")
        # Send the message "hello"
        import json
        message = json.dumps({"Pv2": 1})
        client_socket.sendall(message.encode())
        logging.error(f"Sent: {message}")

    except Exception as e:
        logging.error(f"Error: {e}")

    finally:
        # Close the connection
        client_socket.close()
        logging.error("Connection closed")

@app.route("/<system_name>/solenoid/<solenoid_name>/<new_state>", methods=["POST"])
def set_solenoid(system_name, solenoid_name, new_state):
    """Used by the GUI to set a solenoid
    Solenoid_name: just the name of the solenoid (EX: Lox(NOT solenoid_expected_lox))"""
    # send_hello("fake_rocket", 2222)
    if system_name == "ecu":
        ecu_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_ecu_solenoid(solenoid_name, int(new_state))
    elif system_name == "gse":
        gse_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_gse_solenoid(solenoid_name, int(new_state))
    else:
        return {"error": "no system with that name"}
    return {}

app.run(host="0.0.0.0", port=8000, debug=True)
