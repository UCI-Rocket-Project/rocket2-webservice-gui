import matplotlib.pyplot as plt
import numpy as np

# 1. Calibration Data (File Number, Average Voltage)
# This is the measured voltage for each calibration weight.
raw_data = [
    (2, 0.00024319718599026942),
    (3, 0.000319341624771758),
    (4, 0.0003625491361872871),
    (5, 0.00043352209578625776),
    (8, 0.0006185505161674798),
    (11, 0.0007692142598728818),
    (13, 0.0009383005759280356),
    (15, 0.0010643701857736998),
    (17, 0.0012190211006855981),
    (19, 0.0013954567074259108),
    (21, 0.001571569919248737)
]

# 2. Lookup Table (File Number to Weight in lbs)
# This maps the file number to the corresponding physical weight used.
file_num_to_weight = {
    2: 22,
    3: 30,
    4: 39,
    5: 47,
    8: 73,
    11: 98,
    13: 115,
    15: 132,
    17: 153,
    19: 178,
    21: 203
}

# ---------------------------------------------------------
# Main execution block
# ---------------------------------------------------------

# Ensure all weights are defined
if any(v is None for v in file_num_to_weight.values()):
    print("Error: Please ensure all weights are defined in the 'file_num_to_weight' dictionary.")
else:
    # 3. Prepare data lists for plotting and fitting
    weights_x = []
    volts_y = []

    for file_num, voltage in raw_data:
        if file_num in file_num_to_weight:
            w = file_num_to_weight[file_num]
            weights_x.append(w)
            volts_y.append(voltage)

    # Convert to numpy arrays for calculation
    weights_x = np.array(weights_x)
    volts_y = np.array(volts_y)

    # 4. Perform Linear Regression (y = mx + b)
    # m = slope (sensitivity), b = intercept (offset)
    m, b = np.polyfit(weights_x, volts_y, 1)

    # 5. Print the Regression Equation (Slope and Intercept)
    print("--- Linear Regression Results ---")
    print(f"Slope (m) - Load Cell Sensitivity: {m}")
    print(f"Intercept (b) - Load Cell Offset: {b}")
    print(f"\nFinal Regression Equation (Voltage = m * Weight + b):")
    # Print with high precision for exactness
    print(f"Voltage = {m:.10f} * Weight + {b:.10f}")
    print("---------------------------------")


    # 6. Calculate R-squared value to quantify the goodness of fit
    # R^2 = 1 - (SS_res / SS_tot)
    y_model = m * weights_x + b
    ss_res = np.sum((volts_y - y_model)**2)
    ss_tot = np.sum((volts_y - np.mean(volts_y))**2)
    r_squared = 1 - (ss_res / ss_tot)


    # 7. Plotting the results
    plt.figure(figsize=(10, 6))

    # Plot original data points
    plt.scatter(weights_x, volts_y, color='blue', label='Measured Data', zorder=5)

    # Plot regression line
    x_line = np.linspace(min(weights_x) - 10, max(weights_x) + 10, 100) # Extend the line slightly
    y_line = m * x_line + b
    
    # Label for the fitted line includes the equation and R-squared
    fit_label = f'Fit: $y={m:.2e}x+{b:.2e}$\n$R^2={r_squared:.4f}$'
    plt.plot(x_line, y_line, color='red', linestyle='--', label=fit_label, zorder=1)

    plt.title('Load Cell Calibration: Weight vs. Voltage')
    plt.xlabel('Weight (lbs)')
    plt.ylabel('Load Cell Voltage (Avg)')
    plt.legend(loc='upper left')
    plt.grid(True)
    
    # Save the plot to a file in your local environment
    plt.savefig('load_cell_calibration_plot.png')
    print("\nPlot saved successfully as 'load_cell_calibration_plot.png'")

    # Use plt.show() if you want the plot to pop up in your local environment
    plt.show()