import requests
rocket_state = {
    "lox_bleed": 1,
    "lng_bleed":0,
    "he_bleed": 0,
    "mvas": 0
}
headers = {'Content-type': 'application/json'}
print(requests.post("http://localhost:8000/ecu/state", json=rocket_state, headers=headers).json())