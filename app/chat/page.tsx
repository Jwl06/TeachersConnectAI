"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRef, useState } from "react"
import { useCurrentUser } from "@/components/auth/user-context"
import { MessageCircle, HelpCircle, BookOpen, Users } from "lucide-react"

export default function ChatPage() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const { user } = useCurrentUser()
  const [isQAMode, setIsQAMode] = useState(false)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: "/api/chat",
      body: {
        userId: user?.id,
        isQAMode
      }
    }),
  })

  const quickQuestions = [
    "Explain fractions for Grade 6 with an example.",
    "Give 5 practice questions on the water cycle.",
    "Summarize photosynthesis in simple words.",
    "How do I teach multiplication to Grade 3 students?",
    "What are the key concepts in basic algebra?",
    "Explain the solar system for Grade 4 students."
  ]

  const qaQuestions = [
    "Create a quiz about the water cycle for Grade 5",
    "Generate 10 multiple choice questions about fractions",
    "Make a Q&A session about photosynthesis",
    "Design a test about basic geometry for Grade 6",
    "Create practice problems for solving equations",
    "Generate assessment questions about the human body"
  ]

  const handleQuickQuestion = (question: string) => {
    sendMessage({ text: question })
  }

  return (
    <main className="mx-auto max-w-4xl p-6 flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-balance">AI Educational Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get help with teaching, learning, and educational content creation
        </p>
      </header>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            General Chat
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Q&A Generator
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Doubt Solver
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="min-h-[400px] rounded border p-4 bg-muted/20">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ask a question to get started with AI assistance</p>
                    <p className="text-sm mt-2">Perfect for explaining concepts, creating examples, and getting teaching tips</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          m.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-background border'
                        }`}>
                          <div className="text-xs text-muted-foreground mb-1">
                            {m.role === 'user' ? 'You' : 'AI Assistant'}
                          </div>
                          <div className="whitespace-pre-wrap">
                            {m.parts.map((p, i) => (p.type === "text" ? <div key={i}>{p.text}</div> : null))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {status === "in_progress" && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-4">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    AI is thinking...
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Quick Questions</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q) => (
                      <Button
                        key={q}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickQuestion(q)}
                        disabled={status === "in_progress"}
                        className="text-left h-auto p-2"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>

                <form
                  ref={formRef}
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const text = String(fd.get("message") || "")
                    if (!text.trim()) return
                    sendMessage({ text })
                    formRef.current?.reset()
                  }}
                >
                  <Input 
                    name="message" 
                    placeholder="Ask any educational question..." 
                    disabled={status === "in_progress"}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={status === "in_progress"}>
                    {status === "in_progress" ? "Sending..." : "Send"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Q&A Generator
                <Badge variant="secondary">Enhanced Mode</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="min-h-[400px] rounded border p-4 bg-muted/20">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generate quizzes, tests, and Q&A sessions</p>
                    <p className="text-sm mt-2">Perfect for creating assessments and practice materials</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          m.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-background border'
                        }`}>
                          <div className="text-xs text-muted-foreground mb-1">
                            {m.role === 'user' ? 'You' : 'Q&A Generator'}
                          </div>
                          <div className="whitespace-pre-wrap">
                            {m.parts.map((p, i) => (p.type === "text" ? <div key={i}>{p.text}</div> : null))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {status === "in_progress" && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-4">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Generating Q&A...
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Q&A Templates</h4>
                  <div className="flex flex-wrap gap-2">
                    {qaQuestions.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsQAMode(true)
                          handleQuickQuestion(q)
                        }}
                        disabled={status === "in_progress"}
                        className="text-left h-auto p-2"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>

                <form
                  ref={formRef}
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const text = String(fd.get("message") || "")
                    if (!text.trim()) return
                    setIsQAMode(true)
                    sendMessage({ text })
                    formRef.current?.reset()
                  }}
                >
                  <Input 
                    name="message" 
                    placeholder="Create quizzes, tests, or Q&A sessions..." 
                    disabled={status === "in_progress"}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={status === "in_progress"}>
                    {status === "in_progress" ? "Generating..." : "Generate"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Access lesson plans, teaching strategies, and educational materials.
                </p>
                <Button variant="outline" className="w-full">
                  Browse Resources
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Connect with other teachers and share experiences.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
