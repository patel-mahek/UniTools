"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Play, Pause, Download, Loader2, Volume2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface Voice {
  id: string
  name: string
  lang: string
}

export default function TextToSpeechPage() {
  const { isAuthenticated } = useAuth()
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("")
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [speed, setSpeed] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [generating, setGenerating] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Initialize speech synthesis and get available voices
  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis

      // Function to load and set voices
      const loadVoices = () => {
        const synth = speechSynthesisRef.current
        if (synth) {
          const voices = synth.getVoices()
          if (voices.length > 0) {
            const voiceList = voices.map((v) => ({
              id: v.voiceURI,
              name: `${v.name} (${v.lang})`,
              lang: v.lang,
            }))
            setAvailableVoices(voiceList)

            // Set default voice
            if (!voice && voiceList.length > 0) {
              // Try to find an English voice
              const englishVoice = voiceList.find((v) => v.lang.startsWith("en-"))
              setVoice(englishVoice ? englishVoice.id : voiceList[0].id)
            }
          }
        }
      }

      // Load voices
      loadVoices()

      // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
      if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
        speechSynthesisRef.current.onvoiceschanged = loadVoices
      }
    } else {
      setError("Your browser doesn't support speech synthesis. Try using Chrome or Edge.")
    }

    // Initialize AudioContext for recording
    if (typeof window !== "undefined" && "AudioContext" in window) {
      audioContextRef.current = new AudioContext()
    }

    // Clean up on unmount
    return () => {
      if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel()
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert to speech")
      return
    }

    setGenerating(true)
    setError(null)
    setAudioBlob(null)
    setAudioUrl(null)

    try {
      if (speechSynthesisRef.current) {
        // Cancel any ongoing speech
        speechSynthesisRef.current.cancel()

        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(text)
        utteranceRef.current = utterance

        // Set voice
        if (voice) {
          const voices = speechSynthesisRef.current.getVoices()
          const selectedVoice = voices.find((v) => v.voiceURI === voice)
          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
        }

        // Set rate and pitch
        utterance.rate = speed[0]
        utterance.pitch = pitch[0]

        // Set up audio recording for download
        await setupAudioRecording()

        // Set event handlers
        utterance.onend = () => {
          setPlaying(false)
          stopRecording()
        }

        utterance.onerror = (event) => {
          setError(`Error occurred during speech synthesis: ${event.error}`)
          setPlaying(false)
          stopRecording()
        }

        // Start recording and speak
        startRecording()
        speechSynthesisRef.current.speak(utterance)

        // Store the utterance for later playback
        setAudioUrl("generated") // Just a marker that we have generated speech
        setGenerating(false)

        toast({
          title: "Speech generated",
          description: "Your text has been converted to speech. Click play to listen.",
        })
      } else {
        throw new Error("Speech synthesis not available")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setGenerating(false)
    }
  }

  const setupAudioRecording = async () => {
    try {
      // Create an audio destination node
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      // Create a MediaStream destination
      const destination = audioContextRef.current.createMediaStreamDestination()

      // Create a MediaRecorder
      const mediaRecorder = new MediaRecorder(destination.stream)
      mediaRecorderRef.current = mediaRecorder

      // Clear previous chunks
      audioChunksRef.current = []

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        // Create a URL for the blob
        const url = URL.createObjectURL(audioBlob)
        if (audioRef.current) {
          audioRef.current.src = url
        }
      }

      return destination
    } catch (err) {
      console.error("Error setting up audio recording:", err)
      throw new Error("Failed to set up audio recording")
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      mediaRecorderRef.current.start()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  const togglePlayPause = () => {
    if (!speechSynthesisRef.current) {
      setError("Speech synthesis not available")
      return
    }

    if (playing) {
      // Pause speech
      speechSynthesisRef.current.pause()
      setPlaying(false)
    } else {
      // If we have a recorded audio blob, play that instead
      if (audioBlob && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch((err) => {
            console.error("Error playing audio:", err)
            setError("Failed to play audio")
          })
        return
      }

      // If we're not already speaking, start from the beginning
      if (!speechSynthesisRef.current.speaking) {
        if (utteranceRef.current) {
          speechSynthesisRef.current.speak(utteranceRef.current)
        } else if (text.trim()) {
          // If somehow we don't have an utterance but we have text, create a new one
          const utterance = new SpeechSynthesisUtterance(text)
          utteranceRef.current = utterance

          // Set voice, rate, and pitch
          if (voice) {
            const voices = speechSynthesisRef.current.getVoices()
            const selectedVoice = voices.find((v) => v.voiceURI === voice)
            if (selectedVoice) {
              utterance.voice = selectedVoice
            }
          }

          utterance.rate = speed[0]
          utterance.pitch = pitch[0]

          utterance.onend = () => {
            setPlaying(false)
          }

          speechSynthesisRef.current.speak(utterance)
        }
      } else {
        // Resume speech
        speechSynthesisRef.current.resume()
      }

      setPlaying(true)
    }
  }

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "speech.wav"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: "Your audio file is being downloaded.",
      })
    } else {
      toast({
        title: "No audio available",
        description: "Please generate speech first before downloading.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Text to Speech is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Text to Speech</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Convert text to natural-sounding speech</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Text to Speech converter helps you transform written content into spoken words:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Convert any text to high-quality, natural-sounding speech</li>
            <li>Choose from multiple voices and languages</li>
            <li>Adjust speech rate and pitch to your preference</li>
            <li>Download the generated audio for offline use</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Enter or paste the text you want to convert</li>
            <li>Select your preferred voice and language</li>
            <li>Adjust the speech rate and pitch if needed</li>
            <li>Click "Generate Speech" to create the audio</li>
            <li>Play the audio or download it for later use</li>
          </ol>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
            <CardDescription>Enter the text you want to convert to speech</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text</Label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter or paste your text here..."
                  className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground text-right">{text.length} characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="speed">Speech Rate</Label>
                    <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                  </div>
                  <Slider id="speed" min={0.5} max={2} step={0.1} value={speed} onValueChange={setSpeed} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="pitch">Pitch</Label>
                    <span className="text-sm text-muted-foreground">{pitch[0]}x</span>
                  </div>
                  <Slider id="pitch" min={0.5} max={2} step={0.1} value={pitch} onValueChange={setPitch} />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !text.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Speech"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audio Output</CardTitle>
            <CardDescription>Listen to and download the generated speech</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {audioUrl ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8 border rounded-md">
                  <div className="mb-4">
                    <Button
                      onClick={togglePlayPause}
                      className="h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{playing ? "Playing audio..." : "Click to play"}</p>

                  {/* Audio element for playback */}
                  <audio
                    ref={audioRef}
                    onEnded={() => setPlaying(false)}
                    onPause={() => setPlaying(false)}
                    onPlay={() => setPlaying(true)}
                    className="hidden"
                  />
                </div>

                <Button onClick={downloadAudio} className="w-full" disabled={!audioBlob}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Audio
                </Button>

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Voice Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Voice:</div>
                    <div>{availableVoices.find((v) => v.id === voice)?.name || "Default"}</div>
                    <div>Speed:</div>
                    <div>{speed[0]}x</div>
                    <div>Pitch:</div>
                    <div>{pitch[0]}x</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                <Volume2 className="h-16 w-16 mb-4 opacity-20" />
                <p>Your audio will appear here</p>
                <p className="text-sm mt-2">Enter text and click Generate Speech</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

