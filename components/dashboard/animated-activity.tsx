"use client"

import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "@/lib/motion"
import { staggerContainerVariants, listItemVariants } from "@/lib/motion"
import { LogIn, Mail, Settings, UserIcon, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActivityProps {
  user: User
  profile?: any
}

export function AnimatedActivityFeed({ user, profile }: ActivityProps) {
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

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "login",
      description: "Logged in from Chrome on Windows",
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      icon: LogIn,
    },
    {
      id: 2,
      type: "profile",
      description: "Updated profile information",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      icon: UserIcon,
    },
    {
      id: 3,
      type: "avatar",
      description: "Changed profile picture",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      icon: Upload,
    },
    {
      id: 4,
      type: "email",
      description: "Email verification completed",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      icon: Mail,
    },
    {
      id: 5,
      type: "settings",
      description: "Account created",
      date: new Date(user.created_at || Date.now()).toISOString(),
      icon: Settings,
    },
  ]

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return `${diffSecs} seconds ago`
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="grid gap-6 md:grid-cols-2"
    >
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent account activity and logins</CardDescription>
          </div>
          <Avatar className="h-9 w-9 border border-muted">
            <AvatarImage
              src={profile?.avatar_url || "/placeholder.svg?height=36&width=36"}
              alt={profile?.username || user.email || "User"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">{getAvatarFallback()}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {activities.map((activity, index) => (
              <motion.li key={activity.id} variants={listItemVariants} custom={index} className="flex gap-4">
                <div className="mt-0.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <time className="text-xs text-muted-foreground">{formatDate(activity.date)}</time>
                </div>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

