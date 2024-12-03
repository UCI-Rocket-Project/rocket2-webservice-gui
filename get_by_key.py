import psycopg2

# Replace these values with your PostgreSQL connection details
db_params = {
    "dbname": "rocket2",
    "user": "gs",
    "password": "rocket",
    "host": "localhost",  # or your database host
    "port": "5432",  # or your database port
}


def retrieve_gse_data(connection, keys):
    try:
        cursor = connection.cursor()
        key_str = "packet_time, "
        for key in keys:
            key_str += f"{key}, "
        key_str = key_str[:-2]
        # Select all rows from the 'ecu' table
        cursor.execute(f"SELECT {key_str} FROM gse;")
        rows = cursor.fetchall()

        # Print the retrieved data
        for row in rows:
            print(row)
        return rows

    except Exception as e:
        print(f"Error: {e}")

    finally:
        cursor.close()


# Connect to the PostgreSQL database
try:
    connection = psycopg2.connect(**db_params)
    retrieve_gse_data(connection, ["temperatureLox", "temperatureLng"])

except psycopg2.Error as e:
    print(f"Unable to connect to the database. Error: {e}")

finally:
    if connection:
        connection.close()
