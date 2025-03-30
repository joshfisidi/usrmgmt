"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { fadeIn } from "@/lib/framer-animations"
import { SignOutButton } from "./sign-out-button"
import { useAuth } from "@/context/auth-context"
import { createClientSupabaseClient } from "@/lib/supabase/client"

interface HeaderProps {
  initialUser?: any | null
}

export function EnhancedHeader({ initialUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user: clientUser } = useAuth()
  const [user, setUser] = useState<any | null>(initialUser)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Use either the server-provided user or the client-side user
  useEffect(() => {
    if (clientUser) {
      setUser(clientUser)
    }
  }, [clientUser])

  // Fetch user profile data
  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const supabase = createClientSupabaseClient()
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          setProfile(data)
        } catch (error) {
          console.error("Error fetching profile:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

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

  // Get avatar URL or fallback
  const getAvatarUrl = () => {
    return profile?.avatar_url || "/placeholder.svg?height=32&width=32"
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
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <motion.div
            className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            UM
          </motion.div>
          <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            UserMgmt
          </motion.span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 rounded-full px-2 flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-muted">
                    <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block">{getDisplayName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </motion.div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden border-t"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="container py-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-10 w-10 border border-muted">
                    <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{getDisplayName()}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="py-2 px-3 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="py-2 px-3 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <div className="py-2 px-3 hover:bg-muted rounded-md text-destructive">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 px-3 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-3 bg-primary text-primary-foreground rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

