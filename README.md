# Webservice & GUI

## Initial Setup
Note: If you are on linux you can just install docker instead of docker desktop, but this works for all OS

Download and install docker desktop from docker website https://www.docker.com/products/docker-desktop/

Create a docker account and sign in on docker desktop. You will need to keep docker desktop open when you want to run a docker container.

If you already have access to make commands, you are done. Otherwise, install Make from here https://gnuwin32.sourceforge.net/packages/make.htm

Finally, build the docker Containers
```shell
$ sudo apt install docker-compose
$ make build
```

## Startup
NOTE: If you are starting up the containers for the first time, POSTGRES might fail because it takes time to initialize. Just make run again

Spin up the docker containers:

For dev environment which includes fake_rocket
```shell
$ make run 
```

For prod environment which sends requests to 10.0.255.1 instead of fake_rocket
```shell
$ make run_prod
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
    "time_recv": 0,
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
    "time_recv": 0,
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
