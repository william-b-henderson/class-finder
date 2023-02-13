import pandas as pd

df = pd.read_csv('results.csv')
buildings = df['buildingDescription'].unique()
locations = df['locationDescription'].unique()
for building, location in zip(buildings, locations):
    print(building)