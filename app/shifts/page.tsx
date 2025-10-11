"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCurrentUser } from "@/components/auth/user-context"
import { loadList, saveList, uid } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"
import { mockShifts } from "@/lib/mock"

type ShiftRequest = {
  id: string
  subject: string
  dateRange: string
  details: string
  requesterName: string
  status: "open" | "accepted"
  acceptedBy?: string
  createdAt: string
}

const STORAGE_KEY = "ru-connect.shifts"

export default function ShiftsPage() {
  const { user, isRural, isUrban } = useCurrentUser()
  const { toast } = useToast()
  const [requests, setRequests] = useState<ShiftRequest[]>([])
  const [subject, setSubject] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [details, setDetails] = useState("")

  useEffect(() => {
    const loaded = loadList<ShiftRequest>(STORAGE_KEY, [])
    if (loaded.length === 0) {
      const seeded: ShiftRequest[] = mockShifts.map((s) => ({
        id: s.id,
        subject: s.subject,
        dateRange: s.date,
        details: "",
        requesterName: s.requestedBy,
        status: "open",
        createdAt: new Date().toISOString(),
      }))
      setRequests(seeded)
      saveList(STORAGE_KEY, seeded)
      toast({ title: "Loaded demo requests" })
    } else {
      setRequests(loaded)
    }
  }, [])

  const addRequest = () => {
    if (!user || !isRural) return
    if (!subject.trim() || !dateRange.trim()) return
    const newReq: ShiftRequest = {
      id: uid("shift"),
      subject: subject.trim(),
      dateRange: dateRange.trim(),
      details: details.trim(),
      requesterName: user.name,
      status: "open",
      createdAt: new Date().toISOString(),
    }
    const updated = [newReq, ...requests]
    setRequests(updated)
    saveList(STORAGE_KEY, updated)
    setSubject("")
    setDateRange("")
    setDetails("")
    toast({ title: "Request submitted", description: "Urban teachers can now view and accept." })
  }

  const sorted = useMemo(() => [...requests].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [requests])

  const accept = (id: string) => {
    if (!user || !isUrban) return
    const updated = requests.map((r) =>
      r.id === id && r.status === "open" ? { ...r, status: "accepted", acceptedBy: user.name } : r,
    )
    setRequests(updated)
    saveList(STORAGE_KEY, updated)
    toast({ title: "Accepted", description: "You've accepted this shift request." })
  }

  return (
    <main className="mx-auto max-w-4xl p-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-balance">Shift Requests</h1>
        <p className="text-sm text-muted-foreground">Rural: request help. Urban: accept and coordinate.</p>
      </header>

      {isRural && user && (
        <Card>
          <CardHeader>
            <CardTitle>Request Urban Teacher Support</CardTitle>
            <CardDescription>Describe subject, date(s), and context.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Grade 6 Math"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateRange">Date / Slot</Label>
              <Input
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="e.g., 12–14 Oct, 10–12am"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Context, topics, constraints"
              />
            </div>
            <Button onClick={addRequest}>Submit Request</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Open Requests</CardTitle>
          <CardDescription>Latest first</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No requests yet.</div>
          ) : (
            sorted.map((r) => (
              <div key={r.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.subject}</div>
                  <div className="text-xs text-muted-foreground">{r.dateRange}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Requested by {r.requesterName}</div>
                {r.details && <p className="text-sm mt-2 whitespace-pre-wrap">{r.details}</p>}
                <div className="mt-2 flex items-center gap-2">
                  {r.status === "open" ? (
                    <span className="text-xs border rounded px-2 py-0.5">Open</span>
                  ) : (
                    <span className="text-xs border rounded px-2 py-0.5">Accepted</span>
                  )}
                  {r.status === "open" ? (
                    <Button size="sm" onClick={() => accept(r.id)} disabled={!isUrban}>
                      {isUrban ? "Accept" : "Urban only"}
                    </Button>
                  ) : (
                    <div className="text-sm">by {r.acceptedBy}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
