from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class Hackathon(BaseModel):
    id: str
    title: str
    url: str
    thumbnail_url: Optional[str] = None
    featured: Optional[bool] = False
    organization_name: Optional[str] = None
    isOpen: Optional[bool] = None
    submission_period_dates: Optional[str] = None
    displayed_location: Optional[str] = None
    registrations_count: Optional[int] = None
    prizeText: Optional[str] = None
    time_left_to_submission: Optional[str] = None
    themes: Optional[List[str]] = Field(default_factory=list)
    start_a_submission_url: Optional[str] = None
    source: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    mode: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
