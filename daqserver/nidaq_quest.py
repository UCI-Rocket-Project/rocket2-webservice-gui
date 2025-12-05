import nidaqmx
from nidaqmx.constants import AcquisitionType, TerminalConfiguration
from nidaqmx.stream_readers import AnalogMultiChannelReader
import numpy as np
import pandas as pd
import time
import logging
from datetime import datetime
from questdb.ingress import Sender, IngressError

# --- Configuration ---
# NIDAQ Settings
NIDAQ_DEVICE = "Dev1"
NIDAQ_CHANNELS = ["Load Cell"] # Add your channel names here
SAMPLING_RATE = 10000        # Hz (Samples per second per channel)
BUFFER_DURATION_SEC = 5      # Internal NIDAQ buffer size (in seconds)
POLLING_FREQ = 20            # How often Python checks for new data (Hz)

# QuestDB Settings
QUESTDB_CONF = 'http::addr=localhost:9000;'
QUESTDB_TABLE = 'LOAD_CELL'

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def stream_nidaq_to_questdb():
    buffer_size_samples = int(SAMPLING_RATE * BUFFER_DURATION_SEC)
    num_channels = len(NIDAQ_CHANNELS)
    
    # Generate CSV Filename based on start time
    start_time_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"nidaq_data_{start_time_str}.csv"
    
    logging.info(f"Configuring NIDAQ: {num_channels} channels @ {SAMPLING_RATE} Hz")
    logging.info(f"Local CSV recording to: {csv_filename}")
    
    try:
        # 1. Initialize NIDAQ Task
        with nidaqmx.Task() as task:
            
            # Setup Channels
            for i, channel_name in enumerate(NIDAQ_CHANNELS):
                physical_channel = f"{NIDAQ_DEVICE}/ai{i}"
                task.ai_channels.add_ai_voltage_chan(
                    physical_channel,
                    min_val=-0.02, # Adjust based on your sensor sensitivity
                    max_val=0.02,
                    terminal_config=TerminalConfiguration.DIFF,
                    name_to_assign_to_channel=channel_name
                )

            # Setup Timing
            # Note: 'rate' is samples per channel, per second.
            task.timing.cfg_samp_clk_timing(
                rate=SAMPLING_RATE,
                sample_mode=AcquisitionType.CONTINUOUS,
                samps_per_chan=buffer_size_samples
            )

            # Setup High-Performance Reader
            reader = AnalogMultiChannelReader(task.in_stream)
            
            # 2. Initialize QuestDB Sender
            logging.info(f"Connecting to QuestDB at {QUESTDB_CONF}...")
            with Sender.from_conf(QUESTDB_CONF) as sender:
                
                logging.info("Starting Acquisition...")
                task.start()
                
                total_samples_sent = 0
                csv_header_written = False

                while True:
                    # Check how many samples are sitting in the buffer
                    samples_available = task.in_stream.avail_samp_per_chan
                    
                    if samples_available > 0:
                        # Allocate buffer for the specific chunk size
                        # Shape: (Channels, Samples)
                        data_buffer = np.empty((num_channels, samples_available), dtype=np.float64)

                        # Read from Device
                        reader.read_many_sample(
                            data=data_buffer, 
                            number_of_samples_per_channel=samples_available,
                            timeout=10.0 # generous timeout for reading buffer
                        )
                        
                        # --- Timestamp Calculation ---
                        # We align the LAST sample to the current system time (time.time_ns())
                        # and calculate backwards. This is a common strategy for soft-realtime sync.
                        
                        period_ns = (1 / SAMPLING_RATE) * 1_000_000_000
                        duration_ns = (samples_available - 1) * period_ns
                        
                        # Create relative nanoseconds array: [ ... -200, -100, 0]
                        relative_ns = (np.arange(samples_available, dtype=np.float64) * period_ns) - duration_ns
                        
                        # Shift by current time
                        current_time_ns = time.time_ns()
                        timestamps_ns = relative_ns.astype(np.int64) + current_time_ns
                        
                        # --- DataFrame Construction ---
                        # Create dict: {'Load Cell': [v1, v2], 'Strain': [v3, v4]}
                        data_dict = dict(zip(NIDAQ_CHANNELS, data_buffer))
                        data_dict['timestamps'] = pd.to_datetime(timestamps_ns, unit='ns')
                        
                        df = pd.DataFrame(data_dict)

                        # Reorder columns: Timestamp first, then channels
                        cols = ['timestamps'] + NIDAQ_CHANNELS
                        df = df[cols]
                        
                        # --- 1. Send to QuestDB ---
                        try:
                            sender.dataframe(df, table_name=QUESTDB_TABLE, at='timestamps')
                            # Optional: Flush periodically if needed, though auto-flush is usually fine
                            sender.flush() 
                        except IngressError as e:
                            logging.error(f"QuestDB Ingress Error: {e}")

                        # --- 2. Save to CSV ---
                        try:
                            # If it's the first write, include header and use 'w' mode
                            # Otherwise, append ('a') and skip header
                            mode = 'w' if not csv_header_written else 'a'
                            header = not csv_header_written
                            
                            df.to_csv(csv_filename, mode=mode, header=header, index=False)
                            csv_header_written = True
                            
                        except Exception as e:
                            logging.error(f"CSV Save Error: {e}")

                        total_samples_sent += samples_available
                        print(f"\rTotal Samples Streamed: {total_samples_sent}", end="")

                    # Sleep to prevent tight loop CPU hogging
                    time.sleep(1 / POLLING_FREQ)

    except nidaqmx.DaqError as e:
        logging.error(f"NIDAQ Error: {e}")
    except KeyboardInterrupt:
        logging.info("\nStopping acquisition (User Interrupt).")
    except Exception as e:
        logging.error(f"General Error: {e}")

if __name__ == "__main__":
    while True:
        try:
            stream_nidaq_to_questdb()
        except Exception as e:
            print(f"HIGH LEVEL ERROR: {e}")
            time.sleep(1)