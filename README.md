# Webservice & GUI

## Getting Started
 NOTE: The first time you run this the POSTGRES database will fail. Don't know why, dont care, just make run again
sudo apt install docker-compose
```shell
$ make build
$ make run 
In a new terminal
$ pip install requests
$ cd fake_rocket
$ python fake_rocket.py
```

Webservice Endpoints:

### Get Webservice State

Reads the launch vehicle / ground system state on the web service.

```http
GET http://localhost:8081/<system_name>/state
```

`<system_name>` can be: `ecu` or `gse`.

Returns: the state for the given system.

Example:

```http
GET http://localhost:8081/ecu/state
```

Returns:

```json
{
    "timestamp": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "solenoidExpectedGn2Vent": 0,
    "solenoidExpectedPv1": 0,
    "solenoidExpectedPv2": 0,
    "solenoidExpectedVent": 0,
    "temperatureGn2": 0,
    "pressureGn2": 0,
    "pressureLox": 0,
    "pressureLng": 0
}
```

For documentation on specific keys, see [Rocket2 Overview](https://github.com/UCI-Rocket-Project/rocket2-overview).

### Update Webservice State

Updates the launch vehicle / ground system state on the web service and saves it to the database.

```http
POST http://localhost:8081/<system_name>/state
```

`<system_name>` can be: `ecu`, `gse`, `tracking`.

Returns: None.

Example:

```http
POST http://localhost:8081/ecu/state
```

Body:

```json
{
    "timestamp": 0,
    "solenoidCurrentGn2Vent": 0,
    "solenoidCurrentPv1": 0,
    "solenoidCurrentPv2": 0,
    "solenoidCurrentVent": 0,
    "solenoidExpectedGn2Vent": 0,
    "solenoidExpectedPv1": 0,
    "solenoidExpectedPv2": 0,
    "solenoidExpectedVent": 0,
    "temperatureGn2": 0,
    "pressureGn2": 0,
    "pressureLox": 0,
    "pressureLng": 0
}
```

For documentation on specific keys, see [Rocket2 Overview](https://github.com/UCI-Rocket-Project/rocket2-overview).

### Update Solenoid State

```http
UPDATE http://localhost:8081/<system_name>/solenoid/<solenoid_name>/<new_state>
```

`<system_name>` can be: `ecu`, `gse`. \
`<solenoid_name>` see [Rocket2 Overview](https://github.com/UCI-Rocket-Project/rocket2-overview). \
`<new_state>` can be: 0(close), 1(open).

Returns: None.

Example:

```http
UPDATE http://localhost:8081/ecu/solenoid/Lox/open
```
