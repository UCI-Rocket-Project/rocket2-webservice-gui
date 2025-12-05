import matplotlib.pyplot as plt
import numpy as np
import os
import math

# --- Configuration ---
# Folder containing your CSV files
DATA_DIR = "tickledavid" 

# Column index to analyze. 
# 1 = Load Cell (Raw) - usually best for noise analysis
# 2 = Load Cell (Avg)
VOLTAGE_COLUMN = 1

# --- File Discovery ---
print(f"Scanning '{DATA_DIR}' for CSV files...")

if not os.path.exists(DATA_DIR):
    print(f"Error: Directory '{DATA_DIR}' not found.")
    exit()

# Get all CSV files and sort them naturally
csv_files = [f for f in os.listdir(DATA_DIR) if f.lower().endswith('.csv')]
csv_files.sort() # Sorts alphabetically (a1, a10, a2...)

if not csv_files:
    print("No CSV files found in the directory.")
    exit()

# --- Setup Plot Grid ---
num_plots = len(csv_files)
cols = 3
rows = math.ceil(num_plots / cols)

print(f"Found {num_plots} files. Generating {rows}x{cols} grid...")

# Create figure
# constrained_layout=True helps fit titles and labels automatically
fig, axes = plt.subplots(rows, cols, figsize=(15, 4 * rows), constrained_layout=True)

# Flatten axes array for easy iteration (handles 1D and 2D arrays)
if num_plots > 1:
    axes_flat = axes.flatten()
else:
    axes_flat = [axes]

for i, filename in enumerate(csv_files):
    ax = axes_flat[i]
    filepath = os.path.join(DATA_DIR, filename)
    
    try:
        # 1. Load Data
        data = np.genfromtxt(filepath, delimiter=',', skip_header=1)
        
        # Check if file is empty or malformed
        if data.ndim < 2 or data.shape[0] < 2:
            ax.text(0.5, 0.5, "Insufficient Data", ha='center', color='red')
            ax.set_title(filename)
            continue

        time = data[:, 0]
        voltage = data[:, VOLTAGE_COLUMN] 
        
        # 2. Calculate Sampling Rate (Fs)
        dt = np.mean(np.diff(time))
        fs = 1.0 / dt
            
        # 3. Compute FFT
        n = len(time)
        fft_vals = np.fft.rfft(voltage)
        fft_freqs = np.fft.rfftfreq(n, d=dt)
        
        # Calculate Magnitude (Amplitude) & Normalize
        fft_mag = np.abs(fft_vals) / n
        
        # 4. Plot
        # Skip index 0 (DC Component)
        ax.plot(fft_freqs[1:], fft_mag[1:], color='purple', linewidth=0.8)
        
        ax.set_title(f"{filename}\nFs: {fs:.1f} Hz")
        ax.set_xlabel("Frequency (Hz)")
        ax.set_ylabel("Amplitude")
        ax.grid(True, alpha=0.3)
        
        print(f"Processed {filename} (Fs: {fs:.0f} Hz)")

    except Exception as e:
        ax.text(0.5, 0.5, f"Error reading file", ha='center', color='red')
        ax.set_title(f"{filename} (Error)")
        print(f"Error processing {filename}: {e}")

# Turn off empty subplots
for j in range(num_plots, len(axes_flat)):
    axes_flat[j].axis('off')

plt.suptitle(f"FFT Noise Analysis - {DATA_DIR}", fontsize=16)
plt.show()