import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi import FastAPI
from typing import List
from Backend.main.schemas import Hackathon
import json
import os
import logging
import traceback

from Backend.scripts.devfolio import scrape_devfolio_hackathons
from Backend.scripts.devpost import fetch_devpost_hackathons
from Backend.scripts.dorahacks import fetch_dorahacks_hackathons
from Backend.scripts.mlh import scrape_mlh_events
from Backend.scripts.unstop import fetch_unstop_hackathons

# Configure logging
logging.basicConfig(filename='scraper_errors.log', level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

async def run_all_scrapers() -> List[Hackathon]:
    all_hackathons = []

    # Devfolio
    print("Fetching hackathons from Devfolio...")
    try:
        devfolio_hackathons = scrape_devfolio_hackathons()
        all_hackathons.extend(devfolio_hackathons)
        print(f"Found {len(devfolio_hackathons)} hackathons from Devfolio.")
    except Exception as e:
        logging.error(f"Error fetching from Devfolio: {e}")
        print(f"Error fetching from Devfolio: {e}")

    # Devpost
    print("Fetching hackathons from Devpost...")
    try:
        devpost_hackathons = fetch_devpost_hackathons()
        all_hackathons.extend(devpost_hackathons)
        print(f"Found {len(devpost_hackathons)} hackathons from Devpost.")
    except Exception as e:
        logging.error(f"Error fetching from Devpost: {e}")
        print(f"Error fetching from Devpost: {e}")

    # Dorahacks
    print("Fetching hackathons from Dorahacks...")
    try:
        dorahacks_hackathons = fetch_dorahacks_hackathons()
        all_hackathons.extend(dorahacks_hackathons)
        print(f"Found {len(dorahacks_hackathons)} hackathons from Dorahacks.")
    except Exception as e:
        logging.error(f"Error fetching from Dorahacks: {e}")
        print(f"Error fetching from Dorahacks: {e}")

    # MLH
    print("Fetching hackathons from MLH...")
    try:
        mlh_hackathons = scrape_mlh_events()
        all_hackathons.extend(mlh_hackathons)
        print(f"Found {len(mlh_hackathons)} hackathons from MLH.")
    except Exception as e:
        logging.error(f"Error fetching from MLH: {e}")
        print(f"Error fetching from MLH: {e}")

    # Unstop
    print("Fetching hackathons from Unstop...")
    try:
        unstop_hackathons = fetch_unstop_hackathons()
        all_hackathons.extend(unstop_hackathons)
        print(f"Found {len(unstop_hackathons)} hackathons from Unstop.")
    except Exception as e:
        logging.error(f"Error fetching from Unstop: {e}")
        print(f"Error fetching from Unstop: {e}")

    print(f"Total hackathons found: {len(all_hackathons)}")
    return all_hackathons

@app.get("/hackathons", response_model=List[Hackathon])
async def get_hackathons():
    hackathons = await run_all_scrapers()
    # Optionally, save to JSON after scraping
    file_path = os.path.join(os.path.dirname(__file__), "all_hackathons.json")
    with open(file_path, "w") as f:
        json.dump([h.model_dump() for h in hackathons], f, indent=2)
    print("Aggregated hackathons saved to all_hackathons.json")
    return hackathons