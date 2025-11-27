"use client"

import { useState, useMemo } from "react"
import { EnhancedNavbar } from "@/components/enhanced-navbar"
import { FiltersPanel } from "@/components/filters-panel"
import { HackathonGrid } from "@/components/hackathon-grid"
import type { FilterState } from "@/lib/types"
import { useHackathons } from "@/hooks/use-hackathons"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollToTop } from "@/components/scroll-to-top"
import Link from "next/link"

export default function ExplorePage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    themes: [],
    location: "",
    minPrize: undefined,
    maxPrize: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: "endingSoon",
  })

  const [showFilters, setShowFilters] = useState(false)
  const { hackathons, isLoading, error } = useHackathons()
  // console.log('Fetched hackathons:', hackathons);

  // Extract unique themes from hackathons
  const availableThemes = useMemo(() => {
    const themes = new Set<string>()
    hackathons.forEach((h) => {
      h.themes.forEach((t) => themes.add(t.name))
    })
    return Array.from(themes)
  }, [hackathons])

  // Filter and sort hackathons
  const filteredHackathons = useMemo(() => {
    let result = [...hackathons]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(searchLower) ||
          h.organization_name.toLowerCase().includes(searchLower) ||
          h.displayed_location.toLowerCase().includes(searchLower) ||
          h.themes.some((t) => t.name.toLowerCase().includes(searchLower)),
      )
    }


    // Themes filter
    if (filters.themes.length > 0) {
      result = result.filter((h) => h.themes.some((t) => filters.themes.includes(t.name)))
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      result = result.filter((h) => h.displayed_location.toLowerCase().includes(locationLower))
    }

    // Prize filter
    if (filters.minPrize !== undefined) {
      result = result.filter((h) => {
        if (h.prizeText === null) return false;
        const cleanPrizeText = h.prizeText.replace(/<[^>]*>?/gm, "").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const prize = Number.parseInt(cleanPrizeText.replace(/\D/g, "")) || 0
        return prize >= filters.minPrize!
      })
    }
    if (filters.maxPrize !== undefined) {
      result = result.filter((h) => {
        if (h.prizeText === null) return false;
        const cleanPrizeText = h.prizeText.replace(/<[^>]*>?/gm, "").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const prize = Number.parseInt(cleanPrizeText.replace(/\D/g, "")) || 0
        return prize <= filters.maxPrize!
      })
    }

    // Date filter
    if (filters.startDate) {
      result = result.filter((h) => new Date(h.submission_period_dates.split(" - ")[0]) >= new Date(filters.startDate!))
    }
    if (filters.endDate) {
      result = result.filter(
        (h) =>
          h.submission_period_dates &&
          new Date(h.submission_period_dates.split(" - ")[1]) <=
            new Date(filters.endDate!),
      )
    }

    // Sort
    switch (filters.sortBy) {
      case "prize":
        result.sort((a, b) => {
          const prizeA = Number.parseInt(a.prizeText.replace(/\D/g, "")) || 0
          const prizeB = Number.parseInt(b.prizeText.replace(/\D/g, "")) || 0
          return prizeB - prizeA
        })
        break
      case "popular":
        result.sort((a, b) => {
          const registrationsA = a.registrations_count === null ? 0 : a.registrations_count;
          const registrationsB = b.registrations_count === null ? 0 : b.registrations_count;
          return registrationsB - registrationsA;
        })
        break
      case "latest":
        result.sort((a, b) => b.id - a.id)
        break
      case "endingSoon":
        result.sort((a, b) => {
          const endDateA = a.submission_period_dates ? new Date(a.submission_period_dates.split(" - ")[1]).getTime() : Number.MAX_SAFE_INTEGER;
          const endDateB = b.submission_period_dates ? new Date(b.submission_period_dates.split(" - ")[1]).getTime() : Number.MAX_SAFE_INTEGER;
          return endDateA - endDateB;
        });
        break
      default:
    }

    return result
  }, [hackathons, filters])

  return (
    <div className="min-h-screen bg-background">
      {/* <EnhancedNavbar /> */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">

      {/* Search Bar Section */}
      <div className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-3xl font-bold lg:text-4xl text-center">
            Explore{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hackathons</span>
          </h1>
          <div className="mx-auto max-w-3xl flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search hackathons by name, organization, or location..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12 bg-card/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-border/50 bg-card/50 hover:bg-card"
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            availableThemes={availableThemes}
          />

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredHackathons.length} hackathon
                {filteredHackathons.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <HackathonGrid hackathons={filteredHackathons} isLoading={isLoading} error={error} />
          </main>
        </div>
      </div>

      </div> {/* Closing the div that starts on line 79 */}

      <footer className="border-t border-border/40 bg-card/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="font-mono text-sm font-bold text-primary-foreground">H</span>
              </div>
              <span className="font-bold">
                Hack<span className="text-primary">Hunt</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ShaikhWarsi. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}
