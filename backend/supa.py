import os
import csv
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv("../.env")

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Fetch data from Supabase table
response = supabase.table("vects2").select("drugname").execute()

# Extract unique drug names
unique_names_set = {name["drugname"] for name in response.data}

# Define CSV file path
csv_filename = "unique_drug_names.csv"

# Write to CSV
with open(csv_filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["drugname"])  # Column header
    for drugname in unique_names_set:
        writer.writerow([drugname])

print(f"CSV file '{csv_filename}' created successfully.")
