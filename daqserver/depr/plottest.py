import pandas as pd
import matplotlib.pyplot as plt

# --- CONFIGURATION: Calibration Constants ---
# Equation: Weight = (Voltage - Intercept) / Slope
SLOPE = 7.359217313037492e-06      # m
INTERCEPT = 8.304967605700427e-05  # b

def plot_calculated_weight(file_path):
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Calculate Weight
    # Formula: (Raw Voltage - Offset) / Sensitivity
    weights = (df['Load Cell (Raw)'] * SLOPE) + INTERCEPT

    # Plotting
    plt.figure(figsize=(10, 6))
    
    plt.plot(df['Time(s)'], weights, color='tab:red', label='Calculated Weight')

    plt.title('Calculated Weight Over Time')
    plt.xlabel('Time (s)')
    plt.ylabel('Weight (lbs)')
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.legend()
    
    # Display the plot window
    plt.show()

if __name__ == "__main__":
    plot_calculated_weight('a2.csv')