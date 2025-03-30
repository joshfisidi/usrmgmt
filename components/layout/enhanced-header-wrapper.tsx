"use client"

import { EnhancedHeader } from "./enhanced-header"
import { useAuth } from "@/context/auth-context"

export function EnhancedHeaderWrapper() {
  const { user } = useAuth()

  return <EnhancedHeader serverUser={user} />
}

