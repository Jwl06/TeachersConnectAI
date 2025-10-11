"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCurrentUser } from "@/components/auth/user-context"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Languages, BookOpen, User, Calendar, Copy, CheckCircle, AlertCircle, Upload, FileText } from "lucide-react"

type Note = {
  id: string
  title: string
  content: string
  language: string
  teacherName: string
  createdAt: string
}

const SUPPORTED_LANGUAGES = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Hindi", code: "hi", flag: "🇮🇳" },
  { name: "Bengali", code: "bn", flag: "🇧🇩" },
  { name: "Marathi", code: "mr", flag: "🇮🇳" },
  { name: "Telugu", code: "te", flag: "🇮🇳" },
  { name: "Tamil", code: "ta", flag: "🇮🇳" },
  { name: "Gujarati", code: "gu", flag: "🇮🇳" },
  { name: "Kannada", code: "kn", flag: "🇮🇳" },
  { name: "Malayalam", code: "ml", flag: "🇮🇳" },
  { name: "Odia", code: "or", flag: "🇮🇳" },
  { name: "Punjabi", code: "pa", flag: "🇮🇳" },
  { name: "Urdu", code: "ur", flag: "🇵🇰" },
  { name: "Spanish", code: "es", flag: "🇪🇸" },
  { name: "French", code: "fr", flag: "🇫🇷" },
  { name: "German", code: "de", flag: "🇩🇪" },
  { name: "Chinese", code: "zh", flag: "🇨🇳" },
  { name: "Japanese", code: "ja", flag: "🇯🇵" },
  { name: "Korean", code: "ko", flag: "🇰🇷" },
  { name: "Arabic", code: "ar", flag: "🇸🇦" },
  { name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { name: "Russian", code: "ru", flag: "🇷🇺" }
]

// Demo notes for testing
const DEMO_NOTES: Note[] = [
  {
    id: "1",
    title: "Introduction to Fractions",
    content: "A fraction represents a part of a whole. It consists of two numbers: the numerator (top) and the denominator (bottom). For example, 1/2 means one part out of two equal parts.",
    language: "English",
    teacherName: "Ms. Sarah Johnson",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Water Cycle Basics",
    content: "The water cycle is the continuous movement of water through Earth's atmosphere, land, and oceans. It includes evaporation, condensation, precipitation, and collection.",
    language: "English",
    teacherName: "Mr. David Chen",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Basic Grammar Rules",
    content: "Every sentence needs a subject and a verb. Capitalize the first letter of sentences and proper nouns. Use periods, question marks, and exclamation points to end sentences.",
    language: "English", 
    teacherName: "Ms. Maria Rodriguez",
    createdAt: new Date().toISOString()
  }
]

