import sqlite3
import os

def get_car_part_details():
    """Gets car part details from the user with category validation."""
    part_name = input("Enter car part name: ")
    model_number = input("Enter model number (optional): ")

    allowed_categories = ["Sports", "Street", "Offroad", "Wheels"]

    while True:
        category = input("Enter category (Sports, Street, Offroad, Wheels): ")
        if category in allowed_categories:
            break
        else:
            print("Invalid category. Please enter one of: Sports, Street, Offroad, Wheels")

    manufacturer = input("Enter manufacturer: ")
    while True:
        try:
            price = float(input("Enter price: "))  # Convert price to float
            break  # Exit the loop if conversion is successful
        except ValueError:
            print("Invalid price. Please enter a number.")
    return [part_name, model_number, category, manufacturer, price]

def save_car_part_to_database(car_part_data, db_file):
    """Saves car part data, preventing duplicates based on part_name AND model_number."""
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Database and table creation
        cursor.execute("PRAGMA user_version = 1")  # Force database creation
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS car_parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                part_name TEXT NOT NULL,
                model_number TEXT,
                category TEXT,
                manufacturer TEXT,
                price REAL
            )
        ''')

        # Duplicate check - Corrected
        part_name = car_part_data[0]
        model_number = car_part_data[1]

        if model_number:  # Check if model_number is provided
            cursor.execute("SELECT COUNT(*) FROM car_parts WHERE part_name=? AND model_number=?", (part_name, model_number))
        else:  # If model_number is not provided, check only part_name
            cursor.execute("SELECT COUNT(*) FROM car_parts WHERE part_name=?", (part_name,))

        existing_entry_count = cursor.fetchone()[0]  # Get the count value

        if existing_entry_count > 0:
            print("Error: A car part with that name and model number (or just name) already exists.")
        else:
            cursor.execute('''
                INSERT INTO car_parts (part_name, model_number, category, manufacturer, price)
                VALUES (?,?,?,?,?)
            ''', tuple(car_part_data))  # Correct: Pass the tuple - ensure car_part_data is a tuple

            conn.commit()
            print(f"Car part saved to {db_file}")

        conn.close()

    except Exception as e:
        print(f"Error saving to database: {e}")

# Database file path (adjust as needed)
db_file = os.path.join("C:\\Users\\Sobre\\OneDrive\\Desktop\\Vroomble\\Vroomble Dataset", "car_parts_database.db")

while True:
    car_part_details = get_car_part_details()
    save_car_part_to_database(car_part_details, db_file)

    add_another = input("Add another car part? (yes/no): ").lower()
    if add_another != "yes":
        break

print("Finished.")