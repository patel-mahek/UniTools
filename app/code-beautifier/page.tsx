"use client"

import type React from "react"

import { useState, useRef,useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Upload, Copy, Download, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BeautifierResponse {
  valid: boolean
  message?: string
  beautified_code?: string
  filename?: string
  beautified_filename?: string
}

export default function CodeBeautifierPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BeautifierResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return
  
    const beautifyCode = async () => {
      setLoading(true)
      setError(null)
  
      try {
        const formData = new FormData()
        formData.append("file", file)
  
        const res = await fetch("http://127.0.0.1:8000/beautify-code/", {
          method: "POST",
          body: formData,
        })
  
        if (!res.ok) throw new Error(`Error: ${res.status}`)
  
        const data: BeautifierResponse = await res.json()
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
  
    beautifyCode()
  }, [file]) // 🟡 runs only when file changes
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const allowedExtensions = [".html", ".htm", ".css", ".js", ".py"]
  
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase()
  
      if (allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile)
        setError(null)
        setResult(null) // reset result for new file
      } else {
        setFile(null)
        setResult(null)
        setError("Only .html, .htm, .css, .js, or .py files are allowed")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://127.0.0.1:8000/beautify-code/", {
        method: "POST",
        body: formData,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const downloadBeautifiedCode = () => {
    if (!result?.beautified_code) return

    const blob = new Blob([result.beautified_code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.beautified_filename || `beautified_${file?.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
        <h1 className="text-3xl font-bold">Code Formatter</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Format and beautify your code files</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Code Formatter helps you improve the readability and structure of your code:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Supports HTML, CSS, JavaScript, and Python files</li>
            <li>Validates syntax before formatting</li>
            <li>Formats code with proper indentation and spacing</li>
            <li>Organizes code structure according to best practices</li>
            <li>Allows you to download the beautified code</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Upload your code file (.html, .css, .js, or .py)</li>
            <li>Click "Beautify Code" to process the file</li>
            <li>Review the formatted code</li>
            <li>Copy or download the beautified version</li>
          </ol>
          <p className="mt-4">
            This free version supports individual file formatting. Upgrade to premium for batch processing, custom
            formatting rules, and integration with version control systems.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Code File</CardTitle>
          <CardDescription>Upload a code file (.html, .htm, .css, .js, or .py) to beautify</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code-file">Code File</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  id="code-file"
                  type="file"
                  accept=".html,.htm,.css,.js,.py"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only .html, .htm, .css, .js, or .py files are allowed
                </p>
              </div>
            </div>

            <Button type="submit" disabled={loading || !file} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Beautify Code"
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-6">
              <div>
                <Alert className={result.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                  {result.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle className={result.valid ? "text-green-800" : "text-red-800"}>
                    {result.valid ? "Valid Syntax" : "Invalid Syntax"}
                  </AlertTitle>
                  {result.message && (
                    <AlertDescription className={result.valid ? "text-green-700" : "text-red-700"}>
                      {result.message}
                    </AlertDescription>
                  )}
                </Alert>
              </div>

              {result.valid && result.beautified_code && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Beautified Code</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.beautified_code || "")}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadBeautifiedCode}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono max-h-[400px] overflow-y-auto">
                        {result.beautified_code}
                      </pre>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> The beautified version of your code has been saved as{" "}
                      <span className="font-mono">{result.beautified_filename || `beautified_${file?.name}`}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