export default function NotesPage() {
  const { user, isTeacher } = useCurrentUser()
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES)
  
  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("English")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Translation state
  const [translateTo, setTranslateTo] = useState("Hindi")
  const [translatingNotes, setTranslatingNotes] = useState<Set<string>>(new Set())
  const [translationResults, setTranslationResults] = useState<Record<string, any>>({})
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileTitle, setFileTitle] = useState("")
  const [fileSourceLanguage, setFileSourceLanguage] = useState("English")
  const [fileTargetLanguage, setFileTargetLanguage] = useState("Hindi")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      language,
      teacherName: user?.name || "Demo Teacher",
      createdAt: new Date().toISOString()
    }
    
    setNotes([newNote, ...notes])
    setTitle("")
    setContent("")
    
    toast({
      title: "Note Published",
      description: `"${newNote.title}" is now available to all users.`
    })
    
    setIsSubmitting(false)
  }

  const translateNote = async (note: Note) => {
    if (translatingNotes.has(note.id)) return

    setTranslatingNotes(prev => new Set(prev).add(note.id))
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: note.content,
          targetLanguage: translateTo,
          noteId: note.id,
          sourceLanguage: note.language
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setTranslationResults(prev => ({
          ...prev,
          [`${note.id}-${translateTo}`]: data
        }))
        
        toast({
          title: "Translation Complete",
          description: `Note translated to ${translateTo}${data.demo ? ' (demo mode)' : ''}.`
        })
      } else {
        throw new Error(data.error || 'Translation failed')
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast({
        title: "Translation Failed",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setTranslatingNotes(prev => {
        const newSet = new Set(prev)
        newSet.delete(note.id)
        return newSet
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Text copied to clipboard."
      })
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!fileTitle) {
        setFileTitle(file.name.replace(/\.[^/.]+$/, "")) // Remove extension
      }
    }
  }

  const uploadAndTranslateFile = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      })
      return
    }

    if (!fileTitle.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for the translated note.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('targetLanguage', fileTargetLanguage)
      formData.append('sourceLanguage', fileSourceLanguage)
      formData.append('title', fileTitle)

      const response = await fetch('/api/translate-file', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        // Create a new note object for the translated content
        const newNote: Note = {
          id: data.noteId || Date.now().toString(),
          title: fileTitle,
          content: data.translatedText,
          language: fileTargetLanguage,
          teacherName: "File Upload Translation",
          createdAt: new Date().toISOString()
        }
        
        setNotes([newNote, ...notes])
        
        // Reset form
        setSelectedFile(null)
        setFileTitle("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        
        toast({
          title: "File Translated Successfully",
          description: `"${fileTitle}" has been translated to ${fileTargetLanguage} and added to notes.`
        })
      } else {
        throw new Error(data.error || 'File translation failed')
      }
    } catch (error) {
      console.error('File upload error:', error)
      toast({
        title: "Translation Failed",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getLanguageFlag = (langName: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.name === langName)
    return lang?.flag || "🌐"
  }

  return (
    <main className="mx-auto max-w-6xl p-6 flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-balance flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8" />
          Shared Educational Notes
        </h1>
        <p className="text-muted-foreground mt-2">
          Teachers upload notes; everyone can access and translate them using Google Translate
        </p>
      </header>

      {isTeacher && user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Upload New Note
            </CardTitle>
            <CardDescription>
              Share educational content with automatic translation support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Note Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Fractions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Note Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Enter the educational content..."
              />
            </div>

            <Button 
              onClick={createNote} 
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Publish Note
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* File Upload and Translation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload & Translate File
          </CardTitle>
            <CardDescription>
              Upload a text file and automatically translate it to another language using Google Translate
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Currently supports .txt files. PDF and Word document support coming soon.
            </p>
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file-title">Note Title</Label>
                  <Input
                    id="file-title"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    placeholder="Enter title for translated note"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-source-lang">Source Language</Label>
                  <Select value={fileSourceLanguage} onValueChange={setFileSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.name} value={lang.name}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-target-lang">Target Language</Label>
                  <Select value={fileTargetLanguage} onValueChange={setFileTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.name} value={lang.name}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={uploadAndTranslateFile} 
                disabled={isUploading || !fileTitle.trim()}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Translating File...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Translate File
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              All Notes
            </CardTitle>
            <CardDescription>
              Translate notes into different languages using Google Translate
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Translate to:</span>
            <Select value={translateTo} onValueChange={setTranslateTo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.name} value={lang.name}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes available yet</p>
              <p className="text-sm">Be the first to share educational content!</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getLanguageFlag(note.language)} {note.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {note.teacherName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Original Content ({note.language})
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(note.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                  </div>

                  {/* Translation Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <span className="text-sm font-medium">Translations</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => translateNote(note)}
                        disabled={translatingNotes.has(note.id)}
                        className="flex items-center gap-2"
                      >
                        {translatingNotes.has(note.id) ? (
                          <>
                            <Spinner className="h-3 w-3" />
                            Translating...
                          </>
                        ) : (
                          <>
                            <Languages className="h-3 w-3" />
                            Translate to {translateTo}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Show translation results */}
                    {translationResults[`${note.id}-${translateTo}`] && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {getLanguageFlag(translateTo)} {translateTo} Translation
                              </span>
                              {translationResults[`${note.id}-${translateTo}`].demo && (
                                <Badge variant="secondary" className="text-xs">
                                  Demo Mode
                                </Badge>
                              )}
                            </div>
                            <div className="bg-background rounded p-3 text-sm whitespace-pre-wrap">
                              {translationResults[`${note.id}-${translateTo}`].translatedText}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                Detected: {translationResults[`${note.id}-${translateTo}`].detectedLanguageName}
                              </span>
                              <span>•</span>
                              <span>
                                Confidence: {Math.round(translationResults[`${note.id}-${translateTo}`].confidence * 100)}%
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(translationResults[`${note.id}-${translateTo}`].translatedText)}
                              className="mt-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Translation
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}