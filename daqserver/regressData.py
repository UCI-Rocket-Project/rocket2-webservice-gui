import matplotlib.pyplot as plt
import numpy as np
import os

# Map: file_index -> weight (lbs)
file_map = {
    2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
    13: 115, 15: 132, 17: 153, 19: 178, 21: 203
}

# Lists to store the final data points
avg_voltages = []
weights = []

# Dictionary for the specific mapping requested (Voltage -> Weight)
voltage_to_weight_map = {}

print("Reading files and calculating averages...")

for idx, weight in file_map.items():
    filename = f"./saves/a{idx}_cleaned.csv"
    
    if os.path.exists(filename):
        # Load data, skipping header
        # using Column 2 (Load Cell Avg) based on your snippet
        data = np.genfromtxt(filename, delimiter=',', skip_header=1)
        
        # Calculate the mean of the voltage column for this entire file
        # Check if data is 1D (single row) or 2D (multiple rows)
        if data.ndim == 1:
            current_avg_voltage = data[2]
        else:
            current_avg_voltage = np.mean(data[:, 2])
        
        # Store data
        avg_voltages.append(current_avg_voltage)
        weights.append(weight)
        voltage_to_weight_map[current_avg_voltage] = weight
        
        print(f"File {filename}: Weight={weight}lb, Avg Voltage={current_avg_voltage:.4f}")
    else:
        print(f"Warning: {filename} not found.")

# --- Linear Regression & Plotting ---
if len(avg_voltages) > 0:
    # Calculate Linear Regression (Degree 1)
    # Returns [slope, intercept]
    slope, intercept = np.polyfit(avg_voltages, weights, 1)
    
    # Create a function for the trendline (y = mx + b)
    trendline = np.poly1d([slope, intercept])
    
    print("\n--- Regression Parameters ---")
    print(f"Slope (m): {slope:.6f}")
    print(f"Intercept (b): {intercept:.6f}")
    print(f"Calibration Equation: Weight = ({slope:.4f} * Voltage) + {intercept:.4f}")

    plt.figure(figsize=(10, 6))

    # Plot the actual measured data points
    plt.scatter(avg_voltages, weights, color='red', label='Measured Data')

    # Plot the Best Fit Line
    plt.plot(avg_voltages, trendline(avg_voltages), color='blue', linestyle='--', label=f'Fit: y={slope:.2f}x + {intercept:.2f}')

    plt.title(f'Calibration Curve\nWeight = {slope:.3f} * Voltage + {intercept:.3f}')
    plt.xlabel('Average Voltage (V)')
    plt.ylabel('Known Weight (lbs)')
    plt.legend()
    plt.grid(True)
    plt.show()

# Print the map as requested
print("\nGenerated Voltage -> Weight Map:")
for v, w in voltage_to_weight_map.items():
    print(f"{v:.4f} V : {w} lbs")