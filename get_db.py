import psycopg2

# Replace these values with your PostgreSQL connection details
db_params = {
    "dbname": "rocket2",
    "user": "gs",
    "password": "rocket",
    "host": "localhost",  # or your database host
    "port": "5432",  # or your database port
}


def retrieve_ecu_data(connection):
    try:
        cursor = connection.cursor()

        # Select all rows from the 'ecu' table
        cursor.execute("SELECT * FROM ecu;")
        rows = cursor.fetchall()

        # Print the retrieved data
        for row in rows:
            print(row)

    except Exception as e:
        print(f"Error: {e}")

    finally:
        cursor.close()


def retrieve_gse_data(connection):
    try:
        cursor = connection.cursor()

        # Select all rows from the 'ecu' table
        cursor.execute("SELECT * FROM gse;")
        rows = cursor.fetchall()

        # Print the retrieved data
        for row in rows:
            print(row)

    except Exception as e:
        print(f"Error: {e}")

    finally:
        cursor.close()
# Connect to the PostgreSQL database
try:
    connection = psycopg2.connect(**db_params)
    retrieve_ecu_data(connection)
    print("GSE")
    retrieve_gse_data(connection)

except psycopg2.Error as e:
    print(f"Unable to connect to the database. Error: {e}")

finally:
    if connection:
        connection.close()
