GSE_DATA_LENGTH = 79  # 4(packet_time) + 15(bool) + 4 * 14(floats) + 4(crc)
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
    "pressureGn2": (1, 0),
    "pressureLox": (189, 14.9),  # 500 Identical with LNGInjector
    "pressureLng": (189, 14.9),  # 500 identical with LOX
    "pressureCopv": (964, 37.2),
    "pressureInjectorLox": (189, 14.9),  # 500 identical with LOX
    "pressureInjectorLng": (189, 14.9)  # 500 identical with LOX
    # "pressureInjectorLng":(954 ,-139)
}

LOAD_CELL_DATA_LENGTH = 8  # 4(packet_time) + 4 * 1(floats) + \r\n

LOAD_CELL_DATA_FORMAT = ["packet_time", "total_force"]
