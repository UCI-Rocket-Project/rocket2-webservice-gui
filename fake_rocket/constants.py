GSE_DATA_FORMAT = [
    "time_recv",
    "igniterArmed",
    "igniter0Continuity",
    "igniter1Continuity",
    "igniterInternalState0",
    "igniterInternalState1",
    "alarmInternalState",
    "solenoidInternalStateGn2Fill",
    "solenoidInternalStateGn2Vent",
    "solenoidInternalStateGn2Disconnect",
    "solenoidInternalStateMvasFill",
    "solenoidInternalStateMvasVent",
    "solenoidInternalStateMvas",
    "solenoidInternalStateLoxFill",
    "solenoidInternalStateLoxVent",
    "solenoidInternalStateLngFill",
    "solenoidInternalStateLngVent",
    "supplyVoltage0",
    "supplyVoltage1",
    "solenoidCurrentGn2Fill",
    "solenoidCurrentGn2Vent",
    "solenoidCurrentGn2Disconnect",
    "solenoidCurrentMvasFill",
    "solenoidCurrentMvasVent",
    "solenoidCurrentMvas",
    "solenoidCurrentLoxFill",
    "solenoidCurrentLoxVent",
    "solenoidCurrentLngFill",
    "solenoidCurrentLngVent",
    "temperatureLox",
    "temperatureLng",
    "pressureGn2",
]

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

GSE_COMMAND_FORMAT = [
    ("igniterInternalState0", "igniter0Continuity"),
    ("igniterInternalState1", "igniter1Continuity"),
    ("alarmInternalState", "alarmInternalState"),
    ("solenoidInternalStateGn2Fill", "solenoidCurrentGn2Fill"),
    ("solenoidInternalStateGn2Vent", "solenoidCurrentGn2Vent"),
    ("solenoidInternalStateGn2Disconnect", "solenoidCurrentGn2Disconnect"),
    ("solenoidInternalStateMvasFill", "solenoidCurrentMvasFill"),
    ("solenoidInternalStateMvasVent", "solenoidCurrentMvasVent"),
    ("solenoidInternalStateMvas", "solenoidCurrentMvas"),
    ("solenoidInternalStateLoxFill", "solenoidCurrentLoxFill"),
    ("solenoidInternalStateLoxVent", "solenoidCurrentLoxVent"),
    ("solenoidInternalStateLngFill", "solenoidCurrentLngFill"),
    ("solenoidInternalStateLngVent", "solenoidCurrentLngVent"),
]

ECU_COMMAND_FORMAT = [
    ("solenoidInternalStateCopvVent", "solenoidCurrentCopvVent"),
    ("solenoidInternalStatePv1", "solenoidCurrentPv1"),
    ("solenoidInternalStatePv2", "solenoidCurrentPv2"),
    ("solenoidInternalStateVent", "solenoidCurrentVent"),
]
