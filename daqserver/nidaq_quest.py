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
from questdb.ingress import Sender

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

    with nidaqmx.Task() as nidaqTask:
        channel_port = 0
        for channel_name in data_format:
            nidaqTask.ai_channels.add_ai_voltage_chan(
                f"{nidaq_device}/ai{channel_port}",
                min_val=-10,
                max_val=10,
                terminal_config=TerminalConfiguration.DIFF,
                )

            channel_port += 1
        nidaqTask.timing.cfg_samp_clk_timing(
                rate=freq / channel_port,
                sample_mode=AcquisitionType.CONTINUOUS,
                samps_per_chan=buffer_size
            )
        
        logging.info("Attempting to start QuestDB connection")
        conf = f'http::addr=localhost:9000;'
        with Sender.from_conf(conf) as sender:
        

            # For high speed data aqcuisition
            reader = AnalogMultiChannelReader(nidaqTask.in_stream)

            nidaqTask.start()
            while True:
                samples_available = nidaqTask.in_stream.avail_samp_per_chan
                print(samples_available)

                if samples_available > 0:
                    data_buffer = np.empty((channel_port, samples_available), dtype=np.float64) # idt its really float64 look into this and changing it

                    reader.read_many_sample(
                        data=data_buffer, 
                        number_of_samples_per_channel=samples_available,
                        timeout=0
                    )
                    valid_data_buffers = data_buffer[:, :samples_available]

                    # For timestamp array
                    samples_duration = (samples_available - 1) / freq
                    timestamps = (np.arange(samples_available) / freq) - samples_duration


                    df = pd.DataFrame({
                        'timestamps': timestamps,
                        **(zip(data_format, valid_data_buffers)),
                        })
                    
                    sender.dataframe(df, table_name='LOAD_CELL', at='timestamp')

                    print(f"Sending packet to DB...")
                    
                time.sleep(1 / pythonPollingFreq)

if __name__ == "__main__":
    start_nidaq_task(NIDAQ_DATA_FORMAT, nidaqFreq, nidaqBufferLenSec, 100)