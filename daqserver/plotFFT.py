import matplotlib.pyplot as plt
import numpy as np
import os
import math

# --- Configuration ---
# Set this to the folder name where your CSVs are stored.
DATA_DIR = "raw_clean" 

# Map: file_index -> weight
# file_map = {
#     2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
#     13: 115, 15: 132, 17: 153, 19: 178, 21: 203
# }


file_map = {
    0: 0, 18: 18, 132: 132, 117: 117, 150: 150, 160: 160,
    130: 130, 185: 185,
}

# --- Setup Plot Grid ---
num_plots = len(file_map)
cols = 3
rows = math.ceil(num_plots / cols)

# Create a large figure to hold all subplots
fig, axes = plt.subplots(rows, cols, figsize=(15, 4 * rows), constrained_layout=True)
axes_flat = axes.flatten()

print(f"Generating FFTs for {num_plots} files from '{DATA_DIR}'...")

for i, (idx, weight) in enumerate(file_map.items()):
    ax = axes_flat[i]
    filename = os.path.join(DATA_DIR, f"a{idx}.csv")
    
    if os.path.exists(filename):
        # 1. Load Data
        # Using Col 2 (Load Cell Avg) to match your Mass vs Time script
        # If you want to analyze RAW noise, change index to 1
        data = np.genfromtxt(filename, delimiter=',', skip_header=1)
        
        time = data[:, 0]
        voltage = data[:, 1] 
        
        # 2. Calculate Sampling Rate (Fs)
        # We need this to know what the Frequency axis (X-axis) means
        n = len(time)
        if n > 1:
            dt = np.mean(np.diff(time))
            fs = 1.0 / dt
        else:
            fs = 1.0 # Fallback
            
        # 3. Compute FFT
        # rfft = Real FFT (efficient for real-valued data)
        fft_vals = np.fft.rfft(voltage)
        fft_freqs = np.fft.rfftfreq(n, d=dt)
        
        # Calculate Magnitude (Amplitude)
        # Normalize by N so amplitude doesn't grow with file length
        fft_mag = np.abs(fft_vals) / n
        
        # 4. Plot
        # We skip index 0 (DC Component / 0Hz) because it represents the 
        # static weight and is usually HUGE compared to the noise.
        ax.plot(fft_freqs[1:], fft_mag[1:], color='purple')
        
        ax.set_title(f"File a{idx} ({weight} lbs)\nFs: {fs:.1f} Hz")
        ax.set_xlabel("Frequency (Hz)")
        ax.set_ylabel("Amplitude")
        ax.grid(True, alpha=0.3)
        
    else:
        ax.text(0.5, 0.5, "File Not Found", ha='center', va='center', color='red')
        ax.set_title(f"a{idx} Missing")

# Turn off empty subplots if any
for j in range(i + 1, len(axes_flat)):
    axes_flat[j].axis('off')

plt.suptitle("FFT Noise Analysis (DC Component Removed)", fontsize=16)
plt.show()