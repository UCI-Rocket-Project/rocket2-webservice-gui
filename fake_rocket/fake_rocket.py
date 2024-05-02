import socket
import threading
import time
import random
import socket
import struct
import binascii
from multiprocessing import Manager
import logging
from datetime import datetime
from constants import *

logging.basicConfig(level=logging.INFO)  # Set the logging level to INFO

start_time = datetime.now()


def start_gse_server(port, shared_gse_state):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.settimeout(5)
    server_socket.bind(("", port))
    server_socket.listen(1)
    while True:
        # Wait for a connection
        client_socket, client_address = server_socket.accept()
        logging.info(f"Connection to GSE from {client_address}")

        # Receive thread
        def gse_listener(client_socket):
            try:
                while True:
                    raw_data = client_socket.recv(16)
                    if len(raw_data) == 16:
                        list_data = struct.unpack("<????????????", raw_data[:-4])
                        handle_update_gse_state(list_data)
            except Exception as e:
                logging.info(f"GSE listener failed {e}")

        gse_thread = threading.Thread(target=gse_listener, args=(client_socket,))
        gse_thread.daemon = True
        gse_thread.start()
        # Send
        while True:
            data_format = "<L???????????????ffffffffffffff"
            data_to_send = (shared_gse_state[key] for key in GSE_DATA_FORMAT)
            packed_data = struct.pack(data_format, *data_to_send)
            crc32_value = binascii.crc32(packed_data)
            try:
                shared_gse_state["time_recv"] = int(
                    (datetime.now() - start_time).total_seconds()
                )
                shared_gse_state["temperatureLox"] += random.randint(-1, 1)
                shared_gse_state["temperatureLng"] += random.randint(-1, 1)
                shared_gse_state["pressureGn2"] += random.randint(-1, 1)
                client_socket.sendall(packed_data + struct.pack("<L", crc32_value))
                time.sleep(0.5)
            except BrokenPipeError:
                client_socket.close()
                logging.info("GSE lost connection to webservice. Restarting")
                break
            except Exception as e:
                logging.info(f"GSE failed to send data: {e}")


def handle_update_gse_state(data):
    global gse_state
    for key, val in zip(GSE_COMMAND_FORMAT, data):
        gse_state[key[0]] = val
        gse_state[key[1]] = val


def start_ecu_server(port, shared_ecu_state):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.settimeout(5)
    server_socket.bind(("", port))
    server_socket.listen(1)
    while True:
        # Wait for a connection
        client_socket, client_address = server_socket.accept()
        client_socket.settimeout(5)
        logging.info(f"Connection to ecu from {client_address}")

        # Receive thread
        def ecu_listener(client_socket):
            try:
                while True:
                    raw_data = client_socket.recv(8)  ## switch
                    if len(raw_data) == 8:
                        handle_update_ecu_state(struct.unpack("<????", raw_data[:-4]))
            except Exception as e:
                logging.info(f"ecu listener failed {e}")

        ecu_thread = threading.Thread(target=ecu_listener, args=(client_socket,))
        ecu_thread.daemon = True
        ecu_thread.start()

        # Send
        while True:
            data_format = "<Lff????fffffffffffffffffffffffffffffff"
            data_to_send = (shared_ecu_state[key] for key in ECU_DATA_FORMAT)
            packed_data = struct.pack(data_format, *data_to_send)
            crc32_value = binascii.crc32(packed_data)
            try:
                shared_ecu_state["time_recv"] = int(
                    (datetime.now() - start_time).total_seconds()
                )
                shared_ecu_state["pressureCopv"] += random.randint(-1, 1)
                shared_ecu_state["pressureLox"] += random.randint(-1, 1)
                shared_ecu_state["pressureLng"] += random.randint(-1, 1)
                shared_ecu_state["temperatureCopv"] += random.randint(-1, 1)
                client_socket.sendall(packed_data + struct.pack("<L", crc32_value))
                time.sleep(0.5)
            except BrokenPipeError:
                client_socket.close()
                logging.info("ECU lost connection to webservice. Restarting")
                break
            except Exception as e:
                logging.info(f"ECU failed to send data: {e}")


