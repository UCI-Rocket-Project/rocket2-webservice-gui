import nidaqmx
from nidaqmx.constants import AcquisitionType, TerminalConfiguration
from nidaqmx.stream_readers import AnalogMultiChannelReader
import numpy as np
import matplotlib.pyplot as plt
import time
import csv
from datetime import datetime

# --- Configuration ---
nidaq_device = "Dev1"
nidaqFreq = 100000        # Samples per second
duration = 10              # Seconds to record
total_samples = int(nidaqFreq * duration)
pythonPollingFreq = 100

# Define your channel names here
NIDAQ_DATA_FORMAT = ["Load Cell"] 

def save_to_csv(data, freq, channel_names, filename):
    print(f"Saving data to {filename}...")
    num_samples = data.shape[1]
    time_axis = np.linspace(0, num_samples / freq, num_samples)
    
    # Transpose data so rows are samples (Time, Ch1, Ch2, Ch3...)
    # Current shape is (Channels, Samples), we want (Samples, Channels)
    data_T = data.T
    
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        
        # Write Header
        header = ["Time(s)"] + channel_names
        writer.writerow(header)
        
        # Write Rows
        # Zip time with data for efficient writing
        for i in range(num_samples):
            row = [time_axis[i]] + list(data_T[i])
            writer.writerow(row)
            
    print("Save complete.")

def create_plot(data, freq, channel_names):
    print("Generating plot...")
    
    num_samples = data.shape[1]
    time_axis = np.linspace(0, num_samples / freq, num_samples)

    plt.figure(figsize=(10, 6))
    
    # Iterate through channels and plot them
    for i, channel_name in enumerate(channel_names):
        # Optional: Skip specific channels if needed
        if "Bat" in channel_name:
            continue
        plt.plot(time_axis, data[i], label=channel_name)

    plt.title(f"NIDAQ Data ({duration}s Scan)")
    plt.xlabel("Time (s)")
    plt.ylabel("Voltage (V)")
    
    # --- Formatting Changes ---
    plt.ylim(-0.025, 0.025) # Adjusted slightly to view limits
    plt.ticklabel_format(style='plain', axis='y', useOffset=False)
    
    plt.legend(loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

def scan_and_plot():
    try:
        with nidaqmx.Task() as task:
            # 1. Setup Channels
            for i, channel_name in enumerate(NIDAQ_DATA_FORMAT):
                task.ai_channels.add_ai_voltage_chan(
                    f"{nidaq_device}/ai{i}",
                    min_val=-0.02, 
                    max_val=0.02,
                    terminal_config=TerminalConfiguration.DIFF, 
                    name_to_assign_to_channel=channel_name
                )

            num_channels = len(NIDAQ_DATA_FORMAT)

            # 2. Configure Timing
            task.timing.cfg_samp_clk_timing(
                rate=nidaqFreq,
                sample_mode=AcquisitionType.CONTINUOUS,
                samps_per_chan=total_samples
            )

            # 3. Setup Reader
            reader = AnalogMultiChannelReader(task.in_stream)
            
            # Pre-allocate MAIN buffer 
            data_buffer = np.zeros((num_channels, total_samples), dtype=np.float64)

            print(f"Starting acquisition for {duration} seconds...")
            print(f"  > Rate: {nidaqFreq} Hz")
            print(f"  > Total Samples: {total_samples}")

            # 4. Start Task
            task.start()

            samples_collected_so_far = 0

            while samples_collected_so_far < total_samples:
                
                samples_available = task.in_stream.avail_samp_per_chan
                
                if samples_available > 0:
                    # SAFETY CHECK: Don't read more than we have space left for
                    samples_remaining = total_samples - samples_collected_so_far
                    samples_to_read = min(samples_available, samples_remaining)
                    
                    # Create a temp buffer just for this chunk
                    messy_data_buffer = np.empty((num_channels, samples_to_read), dtype=np.float64)

                    # Read into temp buffer
                    reader.read_many_sample(
                        data=messy_data_buffer, 
                        number_of_samples_per_channel=samples_to_read,
                        timeout=10.0
                    )
                    
                    # APPEND TO GENERAL BUFFER
                    start_idx = samples_collected_so_far
                    end_idx = samples_collected_so_far + samples_to_read

                    # Insert the chunk into the correct slot in the main buffer
                    data_buffer[:, start_idx:end_idx] = messy_data_buffer
                
                    samples_collected_so_far += samples_to_read
                    print(f"Collected: {samples_collected_so_far} / {total_samples}")
                
                # Sleep to prevent CPU hogging
                time.sleep(1 / pythonPollingFreq)

            print("Acquisition complete.")

            # 5. Export to CSV
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            csv_filename = f"nidaq_data_{timestamp_str}.csv"
            save_to_csv(data_buffer, nidaqFreq, NIDAQ_DATA_FORMAT, csv_filename)

            # 6. Plotting
            create_plot(data_buffer, nidaqFreq, NIDAQ_DATA_FORMAT)

    except nidaqmx.DaqError as e:
        print(f"DAQ Error: {e}")
    except Exception as e:
        print(f"General Error: {e}")

if __name__ == "__main__":
    scan_and_plot()