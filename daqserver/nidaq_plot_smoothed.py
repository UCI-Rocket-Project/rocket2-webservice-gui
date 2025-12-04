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
target_freq = 100        # The final desired data rate (samples per second)
duration = 5             # Seconds to record
samples_to_average = 100 # Number of raw samples to average into one output sample

# Calculated Hardware Parameters
hw_sampling_rate = target_freq * samples_to_average  # e.g., 100 * 100 = 10,000 Hz
total_output_samples = target_freq * duration        # Final number of points 
total_raw_samples = hw_sampling_rate * duration      # Raw number of points

# Define your channel names here
NIDAQ_DATA_FORMAT = ["Load Cell", "Battery"] 

def scan_and_plot():
    try:
        with nidaqmx.Task() as task:
            # 1. Setup Channels
            for i, channel_name in enumerate(NIDAQ_DATA_FORMAT):
                task.ai_channels.add_ai_voltage_chan(
                    f"{nidaq_device}/ai{i}",
                    min_val=-10.0, 
                    max_val=10.0,
                    terminal_config=TerminalConfiguration.DIFF, # Using Differential signaling
                    name_to_assign_to_channel=channel_name
                )

            num_channels = len(NIDAQ_DATA_FORMAT)

            # 2. Configure Timing (Running hardware faster)
            task.timing.cfg_samp_clk_timing(
                rate=hw_sampling_rate,
                sample_mode=AcquisitionType.FINITE,
                samps_per_chan=total_raw_samples
            )

            # 3. Setup Reader
            reader = AnalogMultiChannelReader(task.in_stream)
            
            # Buffer for High-Speed Raw Data
            raw_buffer = np.zeros((num_channels, total_raw_samples), dtype=np.float64)

            print(f"Starting acquisition for {duration} seconds...")
            print(f"  > Target Output Rate: {target_freq} Hz")
            print(f"  > Actual Hardware Rate: {hw_sampling_rate} Hz ({samples_to_average}x Oversample)")
            print(f"  > Total Raw Samples: {total_raw_samples}")

            # 4. Start Task and Read
            task.start()
            
            reader.read_many_sample(
                data=raw_buffer,
                number_of_samples_per_channel=total_raw_samples,
                timeout=duration + 5.0 
            )
            
            print("Acquisition complete. Processing data...")

            # 5. Process: Calculate Average
            # Reshape: (Channels, OutputSamples, SamplesPerAvg)
            reshaped_data = raw_buffer.reshape(num_channels, total_output_samples, samples_to_average)
            averaged_data = np.mean(reshaped_data, axis=2)

            # 6. Export to CSV (Saving BOTH Raw and Averaged)
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            csv_filename = f"nidaq_data_full_{timestamp_str}.csv"
            
            save_full_csv(
                raw_data=raw_buffer, 
                avg_data=averaged_data, 
                hw_freq=hw_sampling_rate, 
                channel_names=NIDAQ_DATA_FORMAT, 
                filename=csv_filename,
                avg_factor=samples_to_average
            )

            # 7. Plotting (Using the smoothed data for visual clarity)
            create_plot(averaged_data, target_freq, NIDAQ_DATA_FORMAT)

    except nidaqmx.DaqError as e:
        print(f"DAQ Error: {e}")
    except Exception as e:
        print(f"General Error: {e}")

def save_full_csv(raw_data, avg_data, hw_freq, channel_names, filename, avg_factor):
    """
    Saves both Raw and Averaged data to a single CSV.
    Expands the averaged data to match the raw data length.
    """
    print(f"Saving combined data to {filename}...")
    
    num_raw_samples = raw_data.shape[1]
    time_axis = np.linspace(0, num_raw_samples / hw_freq, num_raw_samples)
    
    # Expand averaged data to match raw data length (staircase effect)
    # We repeat each averaged value 'avg_factor' times
    avg_data_expanded = np.repeat(avg_data, avg_factor, axis=1)

    # Transpose for row-writing
    raw_T = raw_data.T
    avg_T = avg_data_expanded.T
    
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer("./saves/" + file)
        
        # Build Header: Time, Ch1_Raw, Ch1_Avg, Ch2_Raw, Ch2_Avg...
        header = ["Time(s)"]
        for name in channel_names:
            header.append(f"{name} (Raw)")
            header.append(f"{name} (Avg)")
        writer.writerow(header)
        
        # Write Rows
        for i in range(num_raw_samples):
            row = [time_axis[i]]
            for ch_idx in range(len(channel_names)):
                row.append(raw_T[i, ch_idx])        # Raw Value
                row.append(avg_T[i, ch_idx])        # Averaged Value (Repeated)
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
        # We explicitly skip Battery on the PLOT only, but it is saved in CSV
        if "Bat" in channel_name:
            continue
        plt.plot(time_axis, data[i], label=channel_name)

    plt.title(f"NIDAQ Data ({duration}s Scan - {samples_to_average}x Averaged)")
    plt.xlabel("Time (s)")
    plt.ylabel("Voltage (V)")
    plt.legend(loc='upper right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    scan_and_plot()