#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Make a list of all movies with their information
    list_movies = dom.find_all(lambda tag: tag.name == 'div' and tag.get('class') == ['lister-item-content'])

    # Initialize list to add list for all necissary informaion
    all_movies = []

    # Iterate over every movie, extracting title, rating, year, actors and running time
    for movie in list_movies:
        best_movies = []
        title = (movie.h3.a.string)
        rating = movie.find("div", class_= "inline-block ratings-imdb-rating").strong.string
        runtime = int(movie.find("span", class_ = "runtime").string.split()[0])

        year = movie.find("span", class_= "lister-item-year text-muted unbold").string
        if len(year) > 6:
            year = year.split(" ")[1].strip("()")
        else:
            year = year.strip("()")

        actors = []
        list_actor = movie.find_all("p")[2].find_all("a")
        for link in list_actor:
            if "adv_li_st" in link["href"]:
                actor = link.string
                actors.append(actor)
        actors = ', '.join(actors)
        if len(actors) == 0:
            actors = "No actors"

        # Append all information to list
        best_movies.append(title)
        best_movies.append(rating)
        best_movies.append(year)
        best_movies.append(actors)
        best_movies.append(runtime)

        # Append list of information to list of all movies
        all_movies.append(best_movies)

    return(all_movies)


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in movies:
        writer.writerow(movie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
