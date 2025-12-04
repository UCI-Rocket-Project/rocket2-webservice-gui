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

import zmq
import pyarrow as pa

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
        pa_data_format = [
            ('timestamp', pa.float64())
        ]

        channel_port = 0
        for channel_name in data_format:
            nidaqTask.ai_channels.add_ai_voltage_chan(
                f"{nidaq_device}/ai{channel_port}",
                min_val=-10,
                max_val=10,
                terminal_config=TerminalConfiguration.DIFF,
                )
            
            pa_data_format.append((channel_name, pa.float64()))

            channel_port += 1
        nidaqTask.timing.cfg_samp_clk_timing(
                rate=freq / channel_port,
                sample_mode=AcquisitionType.CONTINUOUS,
                samps_per_chan=buffer_size
            )
        print(pa_data_format)
        pa_data_format = pa.schema(pa_data_format)
        
        logging.info("Attempting to start ZMQ server")
        context = zmq.Context()
        socket = context.socket(zmq.PUB)
        socket.bind(f"tcp://0.0.0.0:{nidaq_port}")

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

                pa_batch = pa.RecordBatch.from_arrays(
                    [timestamps, *valid_data_buffers], 
                    schema=pa_data_format
                )
                pa_sink = pa.BufferOutputStream() # Memory buffer of data to write
                with pa.ipc.new_stream(pa_sink, pa_batch.schema) as writer:
                    writer.write_batch(pa_batch)
                net_buffer_bytes = pa_sink.getvalue().to_pybytes() # Raw bytes of data to transfer over network
                print(f"Sending {len(net_buffer_bytes)/1024:.1f} KB packet...")
                print(pa_batch)
                socket.send(net_buffer_bytes)
                
            time.sleep(1 / pythonPollingFreq)

if __name__ == "__main__":
    start_nidaq_task(NIDAQ_DATA_FORMAT, nidaqFreq, nidaqBufferLenSec, 100)