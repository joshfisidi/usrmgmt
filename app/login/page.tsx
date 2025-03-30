import type { Metadata } from "next"
import LoginPageClient from "./login-page-client"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <LoginPageClient initialUser={session?.user || null} />
}

