"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { updateProfile } from "@/lib/supabase/actions"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Database } from "@/types/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { useFormStatus } from "react-dom"
import { SignOutButton } from "../layout/sign-out-button"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileFormProps {
  profile: Profile | null
  user: User
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  )
}

export function ProfileForm({ profile, user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(profile?.username || "")
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    formData.append("id", user.id)
    formData.append("avatar_url", avatarUrl)

    const result = await updateProfile(formData)

    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setLoading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const filePath = `${user.id}-${Math.random()}.${fileExt}`

    try {
      const supabase = createClientSupabaseClient()

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
        <form action={handleSubmit} className="space-y-8">
          <div className="space-y-2">
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
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled />
              <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <SubmitButton />
            <Button type="button" variant="outline">
              <SignOutButton />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

