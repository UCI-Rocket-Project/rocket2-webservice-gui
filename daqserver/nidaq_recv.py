import zmq
import pyarrow as pa
import numpy as np

def run_multi_column_subscriber():
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    
    # Use "host.docker.internal" if inside Docker, else "127.0.0.1"
    socket.connect("tcp://host.docker.internal:1622") 
    socket.setsockopt_string(zmq.SUBSCRIBE, "") # Subscribe to everything

    print("Listening for Arrow Data...")

    while True:
        try:
            # 1. Receive raw bytes
            msg = socket.recv()
            
            # 2. Deserialize (The "Unpacking" Step)
            #    pa.ipc.open_stream reads the buffer and reconstructs the batch
            #    It automatically detects the schema from the message header.
            with pa.ipc.open_stream(msg) as reader:
                batch = reader.read_next_batch()

            # 3. Access Data by Column Name
            #    This is the "Struct" feel you wanted
            ts = batch['timestamp']
            ai0 = batch['ArduinoPWM']

            # 4. Convert to NumPy for math/plotting (Zero-Copy usually)
            #    Note: 'ai0' here is a PyArrow Array. .to_numpy() makes it usable.
            mean_volt = np.mean(ai0.to_numpy())
            last_time = ts[-1].as_py() # Get last timestamp as Python float

            print(f"Received Batch: {batch.num_rows} rows")
            print(f" - Timestamp: {ts}")
            print(f" - Mean Voltage: {mean_volt:.4f} V")
            print(f" - Columns: {batch.schema.names}")
            print("-" * 30)

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_multi_column_subscriber()