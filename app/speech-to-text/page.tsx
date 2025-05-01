"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mic, Upload, Download, Copy, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

// Define a type for the Web Speech API's SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: any) => void
  onresult: (event: any) => void
  onend: () => void
}

// Define a constructor for SpeechRecognition
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

export default function SpeechToTextPage() {
  const { isAuthenticated } = useAuth()
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [language, setLanguage] = useState("en-US")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Your browser doesn't support speech recognition. Try using Chrome or Edge.")
      return
    }

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const initializeSpeechRecognition = () => {
    // Get the appropriate speech recognition constructor
    const SpeechRecognition =
      (window as any).SpeechRecognition || ((window as any).webkitSpeechRecognition as SpeechRecognitionConstructor)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language

      let finalTranscript = ""

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        setTranscript(finalTranscript + " " + interimTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        setError(`Error occurred in recognition: ${event.error}`)
        setRecording(false)
      }

      recognitionRef.current.onend = () => {
        setRecording(false)
      }
    }
  }

  // Handle starting recording
  const handleStartRecording = () => {
    setRecording(true)
    setTranscript("")
    setError(null)

    try {
      initializeSpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.lang = language
        recognitionRef.current.start()
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone.",
        })
      }
    } catch (err) {
      setError("Failed to start speech recognition. Please check your microphone permissions.")
      setRecording(false)
    }
  }

  // Handle stopping recording
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setRecording(false)
    toast({
      title: "Recording stopped",
      description: "Your speech has been transcribed.",
    })
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const allowedTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg", "video/mp4"]

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Only audio files (MP3, WAV, OGG) and MP4 video files are allowed")
      }
    }
  }

  // Handle file transcription
  const handleUploadTranscribe = () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setTranscribing(true)
    setTranscript(null)
    setError(null)

    // In a real app, you would send the file to a server for processing
    // For this demo, we'll simulate the transcription
    setTimeout(() => {
      setTranscribing(false)
      setTranscript(
        "This is a simulated transcript of your uploaded audio file. In a real application, this would contain the actual transcribed text from your audio. The system would process the file and extract the spoken content using advanced speech recognition algorithms.",
      )
      toast({
        title: "Transcription complete",
        description: "Your audio file has been transcribed.",
      })
    }, 3000)
  }

  // Copy transcript to clipboard
  const copyToClipboard = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
      toast({
        title: "Copied to clipboard",
        description: "The transcript has been copied to your clipboard.",
      })
    }
  }

  // Download transcript as a text file
  const downloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "transcript.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Download started",
        description: "Your transcript is being downloaded.",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Speech to Text is a premium feature. Please login to access this tool.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Speech to Text</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Convert spoken words to written text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Speech to Text converter helps you transcribe spoken content:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Record your voice directly through your microphone</li>
            <li>Upload audio files (MP3, WAV, OGG) or video files (MP4)</li>
            <li>Support for multiple languages and accents</li>
            <li>Download or copy the transcribed text</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Choose between recording your voice or uploading a file</li>
            <li>Select your preferred language</li>
            <li>Start recording or upload your audio file</li>
            <li>Wait for the transcription to complete</li>
            <li>Copy or download the transcribed text</li>
          </ol>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="record">Record Audio</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>

        {/* Record Audio Tab */}
        <TabsContent value="record">
          <Card>
            <CardHeader>
              <CardTitle>Record Your Voice</CardTitle>
              <CardDescription>Speak clearly into your microphone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <div className="text-center">
                    {recording ? (
                      <div className="space-y-4">
                        <div className="relative inline-flex">
                          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                          <div className="relative rounded-full bg-red-600 p-8">
                            <Mic className="h-12 w-12 text-white" />
                          </div>
                        </div>
                        <p className="text-sm font-medium">Recording... Speak now</p>
                        <Button variant="outline" onClick={handleStopRecording}>
                          Stop Recording
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 h-20 w-20 rounded-full"
                        onClick={handleStartRecording}
                        disabled={transcribing}
                      >
                        {transcribing ? (
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        ) : (
                          <Mic className="h-8 w-8 text-white" />
                        )}
                      </Button>
                    )}
                    {!recording && !transcribing && (
                      <p className="mt-2 text-sm text-muted-foreground">Click to start recording</p>
                    )}
                    {transcribing && <p className="mt-2 text-sm font-medium">Transcribing your speech...</p>}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {transcript && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Transcript</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadTranscript}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">{transcript}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload File Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Audio File</CardTitle>
              <CardDescription>Upload an audio or video file for transcription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload File</label>
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,video/mp4"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                    <p className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG audio files or MP4 video files</p>
                  </div>
                </div>

                <Button
                  onClick={handleUploadTranscribe}
                  disabled={transcribing || !file}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {transcribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe File"
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {transcript && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Transcript</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadTranscript}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">{transcript}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

