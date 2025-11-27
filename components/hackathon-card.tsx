"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Trophy, Users, Clock, ExternalLink, AwardIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Hackathon } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"
// import { getBookmarkedHackathons, addBookmark, removeBookmark } from "@/lib/local-storage-utils";

interface HackathonCardProps {
  hackathon: Hackathon
  index: number
}

    export function HackathonCard({ hackathon, index }: HackathonCardProps) {
      // const [isBookmarked, setIsBookmarked] = useState(false)

      // useEffect(() => {
      //   const bookmarkedHackathons = getBookmarkedHackathons();
      //   setIsBookmarked(bookmarkedHackathons.includes(hackathon._id));
      // }, [hackathon._id])

    // const handleBookmarkToggle = async (e: React.MouseEvent) => {
    //   e.preventDefault()

    //   try {
    //     if (isBookmarked) {
    //       removeBookmark(hackathon._id)
    //       toast.success("Hackathon unbookmarked!")
    //     } else {
    //       addBookmark(hackathon._id)
    //       toast.success("Hackathon bookmarked!")
    //     }
    //     setIsBookmarked(!isBookmarked)
    //   } catch (error) {
    //     toast.error("Failed to update bookmark status.")
    //     console.error("Bookmark toggle error:", error)
    //   }
    // }

    // console.log("HackathonCard received hackathon:", hackathon);
    const parseDates = (dateString: string) => {
      let start = new Date(); // Default to current date
      let end = new Date(); // Default to current date

      try {
        if (dateString.includes(' - ')) {
          // Format: "Month Day - Day, Year" e.g., "Nov 26 - 27, 2025"
          const parts = dateString.split(', '); // ["Nov 26 - 27", "2025"]
          const year = parts.length > 1 ? parts[1] : new Date().getFullYear().toString();
          const dateRange = parts[0].split(' - '); // ["Nov 26", "27"]

          const startMonthDay = dateRange[0]; // "Nov 26"
          const endDay = dateRange[1]; // "27"

          const parsedStart = new Date(`${startMonthDay}, ${year}`);
          if (!isNaN(parsedStart.getTime())) {
            start = parsedStart;
          }

          // For the end date, we need to infer the month from the start date
          const endMonth = start.getMonth(); // Get month from parsedStart
          const parsedEnd = new Date(start.getFullYear(), endMonth, parseInt(endDay), 23, 59, 59); // Set to end of day
          if (!isNaN(parsedEnd.getTime())) {
            end = parsedEnd;
          }

        } else {
          // Format: "Month Day, Year" e.g., "Nov 26, 2025"
          const singleDate = new Date(dateString);
          if (!isNaN(singleDate.getTime())) {
            start = singleDate;
            end = singleDate;
          }
        }
      } catch (error) {
        console.error("Error parsing dates:", error);
      }
      return { start, end };
    };

    const { start: startDate, end: endDate } = typeof hackathon.submission_period_dates === 'string'
      ? parseDates(hackathon.submission_period_dates)
      : { start: new Date(), end: new Date() };

    // Format dates for calendar links (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date | null | undefined) => {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return ''; // Return empty string for invalid dates
      }
      return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    };

  // console.log('Raw submission_start:', hackathon.submission_start);
  // console.log('Raw submission_end:', hackathon.submission_end);

  // const startDate = hackathon.submission_start ? new Date(hackathon.submission_start as string) : new Date();
  // const endDate = hackathon.submission_end ? new Date(hackathon.submission_end as string) : new Date();

  // console.log('Processed startDate:', startDate);
  // console.log('Processed endDate:', endDate);
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  // console.log('startFormatted:', startFormatted);
  // console.log('endFormatted:', endFormatted);

  // Encode event details for URL parameters
  const title = encodeURIComponent(hackathon.title || 'Hackathon Event');
  const location = encodeURIComponent(hackathon.displayed_location || 'Online');
  const description = encodeURIComponent(hackathon.description || 'Participate in this hackathon!');

  // Direct calendar links
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&location=${location}&details=${description}`;
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startFormatted}&enddt=${endFormatted}&location=${location}&body=${description}`;
  const icalContent = encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${hackathon._id}@open-hackathons\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${startFormatted}\nDTEND:${endFormatted}\nSUMMARY:${hackathon.title}\nLOCATION:${hackathon.displayed_location}\nDESCRIPTION:${hackathon.description}\nEND:VEVENT\nEND:VCALENDAR`);
  const icalCalendarUrl = `data:text/calendar;charset=utf-8,${icalContent}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="group h-full"
    >
      <Link href={`/hackathon/${hackathon._id}`}>
        <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
          {/* Thumbnail */}
          <div className="relative h-48 w-full overflow-hidden bg-secondary">
            {hackathon.thumbnail_url ? (
              <Image
                src={hackathon.thumbnail_url || "/placeholder.svg"}
                alt={hackathon.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Trophy className="size-16 text-primary/50" />
                </motion.div>
              </div>
            )}
            {/* Status Badge */}
            <div className="absolute right-3 top-3">
              <Badge
                variant={hackathon.isOpen === "open" ? "default" : "secondary"}
                className="bg-background/80 backdrop-blur-sm"
              >
                {hackathon.isOpen === "open" ? "Open" : "Closed"}
              </Badge>
            </div>
            {/* Favorite Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute left-3 top-3 z-10 rounded-full",
                isBookmarked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleBookmarkToggle}
            >
              <Heart className={cn("size-5", isBookmarked && "fill-current")} />
            </Button> */}
            {/* Featured Badge */}
            {hackathon.featured && (
              <div className="absolute left-3 top-3">
                <Badge className="bg-accent/80 backdrop-blur-sm">Featured</Badge>
              </div>
            )}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          </div>

          {/* Content */}
          <div className="space-y-4 p-5">
            {/* Title & Organization */}
            <div>
              <h3 className="mb-1 line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                {hackathon.title}
              </h3>
              <p className="text-sm text-muted-foreground">{hackathon.organization_name}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {hackathon.displayed_location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{hackathon.displayed_location}</span>
                </div>
              )}
              {hackathon.prizeText ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="size-4 shrink-0" />
                  <span className="truncate">
                    {hackathon.prizeText.replace(/<[^>]*>?/gm, "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="size-4 shrink-0" />
                  <span className="truncate">No prize</span>
                </div>
              )}
              {hackathon.submission_period_dates && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0" />
                  <span className="truncate">{hackathon.submission_period_dates}</span>
                </div>
              )}
              {hackathon.registrations_count !== null && hackathon.registrations_count > 0 ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4 shrink-0" />
                  <span>{hackathon.registrations_count} registered</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4 shrink-0" />
                  <span>No registrations</span>
                </div>
              )}
            </div>

            {/* Time Left */}
            {hackathon.time_left_to_submission && hackathon.isOpen === "open" && (
              <motion.div
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Clock className="size-4" />
                <span>{hackathon.time_left_to_submission}</span>
              </motion.div>
            )}

            {/* Themes */}
            {hackathon.themes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hackathon.themes.slice(0, 3).map((theme) => (
                  <Badge key={theme.id} variant="outline" className="text-xs border-border/50">
                    {theme.name}
                  </Badge>
                ))}
                {hackathon.themes.length > 3 && (
                  <Badge variant="outline" className="text-xs border-border/50">
                    +{hackathon.themes.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all group/btn"
              onClick={(e) => {
                e.preventDefault()
                window.open(hackathon.url, "_blank")
              }}
            >
              <span>View Details</span>
              <ExternalLink className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => window.open(googleCalendarUrl, '_blank')} className="flex-1">
                <Calendar className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="secondary" onClick={() => window.open(outlookCalendarUrl, '_blank')} className="flex-1">
                <Calendar className="mr-2 h-4 w-4" /> Outlook
              </Button>
              <Button variant="secondary" onClick={() => window.open(icalCalendarUrl, '_blank')} className="flex-1">
                <Calendar className="mr-2 h-4 w-4" /> iCal
              </Button>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-accent/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
