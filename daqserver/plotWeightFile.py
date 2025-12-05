import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import argparse

# --- Configuration ---
# You can change this to your specific filename
DEFAULT_FILENAME = "lone_data/mealex.csv" 

# Calibration Constants (From your previous code)
# Set APPLY_CALIBRATION to True if your CSV has raw Volts and you want Lbs
APPLY_CALIBRATION = True 
CALIB_SLOPE = 221496.118985
CALIB_OFFSET = -2926.253938

def plot_csv(filename):
    print(f"Reading {filename}...")
    
    # 1. Read CSV
    try:
        df = pd.read_csv(filename)
    except FileNotFoundError:
        print(f"Error: Could not find file '{filename}'")
        return

    # 2. Process Timestamp
    # Convert string ISO timestamps to datetime objects
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Calculate relative time in seconds starting from 0
        start_time = df['timestamp'].iloc[0]
        df['time_rel'] = (df['timestamp'] - start_time).dt.total_seconds()
    else:
        print("Error: CSV must contain a 'timestamp' column.")
        return

    # 3. Process Load Cell Data
    y_column = "Load Cell" # Adjust if your header name is different
    
    if y_column not in df.columns:
        # Fallback: try to find the first column that isn't timestamp or time_rel
        cols = [c for c in df.columns if 'time' not in c.lower()]
        if cols:
            y_column = cols[0]
            print(f"Warning: '{y_column}' column found, using that for Y-axis.")
        else:
            print(f"Error: Could not find '{y_column}' column.")
            return

    # Optional: Apply Calibration if the data looks like Raw Voltage (e.g. 0.013)
    if APPLY_CALIBRATION:
        print("Applying calibration (mx + b)...")
        df[y_column] = (df[y_column] * CALIB_SLOPE) + CALIB_OFFSET
        y_label = "Force (lbs)"
    else:
        y_label = "Raw Value"

    # 4. Plotting
    create_plot(df['time_rel'], df[y_column], y_label)

def create_plot(x_data, y_data, y_label):
    print("Generating plot...")
    
    plt.figure(figsize=(10, 6))
    
    num_samples = len(y_data)
    
    # --- Decimation/Downsampling ---
    # Logic to skip points if the file is massive, preventing lag
    decimation_factor = 1
    if num_samples > 1_000_000:
        decimation_factor = 100
        print(f"Dataset is large ({num_samples} points). Downsampling by {decimation_factor}x for performance.")
    elif num_samples > 100_000:
        decimation_factor = 10
        print(f"Downsampling by {decimation_factor}x for performance.")

    # Plot with decimation slice [::decimation_factor]
    plt.plot(
        x_data[::decimation_factor], 
        y_data[::decimation_factor], 
        label="Load Cell Data",
        linewidth=1
    )

    plt.title(f"CSV Data Plot ({num_samples} samples)")
    plt.xlabel("Time (s)")
    plt.ylabel(y_label)
    
    # Disable scientific notation on Y axis (forces 1234.5 instead of 1.2e3)
    plt.ticklabel_format(style='plain', axis='y', useOffset=False)
    
    plt.legend(loc='upper right')
    plt.grid(True, which='both', linestyle='--', linewidth=0.5)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    # Allows running like: python plot_csv.py --file my_data.csv
    import sys
    file_to_open = DEFAULT_FILENAME
    
    if len(sys.argv) > 1:
        file_to_open = sys.argv[1]
        
    plot_csv(file_to_open)