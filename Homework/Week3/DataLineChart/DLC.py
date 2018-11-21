import pandas as pd

# source of dataset: https://public.opendatasoft.com/explore/dataset/opioid-overdose-deaths-as-a-percent-of-all-drug-overdose-deaths/information/

INPUT_CSV = "Accidental_Drug_Related_Deaths__2012-2017.csv"
OUTPUT_CSV = "output.csv"
OUTPUT_JSON = "output.json"

# Reading only Date, sex, age, from CSV
df = pd.read_csv(INPUT_CSV, usecols=["Date", "Sex", "Age"], na_values=[''])

# Changing data to make it usable
df["Date"] = df["Date"].str.split("/").str[2].astype("float64")

# Put data into CSV file
df.to_csv(OUTPUT_CSV)

# Convert all data to JSON file
df.to_json(OUTPUT_JSON, orient="index")
