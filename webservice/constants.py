GSE_DATA_LENGTH = 83  # 4(packet_time) + 15(bool) + 4 * 15(floats) + 4(crc)
GSE_DATA_FORMAT = [
    "packet_time",
    "igniterArmed",
    "igniterCurrent0",
    "igniterCurrent1",
    "igniterInternalState0",
    "igniterInternalState1",
    "alarmInternalState",
    "solenoidInternalStateGn2Fill",
    "solenoidInternalStateGn2Vent",
    "solenoidInternalStateGn2Disconnect",
    "solenoidInternalStateMvasFill",
    "solenoidInternalStateMvasVent",
    "solenoidInternalStateMvasOpen",
    "solenoidInternalStateMvasClose",
    "solenoidInternalStateLoxVent",
    "solenoidInternalStateLngVent",
    "supplyVoltage0",
    "supplyVoltage1",
    "solenoidCurrentGn2Fill",
    "solenoidCurrentGn2Vent",
    "solenoidCurrentGn2Disconnect",
    "solenoidCurrentMvasFill",
    "solenoidCurrentMvasVent",
    "solenoidCurrentMvasOpen",
    "solenoidCurrentMvasClose",
    "solenoidCurrentLoxVent",
    "solenoidCurrentLngVent",
    "temperatureEngine1",
    "temperatureEngine2",
    "pressureGn2",
    "pressureCombustionChamber",
]

ECU_DATA_LENGTH = (
    144  # 4(packet_time) + 4 * 2(floats) + 4(bool) + 4 * 31(floats) + 4(crc) + \r\n
)

ECU_DATA_FORMAT = [
    "packet_time",
    "packetRssi",
    "packetLoss",
    "solenoidInternalStateCopvVent",
    "solenoidInternalStatePv1",
    "solenoidInternalStatePv2",
    "solenoidInternalStateVent",
    "supplyVoltage",
    "batteryVoltage",
    "solenoidCurrentCopvVent",
    "solenoidCurrentPv1",
    "solenoidCurrentPv2",
    "solenoidCurrentVent",
    "temperatureCopv",
    "pressureCopv",
    "pressureLox",
    "pressureLng",
    "pressureInjectorLox",
    "pressureInjectorLng",
    "angularVelocityX",
    "angularVelocityY",
    "angularVelocityZ",
    "accelerationX",
    "accelerationY",
    "accelerationZ",
    "magneticFieldX",
    "magneticFieldY",
    "magneticFieldZ",
    "temperature",
    "altitude",
    "ecefPositionX",
    "ecefPositionY",
    "ecefPositionZ",
    "ecefPositionAccuracy",
    "ecefVelocityX",
    "ecefVelocityY",
    "ecefVelocityZ",
    "ecefVelocityAccuracy",
]

PT_CALIBRATIONS = {
    # "ptName": (scaling, y_int)
    # Old 1K Cal (235, -240)
    "pressureGn2": (190, 11.9),  # Unused
    "pressureCombustionChamber": (190, 11.9),
    "pressureLox": (190, 11.9),  # 1K
    "pressureLng": (190, 11.9),  # 1K
    "pressureCopv": (964, 37.2),
    "pressureInjectorLox": (190, 11.9),  # 1K
    "pressureInjectorLng": (190, 11.9),  # 1K
}

LOAD_CELL_DATA_LENGTH = 7  # 4(packet_time) + 4 * 1(floats) + \r\n
SYNC = b'\xAA\x55'
LOAD_CELL_DATA_FORMAT = ["packet_time", "total_force"]
