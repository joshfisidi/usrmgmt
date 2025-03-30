"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "@/lib/motion"
import { slideUpVariants, staggerContainerVariants } from "@/lib/motion"
import { useAuth } from "@/context/auth-context"

export function AnimatedLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await signIn(email, password)
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="grid gap-6" initial="hidden" animate="visible" variants={staggerContainerVariants}>
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
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                initial={{ opacity: 0.5 }}
                whileFocus={{ scale: 1.1, opacity: 1 }}
              >
                <Mail className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="grid gap-2" variants={slideUpVariants}>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="link" className="px-0 font-normal h-auto" asChild>
                  <a href="/forgot-password">Forgot password?</a>
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pl-10 h-11"
              />
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                initial={{ opacity: 0.5 }}
                whileFocus={{ scale: 1.1, opacity: 1 }}
              >
                <Lock className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={slideUpVariants}>
            <Button type="submit" disabled={isLoading} className="w-full relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <motion.div
                      initial={{ x: -5, opacity: 0.5 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                        repeatDelay: 1,
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-primary-foreground/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}

