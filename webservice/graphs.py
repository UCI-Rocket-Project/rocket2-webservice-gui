import pandas as pd
import matplotlib.pyplot as plt
import os

# Load CSV files
csv_file = "ecu_vtf.csv"
data = pd.read_csv("saves/" + csv_file)

csv_file2 = "load_cell_vtf.csv"
file_path2 = "saves/" + csv_file2
data2 = None

if os.path.exists(file_path2):
    data2 = pd.read_csv(file_path2)
    data2[" packet_time"] = (
        data2[" packet_time"] / 2000 - data2[" packet_time"].iloc[-1] / 2000
    )

# Adjust packet_time for data1
data[" packet_time"] = (
    data[" packet_time"] / 2000 - data[" packet_time"].iloc[-1] / 2000
)


# --- Define plotting functions ---
def plot_graph(ax, title, x_label, y_label, plot_fn):
    """Draws plot in the given Axes object using the provided plotting function."""
    plot_fn(ax)
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel(y_label)
    ax.legend()


def save_individual_plot(title, x_label, y_label, save_name, plot_fn):
    """Creates a separate figure and saves it."""
    fig, ax = plt.subplots()
    plot_fn(ax)
    ax.set_title(title)
    ax.set_xlabel(x_label)
    ax.set_ylabel(y_label)
    ax.legend()
    fig.savefig(save_name)
    plt.close(fig)


# --- Define each graph's content ---
def plot_tanks_injectors(ax):
    for column in data.columns:
        if column != " packet_time" and "pressureinjector" in column:
            ax.plot(data[" packet_time"], data[column], label=column)
        if column != " packet_time" and (
            "pressurelox" in column or "pressurelng" in column
        ):
            ax.plot(data[" packet_time"], data[column], label=column)


def plot_injectors_load_cell(ax):
    for column in data.columns:
        if column != " packet_time" and "pressureinjector" in column:
            ax.plot(data[" packet_time"], data[column], label=column)
    for column in data2.columns:
        if column != " packet_time" and "total_force" in column:
            ax.plot(data2[" packet_time"], data2[column], label=column)


def plot_tanks_copv(ax):
    for column in data.columns:
        if column != " packet_time" and (
            "pressurelox" in column or "pressurelng" in column
        ):
            ax.plot(data[" packet_time"], data[column], label=column)
        if column != " packet_time" and "pressurecopv" in column:
            ax.plot(data[" packet_time"], data[column] / 4.5, label=column)


def plot_load_cell(ax):
    for column in data2.columns:
        if column != " packet_time" and "total_force" in column:
            ax.plot(data2[" packet_time"], data2[column], label=column)


def plot_copv(ax):
    for column in data.columns:
        if column != " packet_time" and "pressurecopv" in column:
            ax.plot(data[" packet_time"], data[column], label=column)


# --- Select plots dynamically based on available data ---
plots_to_show = [
    ("Tanks and Injectors", "Time (s)", "Pressure (psi)", plot_tanks_injectors),
    ("Tanks and COPV (Scaled)", "Time (s)", "Pressure (psi)", plot_tanks_copv),
    ("COPV", "Time (s)", "Pressure (psi)", plot_copv),
]

# Include data2-based plots if data2 exists
if data2 is not None:
    plots_to_show.insert(
        1, ("Injectors and Thrust", "Time (s)", "Values", plot_injectors_load_cell)
    )
    plots_to_show.insert(3, ("Thrust", "Time (s)", "Force (N)", plot_load_cell))

# --- Create multi-panel figure ---
n = len(plots_to_show)
fig_rows = (n + 2) // 3
fig, axs = plt.subplots(nrows=fig_rows, ncols=3, figsize=(14, 4 * fig_rows))
axs = axs.flatten()

# Plot each graph
for i, (title, xlab, ylab, plot_fn) in enumerate(plots_to_show):
    plot_graph(axs[i], title, xlab, ylab, plot_fn)

# Remove unused subplot spaces
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

if data2 is not None:
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

# --- Final display setup ---
fig.tight_layout()


def handle_key(event):
    if event.key == "q":
        plt.close(event.canvas.figure)


fig.canvas.mpl_connect("key_press_event", handle_key)
plt.show()
