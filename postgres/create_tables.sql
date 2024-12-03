-- ./postgres/init.sql
-- This script will be executed during the PostgreSQL initialization process

-- Create the rocket2 database
-- CREATE DATABASE rocket2;

-- Connect to the rocket2 database
\c rocket2;

-- Create the ecu table

CREATE TABLE IF NOT EXISTS ecu (
    time_recv INTEGER,
    packetRssi FLOAT,
    packetLoss FLOAT,
    solenoidInternalStateCopvVent BOOLEAN,
    solenoidInternalStatePv1 BOOLEAN,
    solenoidInternalStatePv2 BOOLEAN,
    solenoidInternalStateVent BOOLEAN,
    supplyVoltage FLOAT,
    batteryVoltage FLOAT,
    solenoidCurrentCopvVent FLOAT,
    solenoidCurrentPv1 FLOAT,
    solenoidCurrentPv2 FLOAT,
    solenoidCurrentVent FLOAT,
    temperatureCopv FLOAT,
    pressureCopv FLOAT,
    pressureLox FLOAT,
    pressureLng FLOAT,
    pressureInjectorLox FLOAT,
    pressureInjectorLng FLOAT,
    angularVelocityX FLOAT,
    angularVelocityY FLOAT,
    angularVelocityZ FLOAT,
    accelerationX FLOAT,
    accelerationY FLOAT,
    accelerationZ FLOAT,
    magneticFieldX FLOAT,
    magneticFieldY FLOAT,
    magneticFieldZ FLOAT,
    temperature FLOAT,
    altitude FLOAT,
    ecefPositionX FLOAT,
    ecefPositionY FLOAT,
    ecefPositionZ FLOAT,
    ecefPositionAccuracy FLOAT,
    ecefVelocityX FLOAT,
    ecefVelocityY FLOAT,
    ecefVelocityZ FLOAT,
    ecefVelocityAccuracy FLOAT
);

CREATE TABLE IF NOT EXISTS gse (
    time_recv INTEGER,
    igniterArmed BOOLEAN,
    igniterCurrent0 BOOLEAN,
    igniterCurrent1 BOOLEAN,
    igniterInternalState0 BOOLEAN,
    igniterInternalState1 BOOLEAN,
    alarmInternalState BOOLEAN,
    solenoidInternalStateGn2Fill BOOLEAN,
    solenoidInternalStateGn2Vent BOOLEAN,
    solenoidInternalStateGn2Disconnect BOOLEAN,
    solenoidInternalStateMvasFill BOOLEAN,
    solenoidInternalStateMvasVent BOOLEAN,
    solenoidInternalStateMvasOpen BOOLEAN,
    solenoidInternalStateMvasClose BOOLEAN,
    solenoidInternalStateLoxVent BOOLEAN,
    solenoidInternalStateLngVent BOOLEAN,
    supplyVoltage0 FLOAT,
    supplyVoltage1 FLOAT,
    supplyVoltage FLOAT,
    solenoidCurrentGn2Fill FLOAT,
    solenoidCurrentGn2Vent FLOAT,
    solenoidCurrentGn2Disconnect FLOAT,
    solenoidCurrentMvasFill FLOAT,
    solenoidCurrentMvasVent FLOAT,
    solenoidCurrentMvasOpen FLOAT,
    solenoidCurrentMvasClose FLOAT,
    solenoidCurrentLoxVent FLOAT,
    solenoidCurrentLngVent FLOAT,
    temperatureengine1 FLOAT,
    temperatureengine2 FLOAT,
    pressureGn2 FLOAT
);

CREATE TABLE IF NOT EXISTS load_cell (
    time_recv INTEGER,
    total_force FLOAT
);
