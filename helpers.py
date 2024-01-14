import random
import time
def set_ecu_solenoid(solenoid_name, new_state):
    '''Updates the given solenoid on the rocket with the new state and returns True if successful'''
    for x in range(0,5):
        if random.randint(0,5) == 1: # Failed
            time.sleep(2)
            print("failed. Trying again")
        else:
            return True
    return False