import pandas as pd
import matplotlib.pyplot as plt
import re
import glob

# Find all CSV files matching the pattern 'a*.csv'
# In this environment, only 'a3.csv' is available.
file_names = glob.glob('a*.csv')

results = []

for file_name in file_names:
    # Extract the number from the filename using regex
    # Matches 'a' followed by digits, then '.csv'
    match = re.search(r'a(\d+)\.csv', file_name)
    if match:
        file_num = int(match.group(1))
        
        try:
            # Read the CSV file
            df = pd.read_csv(file_name)
            
            # Check if the target column exists
            if 'Load Cell (Avg)' in df.columns:
                # Calculate the mean
                avg_val = df['Load Cell (Avg)'].mean()
                results.append((file_num, avg_val))
            else:
                print(f"Column 'Load Cell (Avg)' not found in {file_name}")
        except Exception as e:
            print(f"Error processing {file_name}: {e}")

# Sort results by the file number (x-axis)
results.sort(key=lambda x: x[0])

# Print the list of tuples
print("Tuples (File Number, Average Value):")
print(results)

# Plotting
if results:
    x_vals = [r[0] for r in results]
    y_vals = [r[1] for r in results]

    plt.figure(figsize=(10, 6))
    plt.plot(x_vals, y_vals, marker='o', linestyle='-')
    plt.title('Average Load Cell Value vs File Number')
    plt.xlabel('File Number')
    plt.ylabel('Average Load Cell (Avg)')
    plt.grid(True)
    plt.savefig('load_cell_average_plot.png')
else:
    print("No results to plot.")