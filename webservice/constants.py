GSE_DATA_LENGTH = 79  # 4(time_recv) + 15(bool) + 4 * 14(floats) + 4(crc)
GSE_DATA_FORMAT = [
    "time_recv",
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
    "temperatureLox",
    "temperatureLng",
    "pressureGn2",
]

ECU_DATA_LENGTH = (
    144  # 4(time_recv) + 4 * 2(floats) + 4(bool) + 4 * 31(floats) + 4(crc) + \r\n
)

ECU_DATA_FORMAT = [
    "time_recv",
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
    "pressureLox": (235, -240),  # 500 Identical with LNGInjector
    "pressureLng": (134, -163),  # 500 identical with LOX
    "pressureCopv": (964, 37.2),
    "pressureInjectorLox": (235, -240),  # 500 identical with LOX
    "pressureInjectorLng": (235, -240)  # 500 identical with LOX
    # "pressureInjectorLng":(954 ,-139)
}

LOAD_CELL_DATA_LENGTH = (
    8  # 4(time_recv) + 4 * 1(floats) + \r\n
)

LOAD_CELL_DATA_FORMAT = [
    "time_recv",
    "force"
]