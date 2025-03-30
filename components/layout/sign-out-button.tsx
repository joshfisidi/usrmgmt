"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function SignOutButton() {
  const { signOut } = useAuth()

  return (
    <Button type="button" variant="ghost" className="w-full justify-start px-2" onClick={signOut}>
      Sign out
    </Button>
  )
}

