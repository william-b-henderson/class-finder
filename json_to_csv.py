from tqdm import tqdm 
import json
import csv

FILE_NAME = 'test_results.json'


if __name__ == '__main__':
    with open('results.json', 'r') as file:
        json_list = json.load(file)
    with open('results.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        for item in tqdm(json_list, colour="#00ff00", desc ="Progress: "):
            try:
                writer.writerow([item['course_id'],
                                item['title'],
                                item['displayName'],
                                item['description'],
                                item['subjectAreaCode'],
                                item['subjectAreaDescription'],
                                item['meetsMonday'],
                                item['meetsTuesday'],
                                item['meetsWednesday'],
                                item['meetsThursday'],
                                item['meetsFriday'],
                                item['meetsSaturday'],
                                item['meetsSunday'],
                                item['startTime'],
                                item['endTime'],
                                item['locationCode'],
                                item['locationDescription'],
                                item['buildingCode'],
                                item['buildingDescription']])
            except:
                continue

