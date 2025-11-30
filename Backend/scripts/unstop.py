import requests
import json
import hashlib
from datetime import datetime
from Backend.main.schemas import Hackathon
from pydantic import ValidationError

def parse_unstop_dates(date_str: str):
    """
    Parses date strings from Unstop API like:
    - '2025-07-19T00:00:00+05:30'
    """
    if not date_str or not isinstance(date_str, str):
        return None, None

    try:
        # Parse ISO format datetime
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.date(), dt.date()
    except (ValueError, TypeError):
        return None, None

def fetch_unstop_hackathons() -> list[Hackathon]:
    """
    Fetches and validates hackathon data from the Unstop API, fetching all pages.
    """
    base_url = "https://unstop.com/api/public/opportunity/search-result"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

    hackathons = []
    page = 1
    
    while page is not None:
        params = {
            'opportunity': 'hackathons',
            'page': page,
            'oppstatus': 'open'
        }
        try:
            response = requests.get(base_url, headers=headers, params=params, timeout=10)
            if response.status_code != 200:
                print(f"Error: Received status code {response.status_code} on page {page}")
                break
            data = response.json()
            # Get last_page from the first response
            next_page_url= data.get("data", {}).get("next_page_url")
            if next_page_url:
                page = int(next_page_url.split("page=")[1])
            else:
                page = None
                break
            hackathon_data = data.get("data", {}).get("data", [])
        except requests.RequestException as e:
            print(f"Error fetching URL on page {page}: {e}")
            break
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from response on page {page}: {e}")
            break

        for item in hackathon_data:
            start_date, end_date = parse_unstop_dates(item.get("start_date"))
            try:
                # Derive _id from url
                _id = hashlib.sha256(item.get("public_url", "").encode()).hexdigest()
                
                # Combine start_date and end_date into submission_period_dates
                submission_period_dates = f"{start_date} - {end_date}" if start_date and end_date else None

                # Extract themes from filters
                themes = []
                for filter_item in item.get("filters", []):
                    if filter_item.get("type") == "category":
                        theme_name = filter_item.get("name", "")
                        if theme_name:
                            themes.append(theme_name)

                hackathon = Hackathon(
                    _id=hashlib.sha256(item.get("seo_url", "").encode()).hexdigest(),
                    id=hashlib.sha256(str(item.get("title", "")).encode()).hexdigest(),
                    title=item.get("title", ""),
                    url=item.get("seo_url", ""),
                    thumbnail_url=item.get("image_url"), # Assuming 'image_url' for thumbnail
                    organization_name=item.get("organisation", {}).get("name"), # Assuming 'organisation.name'
                    submission_period_dates=submission_period_dates,
                    isOpen=item.get("is_active"), # Assuming 'is_active' for isOpen
                    prizeText=item.get("prize_money"), # Assuming 'prize_money' for prizeText
                    registrations_count=item.get("registrations_count"), # Assuming 'registrations_count'
                    time_left_to_submission=item.get("time_left"), # Assuming 'time_left'
                    themes=themes,
                    featured=item.get("is_featured"), # Assuming 'is_featured'
                    source="unstop"
                )
                hackathons.append(hackathon)
            except ValidationError as e:
                with open("unstop_error.log", "a") as f:
                    f.write(f"Skipping hackathon due to validation error: {item.get('title')}\n")
                    f.write(f"Problematic item: {json.dumps(item, indent=2)}\n")
                    f.write(f"Error details: {e}\n\n")
    return hackathons

if __name__ == "__main__":
    hackathons = fetch_unstop_hackathons()
    