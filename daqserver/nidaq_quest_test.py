import nidaqmx
from nidaqmx.constants import READ_ALL_AVAILABLE
from nidaqmx.constants import AcquisitionType
from nidaqmx.constants import TerminalConfiguration
from nidaqmx.stream_readers import AnalogMultiChannelReader

import logging

import os

import time

import struct

from threading import Lock, Thread

import numpy as np

import pandas as pd
from questdb.ingress import Sender, TimestampNanos

from nidaq_constants import *

nidaq_device = "Dev1"
nidaq_state = {}
nidaqTask = None
nidaqFreq = 1000
nidaqBufferLenSec = 5
nidaq_lock = Lock()

nidaq_port = int(os.environ["NIDAQ_PORT"])

def start_nidaq_task(data_format, freq, bufferTime, pythonPollingFreq):
    '''try:
        
    except Exception as e:
        logging.error(f"NI DAQ listener failed: {e}")'''
    buffer_size = freq * bufferTime
    logging.info("Attempting to connect to NI DAQ")


    logging.info("Attempting to start QuestDB connection")
    conf = f'http::addr=localhost:9000;'
    with Sender.from_conf(conf) as sender:
        while True:
            samples_available = 3
            print(samples_available)

            if samples_available > 0:
                data_buffer = [[6, 4, 8], [3, 2, 9]]
                data_buffer = np.array(data_buffer)

                valid_data_buffers = data_buffer[:, :samples_available]

                # For timestamp array
                period = 1 / freq / 1_000_000_000
                samples_duration = (samples_available - 1) * period
                timestamps = np.arange(samples_available, start=-
                                       samples_duration, stop=0, step=1/freq / 1_000_000_000, dtype=np.int64)

                print(timestamps)
                TimestampNanos.now()
                df = pd.DataFrame({
                    'timestamps': timestamps,
                    **(dict(zip(data_format, valid_data_buffers))),
                    })
                
                sender.dataframe(df, table_name='LOAD_CELL', at='timestamps')

                print(f"Sending packet to DB...")
                print(df)
                
            time.sleep(1 / pythonPollingFreq)

if __name__ == "__main__":
    start_nidaq_task(NIDAQ_DATA_FORMAT, nidaqFreq, nidaqBufferLenSec, 100)