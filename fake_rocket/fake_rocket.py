import socket
import threading
import time
import requests
import json
import random
from multiprocessing import Manager
import logging

def start_ecu_server(host, port, shared_ecu_state):
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    while True:
        try:
            # Wait for a connection
            client_socket, client_address = server_socket.accept()
            logging.info(f"Connection to ECU from {client_address}")

            # Receive and parse data as JSON
            data = client_socket.recv(1024)
            json_data = json.loads(data.decode("utf-8"))
            logging.info(json_data)

            # Update the shared ecu_state dictionary
            for key, val in json_data.items():
                shared_ecu_state[f"solenoidCurrent{key}"] = val

            logging.info(f"Updated ecu_state: {shared_ecu_state}")

            # Close the connection
            client_socket.close()
        except Exception as e:
            logging.error(f"Had trouble receiving command for ECU")
            time.sleep(2)


def start_gse_server(host, port, shared_gse_state):
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("", port))
    server_socket.listen(1)
    while True:
        try:
            # Wait for a connection
            client_socket, client_address = server_socket.accept()
            logging.info(f"Connection to GSE from {client_address}")

            # Receive and parse data as JSON
            data = client_socket.recv(1024)
            json_data = json.loads(data.decode("utf-8"))
            logging.info(json_data)

            # Update the shared gse_state dictionary
            for key, val in json_data.items():
                shared_gse_state[f"solenoidCurrent{key}"] = val

            logging.info(f"Updated gse_state: {shared_gse_state}")

            # Close the connection
            client_socket.close()
        except Exception as e:
            logging.error(f"Had trouble receiving command for GSE")
            time.sleep(2)


def send_ecu_post_request(url, shared_ecu_state):
    while True:
        try:
            # Get a copy of the current ecu_state
            shared_ecu_state["pressureCopv"] += random.randint(-5, 20)
            shared_ecu_state["pressureLng"] += random.randint(-5, 20)
            shared_ecu_state["pressureLox"] += random.randint(-5, 20)
            shared_ecu_state["temperatureCopv"] += random.randint(-5, 20)
            data_to_send = dict(shared_ecu_state)

            # Send the entire dictionary as the body of the POST request
            response = requests.post(url, json=data_to_send)

            # Wait for one second before sending the next request
            time.sleep(0.5)
        except Exception as e:
            logging.error(f"Had trouble sending POST request to ECU")
            time.sleep(2)

def send_gse_post_request(url, shared_gse_state):
    while True:
        try:
            # Get a copy of the current gse_state
            shared_gse_state["temperatureLox"] += random.randint(-5, 20)
            shared_gse_state["temperatureLng"] += random.randint(-5, 20)
            shared_gse_state["pressureGn2"] += random.randint(-5, 20)
            data_to_send = dict(shared_gse_state)

            # Send the entire dictionary as the body of the POST request
            response = requests.post(url, json=data_to_send)

            # Wait for one second before sending the next request
            time.sleep(0.5)
        except Exception as e:
            logging.error(f"Had troublesending POST request to GSE{e}")
            time.sleep(2)



def main():
    # Set the host and port to listen on
    host = "0.0.0.0"  # localhost
    gse_port = 2222
    ecu_port = 1111
    gse_post_request_url = "http://host.docker.internal:8000/gse/state"
    ecu_post_request_url = "http://host.docker.internal:8000/ecu/state"

    # Fake GSE
    gse_manager = Manager()
    initial_gse_state = {
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
        "temperatureLox": -0,
        "temperatureLng": -0,
        "pressureGn2": 4000,
    }
    gse_state = gse_manager.dict(initial_gse_state)
    gse_server_thread = threading.Thread(
        target=start_gse_server, args=(host, gse_port, gse_state), daemon=True
    )
    gse_post_request_thread = threading.Thread(
        target=send_gse_post_request,
        args=(gse_post_request_url, gse_state),
        daemon=True,
    )


    # Fake ECU
    ecu_manager = Manager()
    initial_ecu_state = {
        "pressureCopv": 500,
        "pressureLng": 500,
        "pressureLox": 500,
        "solenoidCurrentCopvVent": 0,
        "solenoidCurrentPv1": 0,
        "solenoidCurrentPv2": 0,
        "solenoidCurrentVent": 0,
        "temperatureCopv": 20,
        "time_recv": 0,
    }
    ecu_state = ecu_manager.dict(initial_ecu_state)

    ecu_server_thread = threading.Thread(
        target=start_ecu_server, args=(host, ecu_port, ecu_state), daemon=True
    )
    ecu_post_request_thread = threading.Thread(
        target=send_ecu_post_request,
        args=(ecu_post_request_url, ecu_state),
        daemon=True,
    )
    ecu_server_thread.start()
    ecu_post_request_thread.start()
    gse_server_thread.start()
    gse_post_request_thread.start()

    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("Terminating main program...")


if __name__ == "__main__":
    main()
