"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EnhancedHeader } from "@/components/layout/enhanced-header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { PageTransition } from "@/components/ui/page-transition"

export default function HomePageClient({ initialUser }: { initialUser: any | null }) {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
        <EnhancedHeader initialUser={initialUser} />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js, Supabase, and Framer Motion
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}

