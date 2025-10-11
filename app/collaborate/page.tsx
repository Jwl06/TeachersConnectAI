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
import { mockThreads } from "@/lib/mock"

type Thread = {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: string
  comments: { id: string; author: string; text: string; createdAt: string }[]
}

const STORAGE_KEY = "ru-connect.collab.threads"

export default function CollaboratePage() {
  const { user } = useCurrentUser()
  const { toast } = useToast()
  const [threads, setThreads] = useState<Thread[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const loaded = loadList<Thread>(STORAGE_KEY, [])
    if (loaded.length === 0) {
      const seeded: Thread[] = mockThreads.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        createdBy: t.createdBy,
        createdAt: new Date().toISOString(),
        comments: t.comments.map((c) => ({
          id: c.id,
          author: c.author,
          text: c.text,
          createdAt: new Date().toISOString(),
        })),
      }))
      setThreads(seeded)
      saveList(STORAGE_KEY, seeded)
      toast({ title: "Loaded demo threads" })
    } else {
      setThreads(loaded)
    }
  }, [])

  const addThread = () => {
    if (!user) return
    if (!title.trim() || !description.trim()) return
    const t: Thread = {
      id: uid("thr"),
      title: title.trim(),
      description: description.trim(),
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      comments: [],
    }
    const updated = [t, ...threads]
    setThreads(updated)
    saveList(STORAGE_KEY, updated)
    setTitle("")
    setDescription("")
    toast({ title: "Thread posted", description: "Your discussion is live." })
  }

  const addComment = (id: string, text: string) => {
    if (!user || !text.trim()) return
    const updated = threads.map((t) =>
      t.id === id
        ? {
            ...t,
            comments: [
              ...t.comments,
              { id: uid("c"), author: user.name, text: text.trim(), createdAt: new Date().toISOString() },
            ],
          }
        : t,
    )
    setThreads(updated)
    saveList(STORAGE_KEY, updated)
    toast({ title: "Comment added" })
  }

  const sorted = useMemo(() => [...threads].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [threads])

  return (
    <main className="mx-auto max-w-5xl p-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Collaboration Board</h1>
        <p className="text-sm text-muted-foreground">Plan lessons, share strategies, and coordinate support.</p>
      </header>

      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Start a Discussion</CardTitle>
            <CardDescription>Teachers from rural and urban can collaborate here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="t">Title</Label>
              <Input
                id="t"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grade 6 Fractions joint plan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="d">Description</Label>
              <Textarea
                id="d"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Goals, resources, outline..."
              />
            </div>
            <Button onClick={addThread}>Post</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to create or comment.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>Latest first</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No threads yet.</div>
          ) : (
            sorted.map((t) => <ThreadItem key={t.id} t={t} onAddComment={addComment} />)
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function ThreadItem({ t, onAddComment }: { t: Thread; onAddComment: (id: string, text: string) => void }) {
  const { user } = useCurrentUser()
  const [text, setText] = useState("")

  return (
    <div className="rounded border p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{t.title}</div>
        <div className="text-xs text-muted-foreground">by {t.createdBy}</div>
      </div>
      <p className="text-sm mt-2 whitespace-pre-wrap">{t.description}</p>
      <div className="mt-3 space-y-2">
        {t.comments.map((c) => (
          <div key={c.id} className="rounded bg-secondary p-2">
            <div className="text-xs text-muted-foreground">{c.author}</div>
            <div className="text-sm whitespace-pre-wrap">{c.text}</div>
          </div>
        ))}
      </div>
      {user && (
        <div className="mt-3 flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." />
          <Button
            size="sm"
            onClick={() => {
              onAddComment(t.id, text)
              setText("")
            }}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  )
}
