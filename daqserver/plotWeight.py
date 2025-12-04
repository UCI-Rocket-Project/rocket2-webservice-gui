import matplotlib.pyplot as plt
import numpy as np
import os

# --- Calibration Parameters ---
# Update these with the values you found in the calibration step!
SLOPE = 135547.807920      
INTERCEPT = -11.119940 

# Map: file_index -> weight
file_map = {
    2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
    13: 115, 15: 132, 17: 153, 19: 178, 21: 203
}

plt.figure(figsize=(12, 8))

print(f"{'File':<10} | {'Target':<10} | {'Max (lb)':<10} | {'Min (lb)':<10} | {'Spread (+/-)':<15}")
print("-" * 75)

for idx, weight in file_map.items():
    filename = f"./saves/a{idx}_cleaned.csv"
    
    if os.path.exists(filename):
        # Load data, skipping the header row
        data = np.genfromtxt(filename, delimiter=',', skip_header=1)
        
        # Col 0 is Time
        # Col 2 is Load Cell (Avg) - based on your snippet
        time = data[:, 0]
        voltage = data[:, 1]
        
        # Apply Calibration Equation: Weight = (Slope * Voltage) + Intercept
        mass = (voltage * SLOPE) + INTERCEPT
        
        # Plot actual data
        line, = plt.plot(time, mass, label=f'{weight}lb (a{idx})')
        color = line.get_color()
        
        # Calculate Stats
        max_val = np.max(mass)
        min_val = np.min(mass)
        # Assuming center is the midpoint of the range for the "+/-" calculation
        spread = (max_val - min_val) / 2
        
        print(f"a{idx}.csv   | {weight:<10} | {max_val:<10.4f} | {min_val:<10.4f} | {spread:<15.4f}")

        # Add horizontal reference line for the target weight
        # linestyle=':' makes it dotted, alpha=0.5 makes it semi-transparent
        plt.axhline(y=weight, color='black', linestyle=':', alpha=0.3)
        
        # Add Max/Min lines (matching the data color)
        plt.axhline(y=max_val, color=color, linestyle='--', alpha=0.4, linewidth=1)
        plt.axhline(y=min_val, color=color, linestyle='--', alpha=0.4, linewidth=1)
        
    else:
        print(f"Warning: {filename} not found.")

plt.title('Calibrated Mass vs Time (with Max/Min Bounds)')
plt.xlabel('Time (s)')
plt.ylabel('Mass (lbs)')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left') # Move legend outside to reduce clutter
plt.tight_layout()
plt.grid(True)
plt.show()