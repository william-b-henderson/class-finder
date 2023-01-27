from bs4 import BeautifulSoup
from tqdm import tqdm 
import requests
import json
import logging


MIN_PAGE = 0
MAX_PAGE = 354
SEARCH_URL = "https://classes.berkeley.edu/search/class?page={0}&f%5B0%5D=im_field_term_name%3A2729"

def get_all_results(min_page_number=MIN_PAGE, max_page_number=MAX_PAGE):
    ''' Gets the courses listed on pages from min_page_number to max_page_number, inclusive.'''
    all_results = []

    #tqdm makes custom progress bars
    for page_number in tqdm(range(min_page_number, max_page_number + 1), colour="#00ff00", desc ="Progress: "):
        results = get_results_from_page(SEARCH_URL.format(page_number))
        all_results.extend(results)
    return all_results

def get_results_from_page(page_url: str) -> list:
    ''' Gets the courses listed on a given url, and returns them as a list of objects.'''
    try:
        page = requests.get(page_url)
    except:
        logging.warning("Error fetching page for url: %s", page_url)
    soup = BeautifulSoup(page.content, "html.parser")
    page_results = soup.find_all("div", class_="handlebarData")
    results_list = []
    for result in page_results:
        json_data = result.attrs["data-json"]
        json_data = json.loads(json_data)
        simplified_results = get_values_from_result(json_data)
        if simplified_results is not None:
            results_list.append(simplified_results)
    return results_list

def get_values_from_result(result: dict, include_no_locations=False) -> dict:
    ''' Gets the specified values from each search result, and saves them in a new dict
        - course.title
        - course.displayName
        - course.courseObjectives
        - course.subjectArea.code
        - course.subjectArea.description
        - meetings.meetsMonday
                  .meetsTuesday
                  .meetsWednesday
                  .meetsThursday
                  .meetsFriday
                  .meetsSaturday
                  .meetsSunday
                  .startTime
                  .endTime
        - meetings.location.code
        - meetings.location.description
        - meetings.building.code
        - meetings.building.description
    '''
    course_keys = ['title', 'displayName', 'description']
    meetings_keys = ['meetsMonday', 'meetsTuesday', 'meetsWednesday', 'meetsThursday', 'meetsFriday', 'meetsSaturday', 'meetsSunday', 'startTime', 'endTime']
    code_description_keys = ['code', 'description']
    simplified_result = dict()
    try:
        identifiers = result['class']['course']['identifiers']
        for identifier in identifiers:
            if identifier['type'] == 'cs-course-id':
                simplified_result['course_id'] = identifier['id']
    except:
        logging.error("Cannot find Course ID for result %s", result)
    try:
        if 'course' in result:
            for key in course_keys:
                if key in result['course']:
                    simplified_result[key] = result['course'][key]
            if 'subjectArea' in result['course']:
                for key in code_description_keys:
                    simplified_result['subjectArea' + key.capitalize()] = result['course']['subjectArea'][key]
    except:
        logging.warning("No course found for this entry, %s", str(result))
    try:
        if 'meetings' in result:
            result['meetings'] = result['meetings'][0] # flattening meetings,  a list with only one value
            for key in meetings_keys:
                if key in result['meetings']:
                    simplified_result[key] = result['meetings'][key]
            try:
                if 'location' in result['meetings'] and result['meetings']['location'] is not []:
                    for key in code_description_keys:
                        simplified_result['location' + key.capitalize()] = result['meetings']['location'][key]
                if 'building' in result['meetings'] and result['meetings']['building'] is not []:
                    for key in code_description_keys:
                        simplified_result['building' + key.capitalize()] = result['meetings']['building'][key]
            except TypeError:
                logging.warning("No location found for %s", simplified_result["title"])
                if not include_no_locations:
                    return None # Skip this entry because it does not have a location
                for key in code_description_keys:
                        simplified_result['building' + key.capitalize()] = None
                        simplified_result['location' + key.capitalize()] = None
    except:
        logging.error("Error processing meetings for result %s", result)
    return simplified_result

def save_results(results: list, file_name="results.json") -> None:
    ''' Saves the results list as json to 'file_name.json'. '''
    with open(file_name, "w") as results_json:
        json.dump(results, results_json, indent=4)


if __name__ == "__main__":
    logging.basicConfig(filename="scrapper_log.log", filemode="w", level=logging.INFO)
    results_list = get_all_results()
    save_results(results_list)