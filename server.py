# Run `pip install flask flask-cors` first!
from flask import Flask, request
from flask_cors import CORS
from threading import Lock
from helpers import set_ecu_solenoid
rocket_lock = Lock()
gse_lock = Lock()

rocket_state = {
    "lox_bleed": 0,
    "lng_bleed":0,
    "he_bleed": 0,
    "mvas": 0
}

gse_state = {
    "lox_fill": 0,
    "lng_fill":0,
    "he_fill": 0,
}

app = Flask(__name__)
CORS(app)

@app.route("/<system_name>/state", methods = ["GET"])
def get_state(system_name):
    if system_name == "ecu":
        with rocket_lock:
            return rocket_state
    elif system_name == "gse":
        with gse_lock:
            return gse_state
    return {"error": "No system"}

@app.route("/<system_name>/state", methods=["POST"])
def update_current_state(system_name):
    global rocket_state, gse_state
    if system_name == "ecu":
        with rocket_lock:
            for key in request.json:
                rocket_state[key] = request.json[key]
        # Send new state to database
        return rocket_state
    elif system_name == "gse":
        pass

    pass

@app.route("/<system_name>/solenoid/<solenoid_name>/<new_state>", methods = ["POST"])
def set_solenoid(system_name, solenoid_name, new_state):
    if system_name == "ecu":
        ret = set_ecu_solenoid(solenoid_name, new_state)
        if not ret:
            return {"error": "Comms failure"}
        return {}
    elif system_name == "gse":
        #send message to gse
        #update state
        pass
    return {"error": "No system"}
    

app.run(host='0.0.0.0', port=8000, debug=True)
