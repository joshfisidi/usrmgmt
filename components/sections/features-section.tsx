"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRound, Shield, UserCog, Key } from "lucide-react"
import { staggerContainer, scaleIn } from "@/lib/framer-animations"

const features = [
  {
    icon: <UserRound className="h-10 w-10 text-primary" />,
    title: "User Authentication",
    description: "Secure login and registration with email verification and password recovery.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Protected Routes",
    description: "Middleware ensures only authenticated users can access protected content.",
  },
  {
    icon: <UserCog className="h-10 w-10 text-primary" />,
    title: "Profile Management",
    description: "Users can update their profile information and upload custom avatars.",
  },
  {
    icon: <Key className="h-10 w-10 text-primary" />,
    title: "Secure Storage",
    description: "User data is securely stored in Supabase with row-level security policies.",
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need for complete user management
            </p>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={scaleIn}>
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

