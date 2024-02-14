from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def dict_to_insert_statement(table_name, data):
    columns = ", ".join(data.keys())
    values = ", ".join([f"{data[column]}" for column in data.keys()])

    insert_statement = f"INSERT INTO {table_name} ({columns}) VALUES ({values});"

    return insert_statement


# Database configuration
db_config = {
    "host": "localhost",
    "port": "5432",
    "database": "rocket2",
    "user": "gs",
    "password": "rocket",
}

# Create SQLAlchemy engine
engine = create_engine(
    f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
)


def insert_into_ecu(data):
    try:
        # Generate insert statement
        insert_statement = dict_to_insert_statement("ecu", data)

        # Execute the insert statement
        with Session(engine) as session:
            session.execute(text(insert_statement))
            session.commit()

        return True

    except IntegrityError:
        # Handle integrity error (if needed)
        print("IntegrityError: Data integrity violation")
        return False

    except Exception as e:
        # Handle other exceptions
        print(f"Error: {e}")
        return False


# Example data to insert
data_to_insert = {
    "time_recv": 123456789,
    "solenoidCurrentGn2Vent": 42,
    # Add other fields as needed
}

# Insert data into the 'ecu' table
insert_into_ecu(data_to_insert)
