import logging
import random
import socket
import time
import json
from datetime import datetime
import csv
import os
import sys
import math
import struct
from threading import Lock, Thread
import binascii
from questdb.ingress import Sender, IngressError
from time import time
import socket, multiprocessing as mp 
from constants import *


ecu_ip = os.environ["ECU_IP"]
ecu_port = int(os.environ["ECU_PORT"])
ecu_connection = None
is_ecu_initialized = False
ecu_lock = Lock()
ecu_connection_lock = Lock()

ecu_state = {
    "packet_time": 0,
    "solenoidCurrentCopvVent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "solenoidExpectedCopvVent": -1,
    "solenoidExpectedPv1": -1,
    "solenoidExpectedPv2": -1,
    "solenoidExpectedVent": -1,
    "temperatureCopv": 0,
    "pressureCopv": 0,
    "pressureLox": 0,
    "pressureLng": 0,
}

gse_ip = os.environ["GSE_IP"]
gse_port = int(os.environ["GSE_PORT"])
gse_connection = None
is_gse_initialized = False
gse_lock = Lock()
gse_connection_lock = Lock()

gse_state = {
    "packet_time": 0,
    "igniterExpected0": 0,
    "igniterExpected1": 0,
    "igniterCurrent0": 0,
    "igniterCurrent1": 0,
    "alarmExpected": 0,
    "solenoidCurrentGn2Fill": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentMvasFill": 0,
    "solenoidCurrentMvasVent": 0,
    "solenoidCurrentMvasOpen": 0,
    "solenoidCurrentMvasClose": 0,
    "solenoidCurrentGn2Disconnect": 0,
    "solenoidCurrentLoxVent": 0,
    "solenoidCurrentLngVent": 0,
    "solenoidExpectedGn2Fill": -1,
    "solenoidExpectedGn2Vent": -1,
    "solenoidExpectedMvasFill": -1,
    "solenoidExpectedMvasVent": -1,
    "solenoidExpectedMvasOpen": -1,
    "solenoidExpectedGn2Disconnect": -1,
    "solenoidExpectedLoxVent": -1,
    "solenoidExpectedMvasClose": -1,
    "solenoidExpectedLngVent": -1,
    "temperatureEngine1": 0,
    "temperatureEngine2": 0,
    "pressureGn2": 0,
    "pressureCombustionChamber": 0,
}

load_cell_ip = os.environ["LOAD_CELL_IP"]
load_cell_port = int(os.environ["LOAD_CELL_PORT"])
load_cell_connection = None
is_load_cell_initialized = False
load_cell_lock = Lock()
load_cell_connection_lock = Lock()

load_cell_state = {
    "packet_time": 0,
    "total_force": 0,
}



def udp_reader(port, queue, bufsize=2048):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind(("", port))
    buf = memoryview(bytearray(bufsize))
    while True:
        nbytes, _ = s.recvfrom_into(buf)
        queue.put_nowait(buf[:nbytes].tobytes())  # or parsed data

def questdb_writer(queue):
    sender = Sender("127.0.0.1", 9009)
    batch = []
    while True:
        try:
            data = queue.get(timeout=0.1)
            batch.append(data)
            if len(batch) >= 10000:
                for row in batch:
                    # unpack & write
                    sender.row('telemetry', symbols={'device': 'A'}, columns={'value': parse(row)})
                sender.flush()
                batch.clear()
        except Exception:
            if batch:
                sender.flush()
                batch.clear()

if __name__ == "__main__":
    q = mp.Queue(maxsize=100000)
    procs = [mp.Process(target=udp_reader, args=(5000 + i, q)) for i in range(10)]
    for p in procs: p.start()
    questdb_writer(q)