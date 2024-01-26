# Run `pip install flask flask-cors` first!
from flask import Flask, request
from flask_cors import CORS
from threading import Lock, Thread
from helpers import set_ecu_solenoid, set_gse_solenoid

rocket_lock = Lock()
gse_lock = Lock()

rocket_state = {
    "solenoid_feedback_lox": 0.0,
    "solenoid_expected_lox": 0,
    "solenoid_feedback_lng": 0.0,
    "solenoid_expected_lng": 0,
    "solenoid_feedback_he": 0.0,
    "solenoid_expected_he": 0,
    "pt_lox": 50,
    "pt_lng": 75,
}

gse_state = {
    "solenoidLox": 0,
    "solenoidLng": 0,
    "solenoidHe": 0,
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
        rocket_state["solenoid_expected_" + solenoid_name] = int(new_state)
        t = Thread(
            target=set_ecu_solenoid, args=(solenoid_name, int(new_state))
        )  # send some fake ecu new states
        t.start()
        return {}
    elif system_name == "gse":
        rocket_state["gse_expected_" + solenoid_name] = int(new_state)
        t = Thread(
            target=set_gse_solenoid, args=(solenoid_name, int(new_state))
        )  # send some fake ecu new states
        t.start()
        return {}
    return {"error": "No system"}


app.run(host="0.0.0.0", port=8000, debug=True)
