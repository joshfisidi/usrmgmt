"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatedRegisterForm } from "@/components/auth/animated-register-form"
import Link from "next/link"
import { EnhancedHeaderWrapper } from "@/components/layout/enhanced-header-wrapper"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function RegisterPageClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeaderWrapper />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
          </div>
          <AnimatedRegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-primary underline underline-offset-4">
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

