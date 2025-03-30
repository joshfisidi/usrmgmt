"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatedProfileForm } from "@/components/profile/animated-profile-form"
import { EnhancedHeaderWrapper } from "@/components/layout/enhanced-header-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedDashboardStats } from "@/components/dashboard/animated-stats"
import { AnimatedActivityFeed } from "@/components/dashboard/animated-activity"
import { useAuth } from "@/context/auth-context"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPageClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const supabase = createClientSupabaseClient()

          // Check if profile exists
          const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (error && error.code !== "PGRST116") {
            console.error("Error loading profile:", error)
            return
          }

          // If profile doesn't exist, create it
          if (!data) {
            const newProfile = {
              id: user.id,
              username: "",
              full_name: "",
              website: "",
              avatar_url: "",
              updated_at: new Date().toISOString(),
            }

            const { data: createdProfile, error: createError } = await supabase
              .from("profiles")
              .insert(newProfile)
              .select()
              .single()

            if (createError) {
              console.error("Error creating profile:", createError)
              return
            }

            setProfile(createdProfile)
          } else {
            setProfile(data)
          }
        } catch (error) {
          console.error("Error in profile flow:", error)
        } finally {
          setProfileLoading(false)
        }
      } else {
        setProfileLoading(false)
      }
    }

    if (user) {
      loadProfile()
    } else {
      setProfileLoading(false)
    }
  }, [user])

  if (isLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <EnhancedHeaderWrapper />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <AnimatedProfileForm profile={profile} user={user} />
              </div>
              <div>
                <AnimatedDashboardStats user={user} profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <AnimatedActivityFeed user={user} profile={profile} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Account settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

