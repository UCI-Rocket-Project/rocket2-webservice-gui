import matplotlib.pyplot as plt
import numpy as np
import os

# --- Calibration Parameters ---
SLOPE = 149866.66666    
INTERCEPT = 0

# --- FFT Filter Settings ---
ENABLE_FILTER = True
# "pass" = Keep frequencies INSIDE range (Bandpass)
# "stop" = Remove frequencies INSIDE range (Bandstop/Notch)
FILTER_MODE = 'pass' 

# Adjusted to 0-5 Hz so you can see the weight (DC signal). 
# Set to 50000 and 150000 for your specific request, but ensure your Sampling Rate > 300,000 Hz!
FILTER_LOW_FREQ = 0
FILTER_HIGH_FREQ = 9999

# Map: file_index -> weight
# file_map = {
#     2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
#     13: 115, 15: 132, 17: 153, 19: 178, 21: 203
# }
file_map = {
    0: 0, 18: 18, 132: 132, 117: 117, 150: 150, 160: 160,
    130: 130, 185: 185,
}

# --- Path Configuration & Debugging ---
# Set this to the folder name where your CSVs are stored. 
# Use "." if they are in the same folder as this script.
DATA_DIR = "raw_clean" 

print(f"Current Working Directory: {os.getcwd()}")
print(f"Looking for data files in: {os.path.abspath(DATA_DIR)}")

if not os.path.exists(DATA_DIR):
    print(f"!!! CRITICAL ERROR !!!")
    print(f"The directory '{DATA_DIR}' does not exist.")
    print(f"The script is looking here: {os.path.abspath(DATA_DIR)}")
    print("Please create the folder or move your 'aX_cleaned.csv' files there.")

def apply_fft_filter(time_data, signal_data, low_cut, high_cut, mode='pass'):
    """
    Applies an FFT-based filter to the signal.
    """
    n = len(time_data)
    if n == 0: return signal_data
    
    # Calculate average sampling rate (fs)
    dt = np.mean(np.diff(time_data))
    fs = 1.0 / dt
    
    # Check if request is possible
    max_measurable_freq = fs / 2
    if low_cut > max_measurable_freq:
        print(f"  [Filter Warning] Cutoff ({low_cut} Hz) is higher than Nyquist freq ({max_measurable_freq:.1f} Hz). Filter may be empty.")

    # 1. Compute FFT
    # rfft is used for real-valued signals (faster, returns positive freqs only)
    fft_vals = np.fft.rfft(signal_data)
    fft_freqs = np.fft.rfftfreq(n, d=dt)
    
    # 2. Create Filter Mask
    # Identify indices that are INSIDE the range
    indices_in_range = np.where((fft_freqs >= low_cut) & (fft_freqs <= high_cut))
    
    if mode == 'pass':
        # BANDPASS: Zero out everything NOT in range
        mask = np.zeros_like(fft_vals, dtype=bool)
        mask[indices_in_range] = True
        fft_vals[~mask] = 0.0
        
    elif mode == 'stop':
        # BANDSTOP: Zero out everything INSIDE range
        fft_vals[indices_in_range] = 0.0
        
    # 3. Inverse FFT
    filtered_signal = np.fft.irfft(fft_vals, n=n)
    return filtered_signal, fs

plt.figure(figsize=(12, 8))

print(f"{'File':<10} | {'Target':<10} | {'Max (lb)':<10} | {'Min (lb)':<10} | {'Spread (+/-)':<15} | {'Fs (Hz)':<10}")
print("-" * 90)

for idx, weight in file_map.items():
    # Robustly join paths (handles Windows/Mac/Linux slashes automatically)
    filename = os.path.join(DATA_DIR, f"a{idx}.csv")
    
    if os.path.exists(filename):
        # Load data
        data = np.genfromtxt(filename, delimiter=',', skip_header=1)
        
        # Col 0 is Time, Col 2 is Load Cell (Avg)
        time = data[:, 0]
        voltage = data[:, 1]
        
        # Apply Calibration
        mass = (voltage * SLOPE) + INTERCEPT
        
        # --- Apply Filter if Enabled ---
        final_mass = mass
        fs_display = 0.0
        
        if ENABLE_FILTER:
            filtered_mass, fs = apply_fft_filter(time, mass, FILTER_LOW_FREQ, FILTER_HIGH_FREQ, FILTER_MODE)
            fs_display = fs
            final_mass = filtered_mass
            # Plot raw faintly
            #plt.plot(time, mass, color='gray', alpha=0.3, linewidth=0.5)
            # Plot filtered solidly
            line, = plt.plot(time, final_mass, label=f'{weight}lb (Filtered)')
        else:
            line, = plt.plot(time, mass, label=f'{weight}lb (Raw)')
            if len(time) > 1:
                fs_display = 1.0 / np.mean(np.diff(time))

        color = line.get_color()
        
        # Calculate Stats on the FINAL (possibly filtered) mass
        max_val = np.max(final_mass)
        min_val = np.min(final_mass)
        spread = (max_val - min_val) / 2
        
        print(f"a{idx}.csv   | {weight:<10} | {max_val:<10.4f} | {min_val:<10.4f} | {spread:<15.4f} | {fs_display:<10.1f}")

        # Add horizontal reference lines
        plt.axhline(y=weight, color='black', linestyle=':', alpha=0.3)
        plt.axhline(y=max_val, color=color, linestyle='--', alpha=0.4, linewidth=1)
        plt.axhline(y=min_val, color=color, linestyle='--', alpha=0.4, linewidth=1)
        
    else:
        print(f"Warning: {filename} not found.")

title_str = 'Calibrated Mass vs Time'
if ENABLE_FILTER:
    title_str += f' (FFT Filter: {FILTER_MODE.upper()} {FILTER_LOW_FREQ}-{FILTER_HIGH_FREQ} Hz)'

plt.title(title_str)
plt.xlabel('Time (s)')
plt.ylabel('Mass (lbs)')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.grid(True)
plt.show()