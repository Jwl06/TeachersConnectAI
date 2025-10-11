"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Role = "teacher" | "student"
type Region = "rural" | "urban"

export type CurrentUser = {
  name: string
  role: Role
  region: Region
}

type Ctx = {
  user: CurrentUser | null
  setUser: (u: CurrentUser | null) => void
  isTeacher: boolean
  isStudent: boolean
  isRural: boolean
  isUrban: boolean
}

const UserContext = createContext<Ctx | undefined>(undefined)

const STORAGE_KEY = "ru-connect.currentUser"

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<CurrentUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUserState(JSON.parse(raw))
    } catch {}
  }, [])

  const setUser = (u: CurrentUser | null) => {
    setUserState(u)
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      isTeacher: user?.role === "teacher",
      isStudent: user?.role === "student",
      isRural: user?.region === "rural",
      isUrban: user?.region === "urban",
    }),
    [user],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useCurrentUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider")
  return ctx
}
