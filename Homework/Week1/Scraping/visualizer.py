#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt


# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":
    with open(INPUT_CSV, newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            data_dict[row["Year"]].append(float(row["Rating"]))

        # Take the average off the years
        for key in data_dict:
            data_dict[key] = sum(data_dict[key]) / float(len(data_dict[key]))

    # Line graph showing the average score of movies per year
    plt.plot([key for key in data_dict], [data_dict[key] for key in data_dict])
    plt.suptitle('Average score of movies between 2008 and 2017', fontsize=16)
    plt.show()
