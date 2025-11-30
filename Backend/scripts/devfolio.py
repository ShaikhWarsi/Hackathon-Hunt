import requests
import hashlib
import json
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from Backend.main.schemas import Hackathon

URL = "https://devfolio.co/hackathons"

def debug_scrape_devfolio():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    print("Script started successfully.")
    
    first_card = soup.select_one("div.CompactHackathonCard__StyledCard-sc-174a161-0")
    if first_card:
        print("Found first hackathon card. Printing its HTML:")
        print(first_card.prettify())
    else:
        print("Could not find any hackathon cards with the selector 'div.CompactHackathonCard__StyledCard-sc-174a161-0'.")

def scrape_devfolio_hackathons():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    # More generic selector for hackathon cards
    hackathon_cards = soup.select("div.CompactHackathonCard__StyledCard-sc-174a161-0") 
    print(f"Found {len(hackathon_cards)} hackathon cards.")
    
    hackathons = []
    for card in hackathon_cards:
        print(f"Processing card: {card.prettify()[:500]}")
        title_tag = card.find("h3", class_="sc-hKMtZM hFoIFK")
        title_text = title_tag.get_text(strip=True) if title_tag else None

        link_tag = card.find("a", class_="Link__LinkBase-sc-e5d23d99-0 bnxtME")
        link = link_tag["href"] if link_tag and "href" in link_tag.attrs else None

        if not link:
            continue

        theme_tag = card.find("div", class_="HuokQ").find("p", class_="sc-hKMtZM hklxyq")
        themes = [{"name": theme_tag.get_text(strip=True)}] if theme_tag else []

        date_tags = card.find_all("p", class_="sc-hKMtZM bLFGnB")
        date_texts = [tag.get_text(strip=True) for tag in date_tags if "Online" not in tag.get_text(strip=True) and "Open" not in tag.get_text(strip=True) and "Live" not in tag.get_text(strip=True) and "Upcoming" not in tag.get_text(strip=True) and "Ended" not in tag.get_text(strip=True)]
        submission_period_dates = " - ".join(date_texts) if date_texts else "N/A"

        # Set other fields to N/A or None for now, as they are not directly available in the provided JS selectors
        thumbnail_url = "https://devfolio.co/_next/static/media/default-hackathon-cover.b977727e.png"
        organization_name = "N/A"
        isOpen = None # Changed from "unknown" to None
        displayed_location = "Online"
        registrations_count = 0
        prizeText = ""
        time_left_to_submission = "N/A"

        start_a_submission_url = link + "/submit"

        # Extract theme name from the dictionary
        processed_themes = [t["name"] for t in themes if isinstance(t, dict) and "name" in t] if themes else []

        hackathon = Hackathon(
            _id=hashlib.sha256(link.encode()).hexdigest(),
            id=str(int(hashlib.sha256(link.encode()).hexdigest(), 16) % (10**7)),
            url=link,
            title=title_text,
            thumbnail_url=thumbnail_url,
            featured=False,
            organization_name=organization_name,
            isOpen=isOpen,
            submission_period_dates=submission_period_dates,
            displayed_location=displayed_location,
            registrations_count=registrations_count,
            prizeText=prizeText,
            time_left_to_submission=time_left_to_submission,
            themes=processed_themes, # Use processed_themes
            start_a_submission_url=start_a_submission_url,
            source="devfolio"
        )
        hackathons.append(hackathon)
    return hackathons

if __name__ == "__main__":
    hackathons = scarpe_devfolio_hackathons()
    for hackathon in hackathons:
        print(json.dumps(hackathon, indent=4))

