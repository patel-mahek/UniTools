"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Calculator } from "lucide-react"
import Link from "next/link"

interface MoodResponse {
  uuid: string
  number: number
  mood_color: string
  vibe: string
  lore: string
}

export default function MoodGeneratorPage() {
  const [emoji, setEmoji] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MoodResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/generate-number/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood_emoji: emoji }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-md">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Random Number Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Generate random numbers with customizable parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Random Number Generator helps you create random values for various purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generate unique IDs and identifiers</li>
            <li>Create test data for development and QA</li>
            <li>Get random color values for design projects</li>
            <li>Produce random text descriptions for creative work</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Enter an emoji as a seed value (this affects the randomization)</li>
            <li>Click "Generate" to create a random number and associated values</li>
            <li>View the results including UUID, number, color, and descriptive text</li>
          </ol>
          <p className="mt-4">
            This free version allows basic random number generation. Upgrade to premium for advanced distribution
            options, batch generation, and API access.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Random Number</CardTitle>
          <CardDescription>Enter an emoji to seed the random generator</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emoji">What's your mood today?</Label>
              <Input
                id="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="Enter an emoji (e.g. 😊)"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Generate Random Number
                </>
              )}
            </Button>
          </form>

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

          {result && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-lg">Generated Values</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">UUID:</div>
                <div className="text-sm truncate">{result.uuid}</div>

                <div className="text-sm font-medium">Number:</div>
                <div className="text-sm">{result.number}</div>

                <div className="text-sm font-medium">Color:</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: result.mood_color }} />
                  <span className="text-sm">{result.mood_color}</span>
                </div>

                <div className="text-sm font-medium">Category:</div>
                <div className="text-sm">{result.vibe}</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Description:</div>
                <p className="text-sm bg-muted p-3 rounded-md">{result.lore}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
