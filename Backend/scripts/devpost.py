import requests
import hashlib
from datetime import datetime
import json
from datetime import datetime, timezone
from Backend.main.schemas import Hackathon


def fetch_devpost_hackathons():
    """
    Fetches and validates hackathon data from the first 20 pages of the official Devpost API.
    """
    hackathons = []
    for page in range(1, 21):
        url = f"https://devpost.com/api/hackathons?page={page}"
        try:
            resp = requests.get(url)
            resp.raise_for_status()
            hackathon_data = resp.json().get("hackathons", [])
        except requests.RequestException as e:
            print(f"Error fetching URL (page {page}): {e}")
            continue
        except ValueError:
            print(f"Error decoding JSON from response on page {page}.")
            continue

        for item in hackathon_data:

            if item.get("open_state") == "ended":
                break


            hackathon = Hackathon(
                _id=hashlib.sha256(str(item.get("id")).encode()).hexdigest(),
                id=str(item.get("id")),
                url=item.get("url"),
                title=item.get("title"),
                thumbnail_url="https:" + item.get("thumbnail_url") if item.get("thumbnail_url", "").startswith("//") else item.get("thumbnail_url", "https://d2dmyh35ffsxbl.cloudfront.net/assets/defaults/thumbnail-placeholder-8c916ef4da99a222ce6ece077c71c7e282f071f830747b2abb5718018cbfa699.gif"),
                featured=item.get("featured"),
                organization_name=item.get("organization_name"),
                isOpen=True if item.get("open_state") == "open" else False,
            submission_period_dates=item.get("submission_period_dates"),
            displayed_location=item.get("displayed_location", {}).get("location", "Online"),
            registrations_count=item.get("registrations_count"),
            prizeText=item.get("prize_text") if item.get("prize_text") else "", 
            time_left_to_submission=item.get("time_left_to_submission"),
            themes=[theme.get("name") for theme in item.get("themes", []) if isinstance(theme, dict) and theme.get("name")],
            start_a_submission_url=item.get("start_a_submission_url"),
            source="devpost"
            )
            hackathons.append(hackathon)
    return hackathons

if __name__ == "__main__":
    hackathons = fetch_devpost_hackathons()
    output = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "count": len(hackathons),
        "hackathons": hackathons
    }
    print(json.dumps(output, indent=2))
