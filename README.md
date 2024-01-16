To start webservice for the first time:
run pip install -r requirements.txt
cd into webservice and run python server.py


Webservice Endpoints:

system_name: ecu, gse, tracking

GET localhost:8081/<system_name>/state
Body: N/A
Returns: the state dictionary for the given system
Ex: GET localhost:8081/ecu/state

POST localhost:8081/<system_name>/state
Updates the rocket’s state on the web service and saves it to the database.
Returns: None
Ex: POST localhost:8081/ecu/state

UPDATE localhost:8081/<system_name>/solenoid/<solenoid_name>/<new_state>
Body: N/A
Sets the state of the given solenoid on the given system to the new state
Returns: None
Ex: UPDATE localhost:8081/ecu/state
