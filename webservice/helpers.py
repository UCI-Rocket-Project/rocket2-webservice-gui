import random
import time
import socket
import json


def send_state_update(solenoid_name, new_state, server_address):
    # Create a socket object
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    client_socket.connect(server_address)

    # Create a dictionary for the update
    update_data = {solenoid_name: new_state}

    # Stringify the dictionary
    json_data = json.dumps(update_data)

    # Send the JSON data
    client_socket.send(json_data.encode("utf-8"))

    # Close the connection
    client_socket.close()


def set_ecu_solenoid(solenoid_name, new_state):
    """Attempts to update the given solenoid on the rocket"""
    for x in range(0, 5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state, ("127.0.0.1", 12345))
        # Send a request


def set_gse_solenoid(solenoid_name, new_state):
    """Attempts to update the given solenoid on the gse"""
    for x in range(0, 5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state, ("127.0.0.1", 54321))
        # Send a request
