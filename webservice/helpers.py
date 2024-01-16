import random
import time
from fake_ecu import send_state_update
def set_ecu_solenoid(solenoid_name, new_state):
    '''Attempts to update the given solenoid on the rocket'''
    for x in range(0,5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state)
        # Send a request

def set_gse_solenoid(solenoid_name, new_state):
    '''Attempts to update the given solenoid on the gse'''
    for x in range(0,5):
        time.sleep(0.25)
        send_state_update(solenoid_name, new_state)
        # Send a request