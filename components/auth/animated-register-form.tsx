"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail, Lock, CheckCircle } from "lucide-react"
import { motion } from "@/lib/motion"
import { slideUpVariants, staggerContainerVariants } from "@/lib/motion"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export function AnimatedRegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/callback`,
        },
      })

      if (error) throw error

      setIsSuccess(true)
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="grid gap-6" initial="hidden" animate="visible" variants={staggerContainerVariants}>
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 10 }}
            className="flex justify-center mb-4"
          >
            <CheckCircle className="h-16 w-16 text-green-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Registration successful!</h3>
          <p className="text-green-700">Please check your email to confirm your account.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div className="grid gap-2" variants={slideUpVariants}>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="pl-10 h-11"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div className="grid gap-2" variants={slideUpVariants}>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pl-10 h-11"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div className="grid gap-2" variants={slideUpVariants}>
              <Label htmlFor="confirm-password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pl-10 h-11"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={slideUpVariants}>
              <Button type="submit" disabled={isLoading} className="w-full relative overflow-hidden">
                <span className="relative z-10">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary-foreground/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              </Button>
            </motion.div>
          </div>
        </form>
      )}
    </motion.div>
  )
}

