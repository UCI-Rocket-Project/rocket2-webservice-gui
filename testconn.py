import socket
host = "10.0.2.0"
port = 10002
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host,port))
while True:
    print(s.recv(79))