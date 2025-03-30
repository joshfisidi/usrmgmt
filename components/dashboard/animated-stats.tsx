"use client"

import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "@/lib/motion"
import { slideUpVariants, scaleVariants } from "@/lib/motion"
import { useEffect, useState } from "react"
import { Clock, UserCheck, Calendar, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StatsProps {
  user: User
  profile?: any
}

export function AnimatedDashboardStats({ user, profile }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Get display name (username, full name, or email)
  const getDisplayName = () => {
    if (profile?.username) return profile.username
    if (profile?.full_name) return profile.full_name
    if (user?.email) {
      const emailName = user.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

  // Get avatar fallback (initials)
  const getAvatarFallback = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase()
    }
    if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <motion.div initial="hidden" animate={isVisible ? "visible" : "hidden"} variants={scaleVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border border-muted">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=64&width=64"} alt={getDisplayName()} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{getDisplayName()}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <motion.div className="space-y-1" variants={slideUpVariants} custom={0}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserCheck className="h-4 w-4 text-primary" />
              <p>Username</p>
            </div>
            <p className="text-sm text-muted-foreground">{profile?.username || "Not set"}</p>
          </motion.div>

          <motion.div className="space-y-1" variants={slideUpVariants} custom={1}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              <p>Account Created</p>
            </div>
            <p className="text-sm text-muted-foreground">{new Date(user.created_at || "").toLocaleDateString()}</p>
          </motion.div>

          {profile?.website && (
            <motion.div className="space-y-1" variants={slideUpVariants} custom={2}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-primary" />
                <p>Website</p>
              </div>
              <p className="text-sm text-muted-foreground">
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {profile.website}
                </a>
              </p>
            </motion.div>
          )}

          <motion.div className="space-y-1" variants={slideUpVariants} custom={3}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              <p>Status</p>
            </div>
            <div className="flex items-center">
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500 mr-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

