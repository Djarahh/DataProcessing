import pandas as pd

INPUT_CSV = "Accidental_Drug_Related_Deaths__2012-2017.csv"
OUTPUT_CSV = "output.csv"
OUTPUT_JSON = "json.csv"

# Reading only Date, sex, age, from CSV
df = pd.read_csv(INPUT_CSV, usecols=["Date", "Sex", "Age"], na_values=[''])

# Changing data to make it usable
df["Date"] = df["Date"].str.split("/").str[2].astype("float64")

# Put data into CSV file
df.to_csv(OUTPUT_CSV)

# Convert all data to JSON file
df.to_json(OUTPUT_JSON, orient="index")
