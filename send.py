import socket

# Define the IP address and port of the server
IP_ADDRESS = '10.0.0.255'
PORT = 10001  # You need to specify the port number the server is listening on

# Create a TCP socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to the server
    client_socket.connect((IP_ADDRESS, PORT))

    # Send the message
    message = "lllll"
    client_socket.sendall(message.encode())

    print("Message sent successfully.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Close the socket
    client_socket.close()
