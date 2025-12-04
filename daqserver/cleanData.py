import pandas as pd
import os

# Map: file_index -> weight
file_map = {
    2: 22, 3: 30, 4: 39, 5: 47, 8: 73, 11: 98,
    13: 115, 15: 132, 17: 153, 19: 178, 21: 203
}

for idx in file_map.keys():
    input_filename = f"./saves/a{idx}.csv"
    output_filename = f"./saves/a{idx}_cleaned.csv"
    
    if os.path.exists(input_filename):
        # Read the CSV
        df = pd.read_csv(input_filename)
        
        # Calculate indices for the middle 50%
        n_rows = len(df)
        start_idx = int(n_rows * 0.5) # Start at 25%
        end_idx = int(n_rows * 0.9)   # End at 75%
        
        # Slice the data
        cleaned_df = df.iloc[start_idx:end_idx]
        
        # Write to new file, keeping the header, removing the index numbers
        cleaned_df.to_csv(output_filename, index=False)
        
        print(f"Processed {input_filename}: Kept rows {start_idx} to {end_idx} -> Saved to {output_filename}")
    else:
        print(f"Warning: {input_filename} not found.")