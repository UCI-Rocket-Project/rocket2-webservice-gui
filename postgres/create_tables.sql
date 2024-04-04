-- ./postgres/init.sql
-- This script will be executed during the PostgreSQL initialization process

-- Create the "rocket2" database
-- CREATE DATABASE rocket2;

-- Connect to the "rocket2" database
\c rocket2;

-- Create the "ecu" table
CREATE TABLE IF NOT EXISTS ecu (
    time_recv INTEGER,
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
    igniter0Continuity BOOLEAN,
    igniter1Continuity BOOLEAN,
    igniterInternalState0 BOOLEAN,
    igniterInternalState1 BOOLEAN,
    alarmInternalState BOOLEAN,
    solenoidInternalStateGn2Fill BOOLEAN,
    solenoidInternalStateGn2Vent BOOLEAN,
    solenoidInternalStateMvasFill BOOLEAN,
    solenoidInternalStateMvasVent BOOLEAN,
    solenoidInternalStateMvas BOOLEAN,
    solenoidInternalStateLoxFill BOOLEAN,
    solenoidInternalStateLoxVent BOOLEAN,
    solenoidInternalStateLngFill BOOLEAN,
    solenoidInternalStateLngVent BOOLEAN,
    supplyVoltage0 FLOAT,
    supplyVoltage1 FLOAT,
    supplyVoltage FLOAT,
    solenoidCurrentGn2Fill FLOAT,
    solenoidCurrentGn2Vent FLOAT,
    solenoidCurrentMvasFill FLOAT,
    solenoidCurrentMvasVent FLOAT,
    solenoidCurrentMvas FLOAT,
    solenoidCurrentLoxFill FLOAT,
    solenoidCurrentLoxVent FLOAT,
    solenoidCurrentLngFill FLOAT,
    solenoidCurrentLngVent FLOAT,
    temperatureLox FLOAT,
    temperatureLng FLOAT,
    pressureGn2 FLOAT
);