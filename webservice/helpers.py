import random
import time
import socket
import json
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging
import os
import struct
import binascii
from constants import GSE_DATA_FORMAT

def insert_into_ecu(engine, data):
    try:
        insert_statement = dict_to_insert_statement("ecu", data)
        with Session(engine) as session:
            session.execute(text(insert_statement))
            session.commit()
        return True

    except IntegrityError:
        # Handle integrity error (if needed)
        logging.error("IntegrityError: Data integrity violation")
        return False

    except Exception as e:
        # Handle other exceptions
        logging.error(f"Error: {e}")
        return False
    
    
def insert_into_gse(engine, data):
    try:
        insert_statement = dict_to_insert_statement("gse", data)
        with Session(engine) as session:
            session.execute(text(insert_statement))
            session.commit()
        return True

    except IntegrityError:
        # Handle integrity error (if needed)
        logging.error("IntegrityError: Data integrity violation")
        return False

    except Exception as e:
        # Handle other exceptions
        logging.error(f"Error: {e}")
        return False


def dict_to_insert_statement(table_name, data):
    # for key, val in zip(GSE_DATA_FORMAT, new_state):
    columns = ", ".join(GSE_DATA_FORMAT)
    values = ", ".join([f"{val}" for val in data])
    insert_statement = f"INSERT INTO {table_name} ({columns}) VALUES ({values});"

    return insert_statement


def set_ecu_solenoid(ecu_state):
    """Attempts to update the given solenoid on the rocket. Returns error if encountered"""
    try:
        for x in range(0, 5):
            time.sleep(0.25)
            # send_state_update(solenoid_name, new_state, (ecu_ip, 10002))
    except Exception as e:
        logging.error(f"Failed to set ECU Solenoid {e}")
        return {"error": str(e)}
    return {}


def _gen_gse_pack(gse_state):
    pack = struct.pack(
        "<????????????",
        False, # igniter0Fire
        False, # igniter1Fire
        False, # alarm
        gse_state["solenoidExpectedGn2Fill"], # gn2Fill
        gse_state["solenoidExpectedGn2Vent"], # gn2Vent
        gse_state["solenoidExpectedMvasFill"], # mvasFill
        gse_state["solenoidExpectedMvasVent"], # mvasVent
        gse_state["solenoidExpectedMvas"], # mvas
        gse_state["solenoidExpectedLoxFill"], # loxFill
        gse_state["solenoidExpectedLoxVent"], # loxVent
        gse_state["solenoidExpectedLngFill"], # lngFill
        gse_state["solenoidExpectedLngVent"], # lngVent
    )
    pack += struct.pack("<L", binascii.crc32(pack))
    return pack


def set_gse_solenoid(gse_state, gse_connection, gse_connection_lock):
    """Attempts to update the given solenoid on the gse. Returns error if encountered"""
    try:
        with gse_connection_lock:
            gse_connection.sendall(_gen_gse_pack(gse_state))
    except Exception as e:
        logging.error(f"Failed to set GSE Solenoid {e}")
        return {"error": str(e)}
    return {}
