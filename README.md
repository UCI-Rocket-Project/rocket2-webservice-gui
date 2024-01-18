# Webservice & GUI

## Getting Started
```shell
$ pip install -r requirements.txt
$ cd webservice
$ python server.py
```

Webservice Endpoints:

### Get Webservice State
Reads the launch vehicle / ground system state on the web service.
```http
GET http://localhost:8081/<system_name>/state
```
`<system_name>` can be: `ecu`, `gse`, `tracking`.

Returns: the state for the given system.

Example:
```http
GET http://localhost:8081/ecu/state
```
Returns:
```json
{
    "ecuGyroscopeX": 0.0,
    "ecuGyroscopeY": 0.0,
    "ecuGyroscopeZ": 0.0
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
    "ecuGyroscopeX": 0.0,
    "ecuGyroscopeY": 0.0,
    "ecuGyroscopeZ": 0.0
}
```
For documentation on specific keys, see [Rocket2 Overview](https://github.com/UCI-Rocket-Project/rocket2-overview).

### Update Solenoid State
```http
UPDATE http://localhost:8081/<system_name>/solenoid/<solenoid_name>/<new_state>
```
`<system_name>` can be: `ecu`, `gse`. \
`<solenoid_name>` see [Rocket2 Overview](https://github.com/UCI-Rocket-Project/rocket2-overview). \
`<new_state>` can be: `open`, `close`.

Returns: None.

Example:
```http
UPDATE http://localhost:8081/ecu/solenoid/LOX/open
```
