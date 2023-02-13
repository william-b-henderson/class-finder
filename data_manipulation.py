import pandas as pd


df = pd.read_csv('results.csv')
df['buildingDescription-startTime'] = df['buildingDescription'] + '-' + df['startTime']

df.to_csv('updated_results.csv')