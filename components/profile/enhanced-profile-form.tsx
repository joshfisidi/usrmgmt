"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Database } from "@/types/supabase"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { slideUp } from "@/lib/framer-animations"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileFormProps {
  profile: Profile | null
  user: User
}

export function EnhancedProfileForm({ profile, user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(profile?.username || "")
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const { toast } = useToast()
  const { signOut } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setLoading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const filePath = `${user.id}-${Math.random()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was an error uploading your avatar.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile details and avatar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div className="space-y-2" variants={slideUp}>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-muted">
                <AvatarImage src={avatarUrl || "/placeholder.svg?height=80&width=80"} alt={fullName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {(fullName || username || user.email || "User").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Avatar
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                    </Button>
                  </div>
                </Label>
              </div>
            </div>
          </motion.div>
          <div className="space-y-4">
            <motion.div className="grid gap-2" variants={slideUp}>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled />
              <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
            </motion.div>
            <motion.div className="grid gap-2" variants={slideUp}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </motion.div>
            <motion.div className="grid gap-2" variants={slideUp}>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </motion.div>
            <motion.div className="grid gap-2" variants={slideUp}>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
                placeholder="https://example.com"
              />
            </motion.div>
          </div>
          <motion.div className="flex justify-between" variants={slideUp}>
            <Button type="submit" disabled={loading} className="relative overflow-hidden">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => signOut()} className="relative overflow-hidden">
              Sign Out
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}

