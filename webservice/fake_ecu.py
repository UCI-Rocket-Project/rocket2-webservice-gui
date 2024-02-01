import socket
import threading
import time
import requests
import json
import random
from multiprocessing import Manager


def start_tcp_server(host, port, shared_rocket_state):
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Bind the socket to a specific address and port
    server_socket.bind((host, port))

    # Listen for incoming connections (max 1 connection in this example)
    server_socket.listen(1)
    print(f"Server listening on {host}:{port}")

    while True:
        try:
            # Wait for a connection
            client_socket, client_address = server_socket.accept()
            print(f"Connection from {client_address}")

            # Receive and parse data as JSON
            data = client_socket.recv(1024)
            json_data = json.loads(data.decode("utf-8"))
            print(json_data)

            # Update the shared rocket_state dictionary
            for key, val in json_data.items():
                shared_rocket_state[f"solenoidCurrent{key}"] = val

            print(f"Updated rocket_state: {shared_rocket_state}")

            # Close the connection
            client_socket.close()

        except KeyboardInterrupt:
            print("Terminating TCP server...")
            break


def send_post_request(url, shared_rocket_state):
    while True:
        try:
            # Get a copy of the current rocket_state
            shared_rocket_state["pressureGn2"] += random.randint(-5, 20)
            shared_rocket_state["pressureLng"] += random.randint(-5, 20)
            shared_rocket_state["pressureLox"] += random.randint(-5, 20)
            shared_rocket_state["temperatureGn2"] += random.randint(-5, 20)
            data_to_send = dict(shared_rocket_state)

            # Send the entire dictionary as the body of the POST request
            response = requests.post(url, json=data_to_send)

            # Wait for one second before sending the next request
            time.sleep(0.1)

        except KeyboardInterrupt:
            print("Terminating POST request thread...")
            break


def main():
    # Set the host and port to listen on
    host = "127.0.0.1"  # localhost
    port = 12345

    # Set the URL for the POST request
    post_request_url = "http://localhost:8000/ecu/state"

    # Create a manager to handle the shared rocket_state dictionary
    manager = Manager()
    initial_rocket_state = {
        "pressureGn2": 500,
        "pressureLng": 500,
        "pressureLox": 500,
        "solenoidCurrentGn2Vent": 0,
        "solenoidCurrentPv1": 0,
        "solenoidCurrentPv2": 0,
        "solenoidCurrentVent": 0,
        "temperatureGn2": 100,
        "timestamp": 0,
    }
    rocket_state = manager.dict(initial_rocket_state)

    # Create daemon threads for the TCP server and sending POST requests
    server_thread = threading.Thread(
        target=start_tcp_server, args=(host, port, rocket_state), daemon=True
    )
    post_request_thread = threading.Thread(
        target=send_post_request, args=(post_request_url, rocket_state), daemon=True
    )

    # Start both threads
    server_thread.start()
    post_request_thread.start()

    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Terminating main program...")


if __name__ == "__main__":
    main()
