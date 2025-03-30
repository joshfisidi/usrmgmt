"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { slideUp, staggerContainer } from "@/lib/framer-animations"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <motion.div className="container px-4 md:px-6" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={staggerContainer}
        >
          <motion.div className="space-y-2" variants={slideUp}>
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
              variants={slideUp}
            >
              User Management System
            </motion.h1>
            <motion.p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl" variants={slideUp}>
              A complete user management solution with authentication, profile management, and more.
            </motion.p>
          </motion.div>
          <motion.div className="flex flex-col gap-2 sm:flex-row" variants={slideUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link href="/register">Get Started</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

