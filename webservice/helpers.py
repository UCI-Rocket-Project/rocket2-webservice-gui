import logging
import struct
import binascii

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text
from constants import PT_CALIBRATIONS

logging.basicConfig(level=logging.INFO)  # Set the logging level to INFO


def insert_into_db(engine, data, table_name, data_format):
    """Inserts a new row of data into the given table"""
    try:
        insert_statement = dict_to_insert_statement(table_name, data, data_format)
        with Session(engine) as session:
            session.execute(text(insert_statement))
            session.commit()
        return True

    except IntegrityError:
        logging.error("IntegrityError: Data integrity violation")
        return False

    except Exception as e:
        # Handle other exceptions
        logging.error(f"Error: {e}")
        return False


def dict_to_insert_statement(table_name, data, data_format):
    """Returns the INSERT statement for adding a row of data into a given stable"""
    columns = ", ".join(data_format)
    values = ", ".join([f"{val}" for val in data])
    insert_statement = f"INSERT INTO {table_name} ({columns}) VALUES ({values});"
    return insert_statement


def _gen_gse_pack(gse_state):
    """Returns a byte string representing a GSE command packet"""
    pack = struct.pack(
        "<????????????",  # Should match the one in fake_rocket.py
        gse_state["igniterExpected0"],  # igniter0Fire
        gse_state["igniterExpected1"],  # igniter1Fire
        False,  # alarm
        gse_state["solenoidExpectedGn2Fill"],
        gse_state["solenoidExpectedGn2Vent"],
        gse_state["solenoidExpectedGn2Disconnect"],
        gse_state["solenoidExpectedMvasFill"],
        gse_state["solenoidExpectedMvasVent"],
        gse_state["solenoidExpectedMvasOpen"],
        gse_state["solenoidExpectedMvasClose"],
        gse_state["solenoidExpectedLoxVent"],
        gse_state["solenoidExpectedLngVent"],
    )
    pack += struct.pack("<L", binascii.crc32(pack))
    return pack


def _gen_ecu_pack(ecu_state):
    """Returns a byte string representing an ECU command packet"""
    pack = struct.pack(
        "<????",  # Should match the one in fake_rocket.py
        ecu_state["solenoidExpectedCopvVent"],
        ecu_state["solenoidExpectedPv1"],
        ecu_state["solenoidExpectedPv2"],
        ecu_state["solenoidExpectedVent"],
    )
    pack += struct.pack("<L", binascii.crc32(pack))
    return pack


def send_solenoid_command(state, connection, connection_lock, system_name):
    """Attempts to update the given solenoid on the gse"""
    logging.info("SENDING SOLENOID COMMAND")
    try:
        with connection_lock:
            if system_name == "ecu":
                connection.sendall(_gen_ecu_pack(state))
            else:
                connection.sendall(_gen_gse_pack(state))
    except Exception as e:
        logging.error(f"Failed to set {system_name} Solenoid {e}")
        return {"error": str(e)}
    return {}


def get_pressure_from_voltage(pt_name, voltage):
    scaling, y_int = PT_CALIBRATIONS[pt_name]
    val = (voltage * scaling) + y_int
    return val if val > 0 else 0