def handle_update_ecu_state(data):
    global ecu_state
    for key, val in zip(ECU_COMMAND_FORMAT, data):
        ecu_state[key[0]] = val
        ecu_state[key[1]] = val


gse_state = {}
ecu_state = {}


def main():
    global gse_state, ecu_state
    gse_port = 10002
    ecu_port = 10004
    gse_manager = Manager()
    initial_gse_state = {
        "time_recv": 10,
        "igniterArmed": 0,
        "igniter0Continuity": 0,
        "igniter1Continuity": 0,
        "igniterInternalState0": 0,
        "igniterInternalState1": 0,
        "alarmInternalState": 0,
        "solenoidInternalStateGn2Fill": 0,
        "solenoidInternalStateGn2Vent": 0,
        "solenoidInternalStateMvasFill": 0,
        "solenoidInternalStateMvasVent": 0,
        "solenoidInternalStateMvas": 0,
        "solenoidInternalStateLoxFill": 0,
        "solenoidInternalStateLoxVent": 0,
        "solenoidInternalStateLngFill": 0,
        "solenoidInternalStateLngVent": 0,
        "supplyVoltage0": 0,
        "supplyVoltage1": 0,
        "solenoidCurrentGn2Fill": 0,
        "solenoidCurrentGn2Vent": 0,
        "solenoidCurrentMvasFill": 0,
        "solenoidCurrentMvasVent": 0,
        "solenoidCurrentMvas": 0,
        "solenoidCurrentLoxFill": 0,
        "solenoidCurrentLoxVent": 0,
        "solenoidCurrentLngFill": 0,
        "solenoidCurrentLngVent": 0,
        "temperatureLox": -200,
        "temperatureLng": -200,
        "pressureGn2": 4400,
    }

    ecu_manager = Manager()
    initial_ecu_state = {
        "time_recv": 10,
        "packetRssi": 0,
        "packetLoss": 0,
        "solenoidInternalStateCopvVent": 0,
        "solenoidInternalStatePv1": 0,
        "solenoidInternalStatePv2": 0,
        "solenoidInternalStateVent": 0,
        "supplyVoltage": 0,
        "batteryVoltage": 0,
        "solenoidCurrentCopvVent": 0,
        "solenoidCurrentPv1": 0,
        "solenoidCurrentPv2": 0,
        "solenoidCurrentVent": 0,
        "temperatureCopv": 0,
        "pressureCopv": 4500,
        "pressureLox": 450,
        "pressureLng": 500,
        "pressureInjectorLox": 0,
        "pressureInjectorLng": 0,
        "angularVelocityX": 0,
        "angularVelocityY": 0,
        "angularVelocityZ": 0,
        "accelerationX": 0,
        "accelerationY": 0,
        "accelerationZ": 0,
        "magneticFieldX": 0,
        "magneticFieldY": 0,
        "magneticFieldZ": 0,
        "temperature": 0,
        "altitude": 0,
        "ecefPositionX": 0,
        "ecefPositionY": 0,
        "ecefPositionZ": 0,
        "ecefPositionAccuracy": 0,
        "ecefVelocityX": 0,
        "ecefVelocityY": 0,
        "ecefVelocityZ": 0,
        "ecefVelocityAccuracy": 0,
    }

    ecu_state = ecu_manager.dict(initial_ecu_state)
    ecu_server_thread = threading.Thread(
        target=start_ecu_server, args=(ecu_port, ecu_state), daemon=True
    )
    ecu_server_thread.start()

    gse_state = gse_manager.dict(initial_gse_state)
    gse_server_thread = threading.Thread(
        target=start_gse_server, args=(gse_port, gse_state), daemon=True
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
