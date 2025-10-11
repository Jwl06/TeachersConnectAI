"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentUser, type CurrentUser } from "@/components/auth/user-context"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useCurrentUser()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [role, setRole] = useState<CurrentUser["role"]>("teacher")
  const [region, setRegion] = useState<CurrentUser["region"]>("rural")

  const canSubmit = name.trim().length > 1

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Select your role and region to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={role === "teacher" ? "default" : "secondary"}
                onClick={() => setRole("teacher")}
              >
                Teacher
              </Button>
              <Button
                type="button"
                variant={role === "student" ? "default" : "secondary"}
                onClick={() => setRole("student")}
              >
                Student
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Region</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={region === "rural" ? "default" : "secondary"}
                onClick={() => setRegion("rural")}
              >
                Rural
              </Button>
              <Button
                type="button"
                variant={region === "urban" ? "default" : "secondary"}
                onClick={() => setRegion("urban")}
              >
                Urban
              </Button>
            </div>
          </div>

          <Button
            className="mt-2"
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return
              setUser({ name: name.trim(), role, region })
              toast({ title: "Welcome!", description: `Signed in as ${name.trim()} (${role}, ${region})` })
              router.push("/")
            }}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
