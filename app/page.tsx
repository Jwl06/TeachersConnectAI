"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCurrentUser, CurrentUserProvider } from "@/components/auth/user-context"

function HomeInner() {
  const { user, isTeacher, isStudent, isRural, isUrban } = useCurrentUser()

  return (
    <main className="mx-auto max-w-5xl p-6 flex flex-col gap-6">
      <section className="rounded-lg border p-5 bg-accent/40">
        <h1 className="text-2xl font-semibold text-balance">Rural–Urban Teacher Connect</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share notes, coordinate shifts, access prepared classes, and get AI-powered help.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/notes">
            <Button size="sm">Browse Notes</Button>
          </Link>
          <Link href="/classes">
            <Button size="sm" variant="secondary">
              Prepared Classes
            </Button>
          </Link>
          <Link href="/shifts">
            <Button size="sm" variant="secondary">
              Shifts
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="sm" variant="secondary">
              AI Chat
            </Button>
          </Link>
          <Link href="/videos">
            <Button size="sm" variant="secondary">
              AI Videos
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Teachers upload notes; everyone can access and translate.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/notes">
              <Button className="w-full">Open Notes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prepared Classes</CardTitle>
            <CardDescription>Access teacher-prepared classes and generate AI lessons by grade.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/classes">
              <Button className="w-full">Open Classes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shift Requests</CardTitle>
            <CardDescription>Rural schools request shifts; urban teachers can volunteer.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/shifts">
              <Button className="w-full">{isRural ? "Request Support" : isUrban ? "View Requests" : "View"}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Chat & Q&A</CardTitle>
            <CardDescription>Ask doubts; get quick answers and run Q&A.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="w-full">Open Chat</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Video Generator</CardTitle>
            <CardDescription>Create educational videos automatically using AI based on topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/videos">
              <Button className="w-full">Generate Videos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Collaborate</CardTitle>
            <CardDescription>Rural and urban teachers plan together and share resources.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/collaborate">
              <Button>Open Collaboration Board</Button>
            </Link>
            {!user && (
              <Link href="/login">
                <Button variant="secondary">Login to Contribute</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      <footer className="text-sm text-muted-foreground">
        Designed for low-bandwidth contexts. Data is local to your browser in this demo.
      </footer>
    </main>
  )
}

export default function HomePage() {
  return (
    <CurrentUserProvider>
      <HomeInner />
    </CurrentUserProvider>
  )
}
