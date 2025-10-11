"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/components/auth/user-context"

export function SiteHeader() {
  const { user, setUser } = useCurrentUser()

  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/rutc-logo.jpg" alt="Rural–Urban Teacher Connect logo" className="h-7 w-7 rounded" />
          <span className="font-semibold">RUTC</span>
          <span className="sr-only">Home</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/notes">
            <Button variant="ghost" size="sm">
              Notes
            </Button>
          </Link>
          <Link href="/classes">
            <Button variant="ghost" size="sm">
              Classes
            </Button>
          </Link>
          <Link href="/shifts">
            <Button variant="ghost" size="sm">
              Shifts
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              Chat
            </Button>
          </Link>
          <Link href="/collaborate">
            <Button variant="ghost" size="sm">
              Collaborate
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-xs text-muted-foreground">
                {user.name} • {user.role} • {user.region}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setUser(null)}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
