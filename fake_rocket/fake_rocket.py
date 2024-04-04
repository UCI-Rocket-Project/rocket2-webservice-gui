import socket
import threading
import time
import random
from multiprocessing import Manager
import logging
from constants import GSE_DATA_FORMAT, GSE_COMMAND_FORMAT

import socket
import struct
import binascii
def start_gse_server(host, port, shared_gse_state):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("", port))
    server_socket.listen(1)
    while True:
        # Wait for a connection
        client_socket, client_address = server_socket.accept()
        logging.info(f"Connection to GSE from {client_address}")

        # Receive thread
        def gse_listener(client_socket):
            while True:
                raw_data = client_socket.recv(16)
                if len(raw_data) == 16:
                    handle_update_gse_state(struct.unpack("<????????????", raw_data[:-4]))
        gse_thread = threading.Thread(target=gse_listener, args=(client_socket,))
        gse_thread.daemon = True
        gse_thread.start()

        # Send 
        while True:
            data_format = "<L???????????????ffffffffffffff"
            data_to_send = (
                shared_gse_state[key] for key in GSE_DATA_FORMAT
            )
            packed_data = struct.pack(data_format, *data_to_send)
            crc32_value = binascii.crc32(packed_data)
            try:
                shared_gse_state["temperatureLox"] += random.randint(-1, 1)
                shared_gse_state["temperatureLng"] += random.randint(-1, 1)
                shared_gse_state["pressureGn2"] += random.randint(-1, 1)
                client_socket.sendall(packed_data + struct.pack("<L", crc32_value))
                print("Data sent successfully!")
                time.sleep(0.5)
            except Exception as e:
                print("Failed to send data:", e)

def handle_update_gse_state(data):
    global gse_state
    for key, val in zip(GSE_COMMAND_FORMAT, data):  
        gse_state[key[0]] = val
        gse_state[key[1]] = val
        


gse_state = {}
def main():
    global gse_state
    # Set the host and port to listen on
    host = "0.0.0.0"  # localhost
    gse_port = 10002

    # Fake GSE
    gse_manager = Manager()
    initial_gse_state = {
    "time_recv": 10,
    "igniterArmed":0,
    "igniter0Continuity":0,
    "igniter1Continuity":0,
    "igniterInternalState0":0,
    "igniterInternalState1":0,
    "alarmInternalState":0,
    "solenoidInternalStateGn2Fill":0,
    "solenoidInternalStateGn2Vent":0,
    "solenoidInternalStateMvasFill":0,
    "solenoidInternalStateMvasVent":0,
    "solenoidInternalStateMvas":0,
    "solenoidInternalStateLoxFill":0,
    "solenoidInternalStateLoxVent":0,
    "solenoidInternalStateLngFill":0,
    "solenoidInternalStateLngVent":0,
    "supplyVoltage0":0,
    "supplyVoltage1":0,
    "solenoidCurrentGn2Fill":0,
    "solenoidCurrentGn2Vent":0,
    "solenoidCurrentMvasFill":0,
    "solenoidCurrentMvasVent":0,
    "solenoidCurrentMvas":0,
    "solenoidCurrentLoxFill":0,
    "solenoidCurrentLoxVent":0,
    "solenoidCurrentLngFill":0,
    "solenoidCurrentLngVent":0,
    "temperatureLox":-200,
    "temperatureLng":-200,
    "pressureGn2":4400
    }
    gse_state = gse_manager.dict(initial_gse_state)
    gse_server_thread = threading.Thread(
        target=start_gse_server, args=(host, gse_port, gse_state), daemon=True
    )
    gse_server_thread.start()
    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("Terminating main program...")


if __name__ == "__main__":
    main()
