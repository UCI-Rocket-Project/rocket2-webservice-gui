import matplotlib.pyplot as plt
import numpy as np
import os

# Map: file_index -> weight
file_map = {
    2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
    13: 115, 15: 132, 17: 153, 19: 178, 21: 203
}

plt.figure(figsize=(10, 6))

for idx, weight in file_map.items():
    filename = f"./saves/a{idx}_cleaned.csv"
    
    if os.path.exists(filename):
        # Load data, skipping the header row
        data = np.genfromtxt(filename, delimiter=',', skip_header=1)
        
        # Col 0 is Time, Col 1 is Load Cell (Raw)
        time = data[:, 0]
        voltage = data[:, 2]
        
        plt.plot(time, voltage, label=f'{weight}lb (a{idx})')
    else:
        print(f"Warning: {filename} not found.")

plt.title('Load Cell Raw Voltage vs Time')
plt.xlabel('Time (s)')
plt.ylabel('Voltage (Raw)')
plt.legend()
plt.grid(True)
plt.show()