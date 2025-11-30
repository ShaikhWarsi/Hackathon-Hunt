# Open Hackathons API

This project provides a FastAPI application to aggregate hackathon data from various sources.

## Table of Contents

- [Project Overview](#project-overview)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Scraper Modules](#scraper-modules)

## Project Overview

The Open Hackathons API is a Python-based web service built with FastAPI that collects and consolidates information about hackathons from different platforms. It uses a series of scraper modules to fetch data from sources like Devfolio, Devpost, Dorahacks, MLH, and Unstop. The aggregated data is then exposed through a RESTful API.

## Setup and Installation

To set up and run this project locally, follow these steps:

### Prerequisites

- Python 3.8+
- `pip` (Python package installer)
- `uvicorn` (ASGI server)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd open-hackathons-api-master
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```
   *(Note: A `requirements.txt` file is assumed to exist. If not, you'll need to create one with `fastapi`, `uvicorn`, `requests`, `beautifulsoup4`, `cloudscraper`, `pydantic`, etc.)*

3. **Run the application:**

   Navigate to the root directory of the project (where `Backend` folder is located) and run the Uvicorn server:

   ```bash
   uvicorn Backend.app:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be accessible at `http://localhost:8000`.

## API Endpoints

### Get All Hackathons

- **URL:** `/hackathons`
- **Method:** `GET`
- **Description:** Retrieves a list of all aggregated hackathons.
- **Response:** A JSON array of `Hackathon` objects.

  Example `Hackathon` object structure:

  ```json
  [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "thumbnail_url": "string",
      "featured": false,
      "organization_name": "string",
      "isOpen": true,
      "submission_period_dates": "string",
      "displayed_location": "string",
      "registrations_count": 0,
      "prizeText": "string",
      "time_left_to_submission": "string",
      "themes": [
        "string"
      ],
      "start_a_submission_url": "string",
      "source": "string",
      "start_date": "2023-10-27",
      "end_date": "2023-10-27",
      "mode": "string",
      "location": "string",
      "tags": [
        "string"
      ]
    }
  ]
  ```

## Scraper Modules

The project utilizes several scraper modules located in the `Backend/scripts` directory to fetch hackathon data from different platforms:

- `devfolio.py`: Scrapes hackathons from Devfolio.
- `devpost.py`: Fetches hackathons from Devpost.
- `dorahacks.py`: Retrieves hackathons from Dorahacks.
- `mlh.py`: Scrapes events from Major League Hacking (MLH).
- `unstop.py`: Fetches hackathons from Unstop.

Each scraper module is responsible for connecting to its respective platform, extracting relevant hackathon details, and returning them in a standardized `Hackathon` format defined in `Backend/main/schemas.py`.
