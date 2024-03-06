import socket
import threading
import time
import requests
import json
import random
from multiprocessing import Manager


def start_ecu_server(host, port):
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    while True:
        try:
            # Wait for a connection
            client_socket, client_address = server_socket.accept()
            print(f"Connection to ECU from {client_address}")

            # Receive and parse data as JSON
            data = client_socket.recv(1024)
            json_data = json.loads(data.decode("utf-8"))
            while(True):
                client_socket.sendall("hello".encode())
            print(json_data)
            # Close the connection
            client_socket.close()
        except Exception:
            pass

def main():
    # Set the host and port to listen ony
    host = "127.0.0.1"
    port = 2222
    
    # Fake ECU
    ecu_server_thread = threading.Thread(
        target=start_ecu_server, args=(host, port), daemon=True
    )
    ecu_server_thread.start()
    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Terminating main program...")


if __name__ == "__main__":
    main()
