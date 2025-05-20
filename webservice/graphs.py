import pandas as pd
import matplotlib.pyplot as plt
import os

"""
This script is for plotting the data from raw ECU, GSE, and Load Cell CSV files. Update load_cell_file and gse_file to the correct file names.
The script will load the data, process it, and create various plots based on the available data. The plots will be saved in the "saves" directory.

"""
# Load CSV files
ecu_file = "ecu_vtf3_raw.csv"
ecu_data = pd.read_csv("saves/" + ecu_file)

load_cell_file = "load_cell_vf3_raw.csv"
load_cell_path = "saves/" + load_cell_file
load_cell_data = None

if os.path.exists(load_cell_path):
    load_cell_data = pd.read_csv(load_cell_path)


gse_file = "gse_vtf3_raw.csv"
gse_file_path = "saves/" + gse_file
gse_data = None

if os.path.exists(gse_file_path):
    gse_data = pd.read_csv(gse_file_path)

mvas_col = " solenoidinternalstatemvasopen"
time_col = "time_recv"
copv_col = " pressurecopv"
start_time = None
end_time = None
end_index = None
start_index = None
for x in range(len(ecu_data)):
    if ecu_data.at[x, copv_col] > 1800:
        end_index = x

        end_time = ecu_data.at[end_index, time_col]
        break

for i in range(end_index, len(gse_data)):
    if gse_data.at[i, mvas_col] == 0:
        start_index = i
        start_time = gse_data.at[i, time_col]
        print(f"MVAS  opened at: {start_time}")
        print(f"COPV drops below 50 PSI at: {end_time}")
        print(f"Duration open: {end_time - start_time}")
        break


# Cut data to only rows between start_time and end_time
gse_data = gse_data[
    (gse_data["time_recv"] >= start_time) & (gse_data["time_recv"] <= end_time)
]


ecu_data = ecu_data[
    (ecu_data["time_recv"] >= start_time) & (ecu_data["time_recv"] <= end_time)
]
if type(load_cell_data) != None:
    load_cell_data = load_cell_data[
        (load_cell_data["time_recv"] >= start_time)
        & (load_cell_data["time_recv"] <= end_time)
        & (load_cell_data[" total_force"] > -100)
    ]

# Adjust packet_time for data1
ecu_data[" packet_time"] = (
    ecu_data[" packet_time"] / 2000 - ecu_data[" packet_time"].iloc[-1] / 2000
)
gse_data[" packet_time"] = (
    gse_data[" packet_time"] / 2000 - gse_data[" packet_time"].iloc[-1] / 2000
)
if type(load_cell_data) != None:
    load_cell_data[" packet_time"] = (
        load_cell_data[" packet_time"] - load_cell_data[" packet_time"].iloc[-1]
    ) / 1000  # Only divide load cell by 1000 to get to seconds from ms


# --- Define plotting functions ---
def plot_graph(ax, title, x_label, y_label, plot_fn):
    plot_fn(ax)
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel(y_label)
    ax.legend()


def save_individual_plot(title, x_label, y_label, save_name, plot_fn):
    fig, ax = plt.subplots()
    plot_fn(ax)
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel(y_label)
    ax.legend()
    fig.savefig(save_name)
    plt.close(fig)


# --- Define each graph's content ---
def plot_tanks_injectors_load_cell(ax):
    for column in ecu_data.columns:
        if "pressureinjector" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)
        if "pressurelox" in column or "pressurelng" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)
    for column in load_cell_data.columns:
        if "total_force" in column:
            ax.plot(
                load_cell_data[" packet_time"], load_cell_data[column], label=column
            )


def plot_tanks_injectors(ax):
    for column in ecu_data.columns:
        if "pressureinjector" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)
        if "pressurelox" in column or "pressurelng" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)


def plot_injectors_load_cell(ax):
    for column in ecu_data.columns:
        if "pressureinjector" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)
    for column in load_cell_data.columns:
        if "total_force" in column:
            ax.plot(
                load_cell_data[" packet_time"], load_cell_data[column], label=column
            )


def plot_tanks_copv(ax):
    for column in ecu_data.columns:
        if "pressurelox" in column or "pressurelng" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)
        if "pressurecopv" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column] / 4.5, label=column)


def plot_load_cell(ax):
    for column in load_cell_data.columns:
        if "total_force" in column:
            ax.plot(
                load_cell_data[" packet_time"], load_cell_data[column], label=column
            )


def plot_copv(ax):
    for column in ecu_data.columns:
        if "pressurecopv" in column:
            ax.plot(ecu_data[" packet_time"], ecu_data[column], label=column)


# --- Select plots dynamically based on available data ---
plots_to_show = [
    ("Tanks and Injectors", "Time (s)", "Pressure (psi)", plot_tanks_injectors),
    ("Tanks and COPV (Scaled)", "Time (s)", "Pressure (psi)", plot_tanks_copv),
    ("COPV", "Time (s)", "Pressure (psi)", plot_copv),
]

if load_cell_data is not None:
    plots_to_show.insert(
        1, ("Injectors and Thrust", "Time (s)", "Values", plot_injectors_load_cell)
    )
    plots_to_show.insert(3, ("Thrust", "Time (s)", "Force (N)", plot_load_cell))
    plots_to_show.insert(
        0,
        (
            "Tanks, Injectors, and Thrust",
            "Time (s)",
            "Values",
            plot_tanks_injectors_load_cell,
        ),
    )

# --- Create multi-panel figure ---
n = len(plots_to_show)
fig_rows = (n + 2) // 3
fig, axs = plt.subplots(nrows=fig_rows, ncols=3, figsize=(14, 4 * fig_rows))
axs = axs.flatten()

for i, (title, xlab, ylab, plot_fn) in enumerate(plots_to_show):
    plot_graph(axs[i], title, xlab, ylab, plot_fn)

for j in range(len(plots_to_show), len(axs)):
    fig.delaxes(axs[j])

# --- Save individual plots ---
save_individual_plot(
    "Tanks and Injectors",
    "Time (s)",
    "Pressure (psi)",
    "saves/tanks_injectors.png",
    plot_tanks_injectors,
)
save_individual_plot(
    "Tanks and COPV",
    "Time (s)",
    "Pressure (psi)",
    "saves/tanks_copv.png",
    plot_tanks_copv,
)
save_individual_plot("COPV", "Time (s)", "Pressure (psi)", "saves/copv.png", plot_copv)

if load_cell_data is not None:
    save_individual_plot(
        "Injectors and Thrust",
        "Time (s)",
        "Values",
        "saves/injectors_loadcell.png",
        plot_injectors_load_cell,
    )
    save_individual_plot(
        "Thrust", "Time (s)", "Force (N)", "saves/load_cell.png", plot_load_cell
    )
    save_individual_plot(
        "Tanks, Injectors, and Thrust",
        "Time (s)",
        "Values",
        "saves/tanks_injectors_load_cell.png",
        plot_tanks_injectors_load_cell,
    )
    # -- Final display setup ---
fig.tight_layout()


def handle_key(event):
    if event.key == "q":
        plt.close(event.canvas.figure)


fig.canvas.mpl_connect("key_press_event", handle_key)
plt.show()
