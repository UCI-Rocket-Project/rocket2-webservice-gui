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
duration = 5            # Seconds to record
total_samples = nidaqFreq * duration

# Define your channel names here (or import them)
NIDAQ_DATA_FORMAT = ["Load Cell"] 

def scan_and_plot():
    try:
        with nidaqmx.Task() as task:
            # 1. Setup Channels
            # Note: channel_port is used to map specific hardware pins (ai0, ai1, etc.)
            for i, channel_name in enumerate(NIDAQ_DATA_FORMAT):
                task.ai_channels.add_ai_voltage_chan(
                    f"{nidaq_device}/ai{i}",
                    min_val=-10, # Updated to match your plot range preference
                    max_val=10,
                    terminal_config=TerminalConfiguration.DIFF, 
                    name_to_assign_to_channel=channel_name
                )

            num_channels = len(NIDAQ_DATA_FORMAT)

            # 2. Configure Timing
            # Reverted to simple finite acquisition without oversampling
            task.timing.cfg_samp_clk_timing(
                rate=nidaqFreq,
                sample_mode=AcquisitionType.FINITE,
                samps_per_chan=total_samples
            )

            # 3. Setup Reader
            reader = AnalogMultiChannelReader(task.in_stream)
            
            # Pre-allocate buffer 
            data_buffer = np.zeros((num_channels, total_samples), dtype=np.float64)

            print(f"Starting acquisition for {duration} seconds...")
            print(f"  > Rate: {nidaqFreq} Hz")
            print(f"  > Total Samples: {total_samples}")

            # 4. Start Task and Read
            task.start()
            
            reader.read_many_sample(
                data=data_buffer,
                number_of_samples_per_channel=total_samples,
                timeout=duration + 5.0 
            )
            
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
        for i in range(num_samples):
            # Create a row: [Time, Val1, Val2, Val3]
            row = [time_axis[i]] + list(data_T[i])
            writer.writerow(row)
            
    print("Save complete.")

def create_plot(data, freq, channel_names):
    print("Generating plot...")
    
    # Create time axis
    num_samples = data.shape[1]
    time_axis = np.linspace(0, num_samples / freq, num_samples)

    plt.figure(figsize=(10, 6))
    
    # Iterate through channels and plot them
    for i, channel_name in enumerate(channel_names):
        if "Bat" in channel_name:
            continue
        plt.plot(time_axis, data[i], label=channel_name)

    plt.title(f"NIDAQ Data ({duration}s Scan)")
    plt.xlabel("Time (s)")
    plt.ylabel("Voltage (V)")
    
    # --- Formatting Changes ---
    # 1. Force fixed Y-axis limits
    #.plt.ylim(-10, 10)
    
    # 2. Disable scientific notation (e.g. 1e-3)
    # useOffset=False prevents matplotlib from doing the "+1.23e-5" thing at the top of the axis
    plt.ticklabel_format(style='plain', axis='y', useOffset=False)
    
    plt.legend(loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    scan_and_plot()