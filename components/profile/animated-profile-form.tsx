"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Database } from "@/types/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserIcon, Globe, FileType2Icon as UserIcon2, Check, Camera } from "lucide-react"
import { SignOutButton } from "../layout/sign-out-button"
import { motion } from "framer-motion"
import { slideUpVariants, staggerContainerVariants, scaleVariants } from "@/lib/motion"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileFormProps {
  profile: Profile | null
  user: User
}

export function AnimatedProfileForm({ profile, user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(profile?.username || "")
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isUpdated, setIsUpdated] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientSupabaseClient()

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "")
      setFullName(profile.full_name || "")
      setWebsite(profile.website || "")
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
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

      setIsUpdated(true)
      setTimeout(() => setIsUpdated(false), 3000)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    const file = e.target.files[0]

    try {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB")
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload the file
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)

      // Update avatar URL
      setAvatarUrl(data.publicUrl)

      // Show success toast
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "There was an error uploading your avatar.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainerVariants}>
      <Card className="overflow-hidden">
        <CardHeader>
          <motion.div variants={slideUpVariants}>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and avatar</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div className="flex flex-col items-center gap-4" variants={scaleVariants}>
              <div className="relative">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                  <Avatar className="h-32 w-32 border-2 border-muted">
                    <AvatarImage
                      src={avatarUrl || "/placeholder.svg?height=128&width=128"}
                      alt={fullName || username || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                      {(fullName || username || user.email || "User").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </motion.div>

                <motion.div className="absolute bottom-0 right-0" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full h-10 w-10 bg-primary shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </motion.div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium">{fullName || username || "Set your profile"}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.div className="grid gap-2" variants={slideUpVariants}>
                <Label htmlFor="username" className="flex items-center gap-2">
                  <UserIcon2 className="h-4 w-4 text-muted-foreground" />
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    placeholder="johndoe"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <UserIcon2 className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div className="grid gap-2" variants={slideUpVariants}>
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="full_name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div className="grid gap-2" variants={slideUpVariants}>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </Label>
                <div className="relative">
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={loading}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div className="flex justify-between" variants={slideUpVariants}>
              <Button type="submit" disabled={loading || isUploading} className="relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <motion.span
                        className="ml-1 opacity-0"
                        animate={isUpdated ? "visible" : "hidden"}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    </>
                  )}
                </span>
              </Button>

              <Button type="button" variant="outline">
                <SignOutButton />
              </Button>
            </motion.div>

            {isUpdated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Profile updated successfully!
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

