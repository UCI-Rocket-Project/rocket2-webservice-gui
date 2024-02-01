# Run `pip install flask flask-cors` first!
from flask import Flask, request
from flask_cors import CORS
from threading import Lock, Thread
from helpers import set_ecu_solenoid, set_gse_solenoid

rocket_lock = Lock()
gse_lock = Lock()

rocket_state = {
    "timestamp": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "temperatureGn2": 0,
    "pressureGn2": 0,
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
CORS(app)


@app.route("/<system_name>/state", methods=["GET"])
def get_state(system_name):
    """Used by the GUI to get the current state of the given system"""
    if system_name == "ecu":
        with rocket_lock:
            return rocket_state
    elif system_name == "gse":
        with gse_lock:
            return gse_state
    return {"error": "No system"}


@app.route("/<system_name>/state", methods=["POST"])
def update_current_state(system_name):
    """Used by the rocket and GSE to update their state"""
    global rocket_state, gse_state
    if system_name == "ecu":
        with rocket_lock:
            for key in request.json:
                rocket_state[key] = request.json[key]
        # Send new state to database
        return rocket_state
    elif system_name == "gse":
        with gse_lock:
            for key in request.json:
                gse_state[key] = request.json[key]
        # Send new state to database
        return gse_state


@app.route("/<system_name>/solenoid/<solenoid_name>/<new_state>", methods=["POST"])
def set_solenoid(system_name, solenoid_name, new_state):
    """Used by the GUI to set a solenoid
    Solenoid_name: just the name of the solenoid (EX: lox(NOT solenoid_expected_lox))"""
    if system_name == "ecu":
        rocket_state["solenoidExpected" + solenoid_name] = int(new_state)
        t = Thread(
            target=set_ecu_solenoid, args=(solenoid_name, int(new_state))
        )  # send some fake ecu new states
        t.start()
        return {}
    elif system_name == "gse":
        rocket_state["solenoidExpected" + solenoid_name] = int(new_state)
        t = Thread(
            target=set_gse_solenoid, args=(solenoid_name, int(new_state))
        )  # send some fake ecu new states
        t.start()
        return {}
    return {"error": "No system"}


app.run(host="0.0.0.0", port=8000, debug=True)
