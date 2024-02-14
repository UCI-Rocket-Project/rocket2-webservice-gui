import random
import time
import socket
import json
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text


def insert_into_ecu(engine, data):
    try:
        insert_statement = dict_to_insert_statement("ecu", data)
        with Session(engine) as session:
            session.execute(text(insert_statement))
            session.commit()
        return True

    except IntegrityError:
        # Handle integrity error (if needed)
        print("IntegrityError: Data integrity violation")
        return False

    except Exception as e:
        # Handle other exceptions
        print(f"Error: {e}")
        return False


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


def dict_to_insert_statement(table_name, data):
    columns = ", ".join(data.keys())
    values = ", ".join([f"{data[column]}" for column in data.keys()])

    insert_statement = f"INSERT INTO {table_name} ({columns}) VALUES ({values});"

    return insert_statement


def set_ecu_solenoid(solenoid_name, new_state):
    """Attempts to update the given solenoid on the rocket"""
    for x in range(0, 5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state, ("127.0.0.1", 11111))
        # Send a request


def set_gse_solenoid(solenoid_name, new_state):
    """Attempts to update the given solenoid on the gse"""
    for x in range(0, 5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state, ("127.0.0.1", 22222))
        # Send a request
