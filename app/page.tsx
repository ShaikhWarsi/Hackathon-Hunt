"use client"

import { EnhancedNavbar } from "@/components/enhanced-navbar"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Search, Filter, Sparkles, Globe, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find hackathons that match your interests and skills with our intelligent search system",
    },
    {
      icon: Filter,
      title: "Advanced Filters",
      description: "Filter by location, prize pool, theme, and more to find your perfect hackathon",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications about new hackathons and registration deadlines",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access hackathons from around the world, both virtual and in-person",
    },

    {
      icon: Trophy,
      title: "Prize Tracking",
      description: "Keep track of prize pools and opportunities to win big at hackathons",
    },
  ]

  const stats = [
    { value: "1000+", label: "Hackathons" },
    { value: "50K+", label: "Participants" },
    { value: "$5M+", label: "In Prizes" },
    { value: "100+", label: "Countries" },
  ]

  return (
    <div className="min-h-screen">


      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-48 size-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -right-48 size-96 rounded-full bg-accent/20 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div initial="initial" animate="animate" variants={stagger} className="mx-auto max-w-4xl text-center">
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm"
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium">Discover Your Next Big Opportunity</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mb-6 text-balance text-4xl font-bold leading-tight lg:text-6xl">
              Find and Join{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hackathons</span>{" "}
              Worldwide
            </motion.h1>

            <motion.p variants={fadeInUp} className="mb-8 text-pretty text-lg text-muted-foreground lg:text-xl">
              HackHunt is your gateway to discovering amazing hackathons. Connect with innovators, build incredible
              projects, and win exciting prizes.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-base hover:opacity-90"
              >
                <Link href="/explore">
                  Explore Hackathons
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              {/* <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
                <Link href="/about">Learn More</Link>
              </Button> */}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeInUp} className="mb-4 text-3xl font-bold lg:text-4xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Succeed</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-pretty text-lg text-muted-foreground">
              Powerful features to help you discover and participate in the best hackathons
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-pretty text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h2 variants={fadeInUp} className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hacking Journey?
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mb-8 text-pretty text-lg text-muted-foreground">
              Join thousands of hackers discovering and participating in amazing hackathons every day
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-base hover:opacity-90"
              >
                <Link href="/explore">
                  Get Started for Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-12">
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
            {/* <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div> */}
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}
