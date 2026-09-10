import { cache } from "react"
import { cookies } from "next/headers"
import { auth as nextAuth } from "@/auth"

export type AppUserRole = "klient" | "administrator"

export interface AppSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: AppUserRole
  }
}

async function getSession(): Promise<AppSession | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("auth_session")?.value
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie)) as AppSession
        if (parsed?.user?.role) {
          return parsed
        }
      } catch (e) {
        console.error("Failed to parse auth_session cookie", e)
      }
    }

    try {
      const session = await nextAuth()
      if (session?.user) {
        return session as unknown as AppSession
      }
    } catch {
      // nextAuth failed gracefully
    }
    return null
  } catch (error) {
    console.warn("auth() check handled safely:", error)
    return null
  }
}

export default cache(getSession)
