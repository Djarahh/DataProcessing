import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

INPUT_CSV = "input.csv"
OUTPUT_CSV = "output.csv"
OUTPUT_JSON = "json.csv"

# Reading only Country, region, pop dens, infant mortality, GDP from CSV
df = pd.read_csv(INPUT_CSV, usecols=["GDP ($ per capita) dollars", "Region",
                                     "Pop. Density (per sq. mi.)", "Country",
                                     "Infant mortality (per 1000 births)",
                                     "GDP ($ per capita) dollars"],
                 na_values=['', 'unknown'])

# Changing all data to make it usable
df["GDP ($ per capita) dollars"] = df["GDP ($ per capita) dollars"].str.\
   strip("dollars").astype("float64")
df["Region"] = df["Region"].str.strip()
df["Infant mortality (per 1000 births)"] = df["Infant mortality\
   (per 1000 births)"].str.replace(",", ".").astype("float64")
df["Pop. Density (per sq. mi.)"] = df["Pop. Density (per sq. mi.)"].str.\
   replace(",", ".").astype("float64")

# Put data into CSV file
df.to_csv(OUTPUT_CSV)

# Calculata the mean, median, mode and standard diviation of GDP
mean = df["GDP ($ per capita) dollars"].mean()
median = df["GDP ($ per capita) dollars"].median()
mode = df["GDP ($ per capita) dollars"].mode().iloc[0]
std = df["GDP ($ per capita) dollars"].std()

print(f"Mean of GDP: {mean}")
print(f"Median of GDP: {median}")
print(f"Mode of GDP: {mode}")
print(f"Standard Deviation of GDP: {std}")

# Histogram of the GDP per capita
hist = df["GDP ($ per capita) dollars"].hist().
hist.plot()
plt.show()

# For the boxplot make a list of all inormation in GDP
infant = (df["Infant mortality (per 1000 births)"].tolist())

# Calculate quartiles and min/max
data_min = min(infant)
first_quartile = np.nanpercentile(infant, 25)
data_median = np.nanpercentile(infant, 50)
third_quartile = np.nanpercentile(infant, 75)
data_max = max(infant)

# Print 5-number summary
print('Min: %.3f' % data_min)
print('Q1: %.3f' % first_quartile)
print('Median: %.3f' % data_median)
print('Q3: %.3f' % third_quartile)
print('Max: %.3f' % data_max)

# Plot boxplot for infant mortality
box = df[["Infant mortality (per 1000 births)"]].boxplot()
box.plot()
plt.show()

# Convert all data into a JSON file, taking country as index
df.set_index("Country", inplace=True)
df.to_json(OUTPUT_JSON, orient="index")
