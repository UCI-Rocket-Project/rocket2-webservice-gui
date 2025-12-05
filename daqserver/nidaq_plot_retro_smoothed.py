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
nidaqFreq = 1000        # Desired Output Samples per second (Effective Rate)
duration = 10            # Seconds to record
total_samples = nidaqFreq * duration

# --- NEW: Oversampling Configuration ---
# The hardware will sample 10x faster, then average down to nidaqFreq
OVERSAMPLE_FACTOR = 50   
hardware_rate = nidaqFreq * OVERSAMPLE_FACTOR
hardware_samples = total_samples * OVERSAMPLE_FACTOR

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
                    min_val=-0.02, # Updated to match your plot range preference
                    max_val=0.02,
                    terminal_config=TerminalConfiguration.DIFF, 
                    name_to_assign_to_channel=channel_name
                )

            num_channels = len(NIDAQ_DATA_FORMAT)

            # 2. Configure Timing
            # We use hardware_rate and hardware_samples to capture 10x data
            task.timing.cfg_samp_clk_timing(
                rate=hardware_rate,
                sample_mode=AcquisitionType.FINITE,
                samps_per_chan=hardware_samples
            )

            # 3. Setup Reader
            reader = AnalogMultiChannelReader(task.in_stream)
            
            # Pre-allocate buffer for the HIGH SPEED (raw) data
            raw_buffer = np.zeros((num_channels, hardware_samples), dtype=np.float64)

            print(f"Starting acquisition for {duration} seconds...")
            print(f"  > Target Rate: {nidaqFreq} Hz")
            print(f"  > Oversampling: {OVERSAMPLE_FACTOR}x (Hardware Rate: {hardware_rate} Hz)")
            print(f"  > Raw Samples: {hardware_samples}")

            # 4. Start Task and Read
            task.start()
            
            reader.read_many_sample(
                data=raw_buffer,
                number_of_samples_per_channel=hardware_samples,
                timeout=duration + 5.0 
            )
            
            print("Acquisition complete. Processing oversampling...")

            # --- PROCESS OVERSAMPLING (Averaging) ---
            # Reshape array to separate the oversampled blocks:
            # From: (Channels, Total_Raw_Samples)
            # To:   (Channels, Desired_Samples, OVERSAMPLE_FACTOR)
            reshaped_data = raw_buffer.reshape(num_channels, total_samples, OVERSAMPLE_FACTOR)
            
            # Take the mean along the last axis to average every 10 points into 1
            data_buffer = np.mean(reshaped_data, axis=2)

            # Apply Scaling to Lbs
            data_buffer *= 149866.66666
            
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
    
    num_samples = data.shape[1]
    time_axis = np.linspace(0, num_samples / freq, num_samples)

    plt.figure(figsize=(10, 6))
    
    # --- FIX: DECIMATION / DOWNSAMPLING ---
    # Plotting 1 million points causes an overflow. 
    # We will plot every Nth point to make the graph renderable.
    # 100,000 Hz / 10 = 10,000 points per second (still very high res visually)
    decimation_factor = 10 
    
    # If you have > 5 million points, increase this to 100
    if num_samples > 1000000:
        decimation_factor = 100

    # Iterate through channels
    for i, channel_name in enumerate(channel_names):
        if "Bat" in channel_name:
            continue
            
        # Apply the slice [::decimation_factor] to skip points
        plt.plot(
            time_axis[::decimation_factor], 
            data[i][::decimation_factor], 
            label=channel_name
        )

    plt.title(f"NIDAQ Data ({duration}s Scan)")
    plt.xlabel("Time (s)")
    plt.ylabel("Force (lbs)")
    
    # Disable scientific notation on Y axis
    plt.ticklabel_format(style='plain', axis='y', useOffset=False)
    
    plt.legend(loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    scan_and_plot()