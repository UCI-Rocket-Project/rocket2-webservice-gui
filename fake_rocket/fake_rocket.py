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


def handle_update_gse_state(data):
    global gse_state
    for key, val in zip(GSE_COMMAND_FORMAT, data):
        gse_state[key[0]] = val
        gse_state[key[1]] = val


def gse_command_handler(client_socket, stop_event):
    while not stop_event.is_set():
        raw_data = client_socket.recv(16)
        if len(raw_data) == 16:
            list_data = struct.unpack(
                "<????????????", raw_data[:-4]
            )  # Should match the one in helpers.py
            handle_update_gse_state(list_data)
    logging.info("gse Command handler stop event set")


def handle_update_ecu_state(data):
    global ecu_state
    for key, val in zip(ECU_COMMAND_FORMAT, data):
        ecu_state[key[0]] = val
        ecu_state[key[1]] = val


def ecu_command_handler(client_socket, stop_event):
    while not stop_event.is_set():
        raw_data = client_socket.recv(8)
        if len(raw_data) == 8:
            handle_update_ecu_state(
                struct.unpack("<????", raw_data[:-4])
            )  # Should match the one in helpers.py
    logging.info("ECU Command handler stop event set")


def start_server(
    system_name,
    port,
    shared_state,
    command_handler,
):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("", port))
    server_socket.listen(1)

    def handle_client(client_socket):
        stop_event = threading.Event()
        command_thread = threading.Thread(
            target=command_handler, args=(client_socket, stop_event)
        )
        command_thread.daemon = True
        command_thread.start()
        try:
            while True:
                packed_data = None
                if system_name == "ECU":
                    data_format = "<Lff????fffffffffffffffffffffffffffffff"  # Should match the one in server.py
                    data_to_send = [shared_state[key] for key in ECU_DATA_FORMAT]
                    packed_data = struct.pack(data_format, *data_to_send)
                    crc32_value = binascii.crc32(packed_data)

                    shared_state["packet_time"] = (
                        int((datetime.now() - start_time).total_seconds()) * 1000
                    )
                    shared_state["pressureCopv"] += random.randint(-1, 1) / 1000
                    shared_state["pressureLox"] += random.randint(-1, 1) / 1000
                    shared_state["pressureLng"] += random.randint(-1, 1) / 1000
                    shared_state["temperatureCopv"] += random.randint(-1, 1)
                    shared_state["altitude"] += random.randint(0, 1)
                elif system_name == "GSE":
                    data_format = "<L???????????????ffffffffffffff"  # Should match the one in server.py
                    data_to_send = (shared_state[key] for key in GSE_DATA_FORMAT)
                    packed_data = struct.pack(data_format, *data_to_send)
                    crc32_value = binascii.crc32(packed_data)
                    shared_state["packet_time"] = (
                        int((datetime.now() - start_time).total_seconds()) * 1000
                    )
                    shared_state["temperatureEngine1"] += random.randint(-1, 1) / 1000
                    shared_state["temperatureEngine2"] += random.randint(-1, 1) / 1000
                    shared_state["pressureGn2"] += random.randint(-1, 1) / 1000
                    
                else:
                    data_format = "<Lf"
                    data_to_send = (shared_state[key] for key in LOAD_CELL_DATA_FORMAT)
                    packed_data = struct.pack(data_format, *data_to_send)
                    shared_state["packet_time"] = (
                        int((datetime.now() - start_time).total_seconds()) * 1000
                    )
                    shared_state["total_force"] += 1.0
                    crc32_value = None

                client_socket.sendall(
                    (packed_data + struct.pack("<L", crc32_value))
                    if crc32_value
                    else packed_data
                )
                time.sleep(0.5)
        except BrokenPipeError:
            logging.warning(f"{system_name} lost connection to webservice. Restarting")
        except Exception as e:
            logging.error(f"{system_name} failed to send data: {e}")
        finally:
            client_socket.close()
            stop_event.set()
            command_thread.join()
            logging.info(f"{system_name} thread has died. Restarting")

    while True:
        try:
            client_socket, client_address = server_socket.accept()
            logging.info(f"Connection to {system_name} from {client_address}")
            threading.Thread(
                target=handle_client, args=(client_socket,), daemon=True
            ).start()
        except socket.timeout:
            logging.warning(f"{system_name} server socket accept timed out")
        except Exception as e:
            logging.error(f"{system_name} server encountered an error: {e}")


gse_state = {}
ecu_state = {}


def main():
    global gse_state, ecu_state
    gse_port = 10002
    ecu_port = 10004
    load_cell_port = 10069
    gse_manager = Manager()
    initial_gse_state = {
        "packet_time": 10,
        "igniterArmed": 0,
        "igniter0Continuity": 0,
        "igniter1Continuity": 0,
        "igniterInternalState0": 0,
        "igniterInternalState1": 0,
        "alarmInternalState": 0,
        "solenoidInternalStateGn2Fill": 0,
        "solenoidInternalStateGn2Vent": 0,
        "solenoidInternalStateGn2Disconnect": 0,
        "solenoidInternalStateMvasFill": 0,
        "solenoidInternalStateMvasVent": 0,
        "solenoidInternalStateMvasOpen": 0,
        "solenoidInternalStateMvasClose": 0,
        "solenoidInternalStateLoxVent": 0,
        "solenoidInternalStateLngVent": 0,
        "supplyVoltage0": 0,
        "supplyVoltage1": 0,
        "solenoidCurrentGn2Fill": 0,
        "solenoidCurrentGn2Vent": 0,
        "solenoidCurrentGn2Disconnect": 0,
        "solenoidCurrentMvasFill": 0,
        "solenoidCurrentMvasVent": 0,
        "solenoidCurrentMvasOpen": 0,
        "solenoidCurrentMvasClose": 0,
        "solenoidCurrentLoxFill": 0,
        "solenoidCurrentLoxVent": 0,
        "solenoidCurrentLngFill": 0,
        "solenoidCurrentLngVent": 0,
        "temperatureEngine1": -200,
        "temperatureEngine2": -200,
        "pressureGn2": 1.2,
    }

    ecu_manager = Manager()
    initial_ecu_state = {
        "packet_time": 10,
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
        "pressureCopv": 1.2,
        "pressureLox": 1.1,
        "pressureLng": 1.1,
        "pressureInjectorLox": 0,
        "pressureInjectorLng": 0,
        "angularVelocityX": 0,
        "angularVelocityY": 0,
        "angularVelocityZ": 0,
        "accelerationX": 0,
        "accelerationY": 500,
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
    load_cell_manager = Manager()
    initial_load_cell_state = {
        "packet_time": 10,
        "total_force": 123,
    }

    ecu_state = ecu_manager.dict(initial_ecu_state)
    ecu_server_thread = threading.Thread(
        target=start_server,
        args=("ECU", ecu_port, ecu_state, ecu_command_handler),
        daemon=True,
    )
    ecu_server_thread.start()

    gse_state = gse_manager.dict(initial_gse_state)
    gse_server_thread = threading.Thread(
        target=start_server,
        args=("GSE", gse_port, gse_state, gse_command_handler),
        daemon=True,
    )
    gse_server_thread.start()

    load_cell_state = load_cell_manager.dict(initial_load_cell_state)
    load_cell_server_thread = threading.Thread(
        target=start_server,
        args=("LOAD_CELL", load_cell_port, load_cell_state, None),
        daemon=True,
    )
    load_cell_server_thread.start()

    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("Terminating main program...")


if __name__ == "__main__":
    main()
