"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Download, Copy, Check, RefreshCw, Code, FileCode, Share } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function CodePreviewPage() {
  const { isAuthenticated } = useAuth()
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a simple HTML page.</p>
  <button id="myButton">Click Me</button>
</body>
</html>`)
  const [cssCode, setCssCode] = useState(`body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
  text-align: center;
}

p {
  color: #666;
  line-height: 1.5;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #45a049;
}`)
  const [jsCode, setJsCode] = useState(`document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('myButton');
  
  button.addEventListener('click', function() {
    alert('Button was clicked!');
    this.textContent = 'Clicked!';
    this.style.backgroundColor = '#2196F3';
  });
});`)
  const [previewSrc, setPreviewSrc] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [theme, setTheme] = useState("light")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [previewMode, setPreviewMode] = useState("desktop")

  // Generate preview when component mounts
  useEffect(() => {
    generatePreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh preview when code changes and auto-refresh is enabled
  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(() => {
        generatePreview()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [htmlCode, cssCode, jsCode, autoRefresh])

  // Generate preview
  const generatePreview = () => {
    setIsGenerating(true)

    try {
      // Combine HTML, CSS, and JS into a single HTML document
      const combinedCode = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, "")}
          <script>${jsCode}</script>
        </body>
        </html>
      `

      // Create a blob URL for the iframe
      const blob = new Blob([combinedCode], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Update the iframe source
      setPreviewSrc(url)

      // Clean up the previous blob URL
      return () => URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: "Preview Error",
        description: "There was an error generating the preview.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy code to clipboard
  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopied(type)

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "Copied!",
      description: `${type.toUpperCase()} code copied to clipboard.`,
    })
  }

  // Download code as HTML file
  const downloadCode = () => {
    // Combine HTML, CSS, and JS into a single HTML document
    const combinedCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, "")}
        <script>${jsCode}</script>
      </body>
      </html>
    `

    const blob = new Blob([combinedCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "preview.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Code has been downloaded as HTML file.",
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">HTML/CSS/JS Preview is a premium feature. Please login to access this tool.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">HTML/CSS/JS Preview</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Preview HTML, CSS, and JavaScript code in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The HTML/CSS/JS Preview tool helps you test and debug front-end code:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Write HTML, CSS, and JavaScript code in separate editors</li>
            <li>See real-time preview of your code</li>
            <li>Test responsive designs with different viewport sizes</li>
            <li>Download your code as an HTML file</li>
            <li>Share your code with others</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Code Editors */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Code Editor</CardTitle>
                <div className="flex space-x-2">
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={autoRefresh ? "bg-green-50" : ""}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "text-green-600" : ""}`} />
                    {autoRefresh ? "Auto" : "Manual"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your HTML code here..."
                      className="font-mono h-[400px] resize-none"
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(htmlCode, "html")}
                    >
                      {copied === "html" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="css" className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your CSS code here..."
                      className="font-mono h-[400px] resize-none"
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(cssCode, "css")}
                    >
                      {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="js" className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your JavaScript code here..."
                      className="font-mono h-[400px] resize-none"
                      value={jsCode}
                      onChange={(e) => setJsCode(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(jsCode, "js")}
                    >
                      {copied === "js" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {!autoRefresh && (
                <Button onClick={generatePreview} className="w-full mt-4" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Preview...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Generate Preview
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Preview</CardTitle>
                <div className="flex space-x-2">
                  <Select value={previewMode} onValueChange={setPreviewMode}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={downloadCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`border rounded-md overflow-hidden bg-white ${
                  previewMode === "desktop"
                    ? "w-full"
                    : previewMode === "tablet"
                      ? "w-[768px] mx-auto"
                      : "w-[375px] mx-auto"
                }`}
              >
                <div className="bg-gray-100 border-b px-4 py-2 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto bg-white rounded-md px-4 py-1 text-xs text-gray-500 flex items-center">
                    <FileCode className="h-3 w-3 mr-1" />
                    preview.html
                  </div>
                </div>
                <div
                  className={`${
                    previewMode === "desktop" ? "h-[500px]" : previewMode === "tablet" ? "h-[600px]" : "h-[667px]"
                  }`}
                >
                  {previewSrc ? (
                    <iframe
                      src={previewSrc}
                      title="Code Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Preview will appear here</p>
                        <p className="text-sm mt-2">Click "Generate Preview" to see your code in action</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-lg">Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">HTML Structure</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>No need to include full HTML structure</li>
                      <li>Body content will be automatically inserted</li>
                      <li>Use semantic HTML for better accessibility</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-700 mb-2">JavaScript</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
                      <li>Code runs after the DOM is loaded</li>
                      <li>External libraries not supported</li>
                      <li>Use console in browser dev tools for debugging</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

