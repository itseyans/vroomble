import sqlite3
import os

def get_car_details():
    """Gets car details from the user, including body type after model input."""
    make = input("Enter car make (e.g., Toyota, Mitsubishi): ")
    model = input("Enter car model (e.g., Vios, Xpander): ")  # Get model first

    allowed_body_types = ["SUV", "SEDAN", "UV", "COUPE", "HATCHBACK", "TRUCK", "VAN", "CONVERTIBLE", "WAGON"]
    while True:
        body_type = input(f"Enter body type for {make} {model} (SUV, SEDAN, UV, COUPE, etc.): ").upper()
        if body_type in allowed_body_types:
            break
        else:
            print(f"Invalid body type. Please enter one of: {', '.join(allowed_body_types)}")

    variant = input("Enter car variant (e.g., GL, G, V): ")
    transmission = input("Enter transmission type (e.g., Automatic, Manual): ")
    drivetrain = input("Enter drivetrain (e.g., FWD, RWD, AWD): ")
    fuel_type = input("Enter fuel type (e.g., Unleaded, Diesel, Electric): ")
    year = int(input("Enter year (e.g., 2023): "))

    return [make, model, body_type, variant, transmission, drivetrain, fuel_type, year]

def save_to_database(car_data, db_file):
    """Saves car data to an SQLite database, preventing duplicate entries."""
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Force the database file to be created and create table if it doesn't exist
        cursor.execute("PRAGMA user_version = 1")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cars (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Make TEXT,
                Model TEXT,
                Body_Type TEXT,
                Variant TEXT,
                Transmission TEXT,
                Drivetrain TEXT,
                Fuel_Type TEXT,
                Year INTEGER
            )
        ''')

        # Check for duplicates (using separate columns) - Corrected
        cursor.execute('''
            SELECT COUNT(*) FROM cars 
            WHERE Make=? AND Model=? AND Body_Type=? AND Variant=? AND Transmission=? AND Drivetrain=? AND Fuel_Type=? AND Year=?
        ''', (car_data[0], car_data[1], car_data[2], car_data[3], car_data[4], car_data[5], car_data[6], car_data[7]))  # Pass individual elements

        existing_entry_count = cursor.fetchone()[0]  # Access the count from the fetched tuple

        if existing_entry_count > 0:
            print("Error: An identical car entry already exists in the database.")
        else:
            # Insert the car data (using separate columns)
            cursor.execute('''
                INSERT INTO cars (Make, Model, Body_Type, Variant, Transmission, Drivetrain, Fuel_Type, Year)
                VALUES (?,?,?,?,?,?,?,?)
            ''', car_data)  # Pass the entire list

            conn.commit()
            print(f"Car model saved to {db_file}")

        conn.close()

    except Exception as e:
        print(f"Error saving to database: {e}")

# Database file path
db_file = os.path.join("C:\\Users\\Sobre\\OneDrive\\Desktop\\Vroomble\\Vroomble Dataset", "car_database.db")

while True:
    car_details = get_car_details()
    save_to_database(car_details, db_file)

    add_another = input("Add another car model? (yes/no): ").lower()
    if add_another != "yes":
        break

print("Finished.")