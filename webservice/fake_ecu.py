import requests


def send_state_update(solenoid_name, solenoid_state):
    rocket_state = {"solenoid_feedback_" + solenoid_name: solenoid_state * 11.98}
    headers = {"Content-type": "application/json"}
    requests.post(
        "http://localhost:8000/ecu/state", json=rocket_state, headers=headers
    ).json()
