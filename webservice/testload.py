import socket
import struct

def sign_extend_24bit(value):
    if value & 0x800000:
        return value | ~0xFFFFFF
    return value

# Replace with actual IP and port of the XPort
XPORT_IP = '10.0.2.2'
XPORT_PORT = 10001

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((XPORT_IP, XPORT_PORT))
    print("Connected to XPort")

    while True:
        data = s.recv(7)
        print(data)
        # if len(data) < 7:
        #     continue

        # timestamp = struct.unpack('<I', data[0:4])[0]
        # raw24 = (data[4] << 16) | (data[5] << 8) | data[6]
        # adc_value = sign_extend_24bit(raw24)

        # print(f"Timestamp: {timestamp} ms, ADC: {adc_value}")
