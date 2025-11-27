<<<<<<< HEAD
"use client"

import { use } from "react"
import { motion } from "framer-motion"
import { useHackathons } from "@/hooks/use-hackathons"
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getHackathonById } from "@/lib/api";

export default async function HackathonDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const hackathon = await getHackathonById(params.id);

  if (!hackathon) {
    return <div>Hackathon not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/explore">
            <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
              <ArrowLeft className="size-4" />
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/10 to-background">
        <div className="absolute inset-0">
          <motion.div
            className="absolute -right-40 -top-40 size-80 rounded-full bg-primary/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge variant={hackathon.isOpen === "open" ? "default" : "secondary"} className="text-sm">
                {hackathon.isOpen === "open" ? "Open for Submissions" : "Closed"}
              </Badge>
              {hackathon.featured && <Badge className="bg-accent text-sm">Featured</Badge>}
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">{hackathon.title}</h1>

            <p className="mb-6 text-xl text-muted-foreground">Organized by {hackathon.organization_name}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => window.open(hackathon.url, "_blank")}
              >
                View on {hackathon.source}
                <ExternalLink className="size-4" />
              </Button>
              {hackathon.start_a_submission_url && (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => window.open(hackathon.start_a_submission_url, "_blank")}
                >
                  Start Submission
                  <ExternalLink className="size-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {/* Left Column - Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-border/50 bg-card/50">
              {/* Thumbnail */}
              {hackathon.thumbnail_url ? (
                <div className="relative h-96 w-full">
                  <Image
                    src={hackathon.thumbnail_url || "/placeholder.svg"}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Trophy className="size-32 text-primary/50" />
                </div>
              )}

              {/* Details Grid */}
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Hackathon Details</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  {hackathon.displayed_location && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{hackathon.displayed_location}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.prizeText && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Trophy className="size-6 text-accent" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Prize Pool</p>
                        <p className="font-semibold">{hackathon.prizeText}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.submission_period_dates && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Submission Period</p>
                        <p className="font-semibold">{hackathon.submission_period_dates}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.registrations_count > 0 && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Users className="size-6 text-accent" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Participants</p>
                        <p className="font-semibold">{hackathon.registrations_count.toLocaleString()} registered</p>
                      </div>
                    </div>
                  )}
                </div>

                {hackathon.time_left_to_submission && hackathon.isOpen === "open" && (
                  <>
                    <Separator className="my-6" />
                    <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
                      <Clock className="size-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time Remaining</p>
                        <p className="font-semibold text-primary">{hackathon.time_left_to_submission}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Themes & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Themes Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-4 text-lg font-bold">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {hackathon.themes.map((theme) => (
                  <Badge key={theme.id} variant="secondary" className="text-sm">
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start gap-2 bg-transparent"
                  variant="outline"
                  onClick={() => window.open(hackathon.url, "_blank")}
                >
                  <ExternalLink className="size-4" />
                  Visit Official Page
                </Button>
                {hackathon.start_a_submission_url && (
                  <Button
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(hackathon.start_a_submission_url, "_blank")}
                  >
                    <Trophy className="size-4" />
                    Start Your Submission
                  </Button>
                )}
              </div>
            </Card>

            {/* Source Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-2 text-sm text-muted-foreground">Source Platform</h3>
              <p className="font-semibold capitalize">{hackathon.source}</p>
            </Card>
          </motion.div>
        </div>
      </div>

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
    </div>
  )
}
=======
"use client"

import { use } from "react"
import { motion } from "framer-motion"
import { useHackathons } from "@/hooks/use-hackathons"
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getHackathonById } from "@/lib/api";

export default async function HackathonDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const hackathon = await getHackathonById(params.id);

  if (!hackathon) {
    return <div>Hackathon not found</div>;
  }

  return (
    <>
      {/* <EnhancedNavbar /> */}
      <div className="container relative pb-24 pt-10">
        {/* <EnhancedNavbar /> */}

        <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <Link href="/explore">
              <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                <ArrowLeft className="size-4" />
                Back to Explore
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/10 to-background">
          <div className="absolute inset-0">
            <motion.div
              className="absolute -right-40 -top-40 size-80 rounded-full bg-primary/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="container relative mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-6 flex flex-wrap gap-3">
                <Badge variant={hackathon.isOpen === "open" ? "default" : "secondary"} className="text-sm">
                  {hackathon.isOpen === "open" ? "Open for Submissions" : "Closed"}
                </Badge>
                {hackathon.featured && <Badge className="bg-accent text-sm">Featured</Badge>}
              </div>

              <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">{hackathon.title}</h1>

              <p className="mb-6 text-xl text-muted-foreground">Organized by {hackathon.organization_name}</p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => window.open(hackathon.url, "_blank")}
                >
                  View on {hackathon.source}
                  <ExternalLink className="size-4" />
                </Button>
                {hackathon.start_a_submission_url && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => window.open(hackathon.start_a_submission_url, "_blank")}
                  >
                    Start Submission
                    <ExternalLink className="size-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {/* Left Column - Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-border/50 bg-card/50">
              {/* Thumbnail */}
              {hackathon.thumbnail_url ? (
                <div className="relative h-96 w-full">
                  <Image
                    src={hackathon.thumbnail_url || "/placeholder.svg"}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Trophy className="size-32 text-primary/50" />
                </div>
              )}

              {/* Details Grid */}
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Hackathon Details</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  {hackathon.displayed_location && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{hackathon.displayed_location}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.prizeText && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Trophy className="size-6 text-accent" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Prize Pool</p>
                        <p className="font-semibold">{hackathon.prizeText}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.submission_period_dates && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Submission Period</p>
                        <p className="font-semibold">{hackathon.submission_period_dates}</p>
                      </div>
                    </div>
                  )}

                  {hackathon.registrations_count > 0 && (
                    <div className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Users className="size-6 text-accent" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Participants</p>
                        <p className="font-semibold">{hackathon.registrations_count.toLocaleString()} registered</p>
                      </div>
                    </div>
                  )}
                </div>

                {hackathon.time_left_to_submission && hackathon.isOpen === "open" && (
                  <>
                    <Separator className="my-6" />
                    <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
                      <Clock className="size-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time Remaining</p>
                        <p className="font-semibold text-primary">{hackathon.time_left_to_submission}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Themes & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Themes Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-4 text-lg font-bold">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {hackathon.themes.map((theme) => (
                  <Badge key={theme.id} variant="secondary" className="text-sm">
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start gap-2 bg-transparent"
                  variant="outline"
                  onClick={() => window.open(hackathon.url, "_blank")}
                >
                  <ExternalLink className="size-4" />
                  Visit Official Page
                </Button>
                {hackathon.start_a_submission_url && (
                  <Button
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(hackathon.start_a_submission_url, "_blank")}
                  >
                    <Trophy className="size-4" />
                    Start Your Submission
                  </Button>
                )}
              </div>
            </Card>

            {/* Source Card */}
            <Card className="border-border/50 bg-card/50 p-6">
              <h3 className="mb-2 text-sm text-muted-foreground">Source Platform</h3>
              <p className="font-semibold capitalize">{hackathon.source}</p>
            </Card>
          </motion.div>
        </div>
      </div>

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
    </div>
  )
}
>>>>>>> 3c2839fc82b5ab928942cf87c34be07c04386f95
