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
import { Spinner } from "@/components/ui/spinner"
import { mockClasses } from "@/lib/mock"

type PreparedClass = {
  id: string
  title: string
  syllabus: string
  gradeLevel: string
  teacherName: string
  createdAt: string
}

const STORAGE_KEY = "ru-connect.classes"
const GRADES = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
]

export default function ClassesPage() {
  const { user, isTeacher } = useCurrentUser()
  const { toast } = useToast()
  const [classes, setClasses] = useState<PreparedClass[]>([])
  const [title, setTitle] = useState("")
  const [syllabus, setSyllabus] = useState("")
  const [gradeLevel, setGradeLevel] = useState("Grade 6")
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Record<string, string>>({})

  useEffect(() => {
    const loaded = loadList<PreparedClass>(STORAGE_KEY, [])
    if (loaded.length === 0) {
      const seeded: PreparedClass[] = mockClasses.map((c) => ({
        id: c.id,
        title: c.topic,
        syllabus: c.summary,
        gradeLevel: `Grade ${c.grade}`,
        teacherName: c.teacherName,
        createdAt: new Date().toISOString(),
      }))
      setClasses(seeded)
      saveList(STORAGE_KEY, seeded)
      toast({ title: "Loaded demo classes" })
    } else {
      setClasses(loaded)
    }
  }, [])

  const addClass = () => {
    if (!user || !isTeacher) return
    if (!title.trim() || !syllabus.trim()) return
    const newItem: PreparedClass = {
      id: uid("class"),
      title: title.trim(),
      syllabus: syllabus.trim(),
      gradeLevel,
      teacherName: user.name,
      createdAt: new Date().toISOString(),
    }
    const updated = [newItem, ...classes]
    setClasses(updated)
    saveList(STORAGE_KEY, updated)
    setTitle("")
    setSyllabus("")
    toast({ title: "Class saved", description: `"${newItem.title}" has been added.` })
  }

  const sorted = useMemo(() => [...classes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [classes])

  const generateLesson = async (item: PreparedClass) => {
    setGeneratingId(item.id)
    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        body: JSON.stringify({
          title: item.title,
          syllabus: item.syllabus,
          gradeLevel: item.gradeLevel,
        }),
      })
      const data = await res.json()
      setGenerated((prev) => ({ ...prev, [item.id]: data.lessonText }))
      toast({ title: "Lesson ready", description: "AI generated lesson is available below." })
    } catch {
      // ignore
    } finally {
      setGeneratingId(null)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Prepared Classes</h1>
        <p className="text-sm text-muted-foreground">
          Teachers upload prepared classes; students can view and generate AI lessons at grade level.
        </p>
      </header>

      {isTeacher && user && (
        <Card>
          <CardHeader>
            <CardTitle>Create Prepared Class</CardTitle>
            <CardDescription>Provide a concise syllabus outline.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fractions: Adding and Subtracting"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade Level</Label>
              <select
                id="grade"
                className="border rounded px-2 py-1 w-fit"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="syllabus">Syllabus / Topics</Label>
              <Textarea
                id="syllabus"
                rows={6}
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Key outcomes, topics, examples..."
              />
            </div>
            <Button onClick={addClass}>Save</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Prepared Classes</CardTitle>
          <CardDescription>Latest first</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No prepared classes yet.</div>
          ) : (
            sorted.map((item) => (
              <div key={item.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 mr-2">
                      {item.gradeLevel}
                    </span>
                    by {item.teacherName}
                  </div>
                </div>
                <p className="text-sm mt-2 whitespace-pre-wrap">{item.syllabus}</p>
                <div className="mt-2">
                  <Button size="sm" onClick={() => generateLesson(item)} disabled={generatingId === item.id}>
                    {generatingId === item.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Spinner className="h-4 w-4" /> Generating
                      </span>
                    ) : (
                      "Generate AI Lesson"
                    )}
                  </Button>
                </div>
                {generated[item.id] && (
                  <div className="mt-3 rounded bg-secondary p-3 text-sm whitespace-pre-wrap">{generated[item.id]}</div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
