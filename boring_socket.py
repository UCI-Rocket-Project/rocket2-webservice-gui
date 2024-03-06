import socket

def send_hello(address, port):
    # Create a socket object
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to the server
        client_socket.connect((address, port))
        print(f"Connected to {address}:{port}")

        while True:
            # Send the message "hello"
            message = "hello"
            client_socket.sendall(message.encode())
            print(f"Sent: {message}")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # Close the connection
        client_socket.close()
        print("Connection closed")

# Replace 'your_server_address' and 'your_port' with the actual server address and port
server_address = "10.0.0.255"
server_port = 10001

# Call the function to send "hello" to the specified address and port
send_hello(server_address, server_port)
