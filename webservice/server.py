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
ecu_lock = Lock()
gse_lock = Lock()

ecu_state = {
    "timestamp": 0,
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
    "timestamp": 0,
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
    "host": "postgres",
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
    global ecu_state, gse_state
    if system_name == "ecu":
        with ecu_lock:
            for key in request.json:
                ecu_state[key] = request.json[key]
        insert_into_ecu(engine, request.json)
        return ecu_state
    elif system_name == "gse":
        with gse_lock:
            for key in request.json:
                gse_state[key] = request.json[key]
        # Send new state to database
        return gse_state


@app.route("/<system_name>/solenoid/<solenoid_name>/<new_state>", methods=["POST"])
def set_solenoid(system_name, solenoid_name, new_state):
    """Used by the GUI to set a solenoid
    Solenoid_name: just the name of the solenoid (EX: Lox(NOT solenoid_expected_lox))"""
    if system_name == "ecu":
        ecu_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_ecu_solenoid(solenoid_name, int(new_state))
    elif system_name == "gse":
        gse_state["solenoidExpected" + solenoid_name] = int(new_state)
        return set_gse_solenoid(solenoid_name, int(new_state))
    else:
        return {"error": "no system with that name"}

app.run(host="0.0.0.0", port=8000, debug=True)
