import nidaqmx
from nidaqmx.constants import AcquisitionType, TerminalConfiguration
from nidaqmx.stream_readers import AnalogMultiChannelReader
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time
import logging
from datetime import datetime
from questdb.ingress import Sender, IngressError

# --- Configuration ---

# NIDAQ Settings
NIDAQ_DEVICE = "Dev1"
NIDAQ_CHANNELS = ["Load Cell"] 
SAMPLING_RATE = 10000        # Hz
DURATION = 10                # Seconds to record
TOTAL_SAMPLES_TARGET = SAMPLING_RATE * DURATION

# Calibration Constants (Applied before QuestDB/CSV)
CALIB_SLOPE = 221496.118985
CALIB_OFFSET = -2926.253938

# QuestDB Settings
QUESTDB_CONF = 'http::addr=localhost:9000;'
QUESTDB_TABLE = 'LOAD_CELL'

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def run_scan_and_stream():
    logging.info(f"Starting {DURATION}s acquisition on {NIDAQ_DEVICE}...")
    
    # Storage for the final plot/CSV
    all_data_frames = []
    total_samples_collected = 0
    
    try:
        # 1. Initialize NIDAQ Task
        with nidaqmx.Task() as task:
            
            # Setup Channels
            for i, channel_name in enumerate(NIDAQ_CHANNELS):
                physical_channel = f"{NIDAQ_DEVICE}/ai{i}"
                task.ai_channels.add_ai_voltage_chan(
                    physical_channel,
                    min_val=-0.02, # Matching your range preference
                    max_val=0.02,
                    terminal_config=TerminalConfiguration.DIFF,
                    name_to_assign_to_channel=channel_name
                )
            
            num_channels = len(NIDAQ_CHANNELS)

            # Setup Timing (Continuous allows us to read chunks while streaming)
            task.timing.cfg_samp_clk_timing(
                rate=SAMPLING_RATE,
                sample_mode=AcquisitionType.CONTINUOUS, 
                samps_per_chan=SAMPLING_RATE  # Buffer size (1 second worth)
            )

            reader = AnalogMultiChannelReader(task.in_stream)

            # 2. Connect to QuestDB
            with Sender.from_conf(QUESTDB_CONF) as sender:
                logging.info(f"Connected to QuestDB. Streaming...")
                task.start()
                
                start_time = time.time()
                
                # --- Acquisition Loop ---
                while total_samples_collected < TOTAL_SAMPLES_TARGET:
                    
                    # Check available samples
                    samples_available = task.in_stream.avail_samp_per_chan
                    
                    if samples_available > 0:
                        # Prevent reading more than needed to finish the duration
                        remaining_samples = TOTAL_SAMPLES_TARGET - total_samples_collected
                        to_read = min(samples_available, remaining_samples)
                        
                        # Allocate buffer: (Channels, Samples)
                        buffer = np.zeros((num_channels, to_read), dtype=np.float64)
                        
                        reader.read_many_sample(
                            data=buffer,
                            number_of_samples_per_channel=to_read,
                            timeout=5.0
                        )
                        
                        # --- Apply Calibration Here ---
                        # y = mx + b
                        buffer *= CALIB_SLOPE
                        buffer += CALIB_OFFSET
                        
                        # --- Timestamp Calculation (Back-calculated from now) ---
                        current_time_ns = time.time_ns()
                        period_ns = (1 / SAMPLING_RATE) * 1_000_000_000
                        duration_ns = (to_read - 1) * period_ns
                        relative_ns = (np.arange(to_read, dtype=np.float64) * period_ns) - duration_ns
                        timestamps_ns = relative_ns.astype(np.int64) + current_time_ns

                        # --- Create DataFrame ---
                        data_dict = dict(zip(NIDAQ_CHANNELS, buffer))
                        data_dict['timestamps'] = pd.to_datetime(timestamps_ns, unit='ns')
                        
                        df_chunk = pd.DataFrame(data_dict)
                        
                        # Reorder for neatness
                        cols = ['timestamps'] + NIDAQ_CHANNELS
                        df_chunk = df_chunk[cols]

                        # 1. Send to QuestDB
                        try:
                            sender.dataframe(df_chunk, table_name=QUESTDB_TABLE, at='timestamps')
                            sender.flush()
                        except IngressError as e:
                            logging.error(f"QuestDB Error: {e}")

                        # 2. Store locally for CSV/Plot
                        all_data_frames.append(df_chunk)
                        
                        total_samples_collected += to_read
                        print(f"\rProgress: {total_samples_collected}/{TOTAL_SAMPLES_TARGET} samples", end="")

                    else:
                        time.sleep(0.001) # Tiny sleep to yield CPU
                
            print("\nAcquisition Complete.")

    except nidaqmx.DaqError as e:
        logging.error(f"DAQ Error: {e}")
        return
    except Exception as e:
        logging.error(f"General Error: {e}")
        return

    # --- Post-Processing ---
    if not all_data_frames:
        logging.warning("No data collected.")
        return

    # Combine all chunks into one large DataFrame
    full_df = pd.concat(all_data_frames, ignore_index=True)

    # 1. Save to CSV
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"nidaq_data_{timestamp_str}.csv"
    logging.info(f"Saving full dataset to {csv_filename}...")
    full_df.to_csv(csv_filename, index=False)

    # 2. Plot
    create_plot(full_df)

def create_plot(df):
    logging.info("Generating plot...")
    
    # Extract data for plotting
    # We use a relative time axis (0 to Duration) for the plot, easier to read than Dates
    num_samples = len(df)
    time_axis = np.linspace(0, num_samples / SAMPLING_RATE, num_samples)
    
    plt.figure(figsize=(10, 6))
    
    # --- Decimation/Downsampling ---
    # Plotting every point is slow/heavy. We skip points for visualization.
    decimation_factor = 10
    if num_samples > 1_000_000:
        decimation_factor = 100
        
    for channel in NIDAQ_CHANNELS:
        plt.plot(
            time_axis[::decimation_factor], 
            df[channel].values[::decimation_factor], 
            label=channel
        )

    plt.title(f"NIDAQ Data ({DURATION}s Scan)")
    plt.xlabel("Time (s)")
    plt.ylabel("Force (lbs)") # Assuming lbs based on your calibration
    
    # Disable scientific notation on Y axis
    plt.ticklabel_format(style='plain', axis='y', useOffset=False)
    
    plt.legend(loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    run_scan_and_stream()