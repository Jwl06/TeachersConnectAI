"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCurrentUser } from "@/components/auth/user-context"
import { useToast } from "@/components/ui/use-toast"
import { Video, Play, Download, Clock, BookOpen, Sparkles } from "lucide-react"

type VideoRequest = {
  id: string
  title: string
  description: string
  topic: string
  gradeLevel: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  videoUrl?: string
  thumbnailUrl?: string
  createdAt: string
  teacher?: {
    name: string
    location: string
  }
}

const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
]

const POPULAR_TOPICS = [
  "Mathematics - Fractions",
  "Science - Water Cycle",
  "English - Grammar",
  "History - Ancient Civilizations",
  "Geography - Continents",
  "Biology - Photosynthesis",
  "Physics - Simple Machines",
  "Chemistry - Elements",
  "Literature - Poetry",
  "Art - Drawing Techniques"
]

export default function VideoGenerationPage() {
  const { user, isTeacher } = useCurrentUser()
  const { toast } = useToast()
  const [videos, setVideos] = useState<VideoRequest[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("Grade 6")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const generateVideo = async () => {
    if (!title.trim() || !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and topic.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          topic,
          gradeLevel,
          description,
          userId: user?.id
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Video Generation Started",
          description: "Your AI video is being created. This may take a few minutes."
        })
        
        // Add the new video to the list
        const newVideo: VideoRequest = {
          id: data.videoId,
          title,
          description: description || `Educational video about ${topic} for ${gradeLevel}`,
          topic,
          gradeLevel,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          teacher: user ? { name: user.name, location: user.location } : undefined
        }
        setVideos([newVideo, ...videos])
        
        // Reset form
        setTitle("")
        setTopic("")
        setDescription("")
      } else {
        throw new Error(data.error || 'Failed to generate video')
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6 flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-balance flex items-center justify-center gap-2">
          <Video className="h-8 w-8" />
          AI Video Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Create educational videos automatically using AI based on topics and grade levels
        </p>
      </header>

      {isTeacher && user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate New Video
            </CardTitle>
            <CardDescription>
              Create an AI-generated educational video for your students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Understanding Fractions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <div className="space-y-2">
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Basic Fractions, Water Cycle, Grammar Rules"
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Popular topics:</span>
                  {POPULAR_TOPICS.slice(0, 5).map((popularTopic) => (
                    <Button
                      key={popularTopic}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopic(popularTopic)}
                      className="text-xs"
                    >
                      {popularTopic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Context (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any specific requirements, examples, or context for the video..."
                rows={3}
              />
            </div>

            <Button 
              onClick={generateVideo} 
              disabled={isGenerating || !title.trim() || !topic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Generate AI Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Generated Videos
          </CardTitle>
          <CardDescription>
            All AI-generated educational videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos generated yet</p>
              <p className="text-sm">Create your first AI video above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                      <Badge className={getStatusColor(video.status)}>
                        {video.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{video.gradeLevel}</Badge>
                      <span>•</span>
                      <span>{video.topic}</span>
                    </div>
                    
                    {video.teacher && (
                      <div className="text-sm text-muted-foreground">
                        by {video.teacher.name} ({video.teacher.location})
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>

                    {video.status === 'COMPLETED' && video.videoUrl ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : video.status === 'PROCESSING' ? (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    ) : video.status === 'FAILED' ? (
                      <div className="text-sm text-red-600">
                        Generation failed. Please try again.
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-600">
                        Queued for generation...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
