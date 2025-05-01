"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Download, Copy, Check, RefreshCw, Code, FileCode, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function CodeFormatterPage() {
  const { isAuthenticated } = useAuth()
  const [code, setCode] = useState(`function example() {
  const greeting = 'Hello World';
  console.log(greeting);
  
  if(true) {
    let x = 10;
    x += 5;
    return x;
  }
}`)
  const [language, setLanguage] = useState("javascript")
  const [formattedCode, setFormattedCode] = useState("")
  const [isFormatting, setIsFormatting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tabSize, setTabSize] = useState(2)
  const [useTabs, setUseTabs] = useState(false)
  const [printWidth, setPrintWidth] = useState(80)
  const [semiColons, setSemiColons] = useState(true)
  const [singleQuotes, setSingleQuotes] = useState(true)
  const [trailingCommas, setTrailingCommas] = useState("es5")
  const [bracketSpacing, setBracketSpacing] = useState(true)
  const [arrowParens, setArrowParens] = useState("always")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Format code
  const formatCode = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some code to format.",
        variant: "destructive",
      })
      return
    }

    setIsFormatting(true)

    // Simulate formatting process
    setTimeout(() => {
      try {
        // In a real implementation, this would use Prettier or another formatter
        // For this demo, we'll just do some basic formatting
        let formatted = code
          .replace(/\s+/g, " ")
          .replace(/\{ /g, "{")
          .replace(/ \}/g, "}")
          .replace(/\( /g, "(")
          .replace(/ \)/g, ")")
          .replace(/\[ /g, "[")
          .replace(/ \]/g, "]")
          .replace(/; /g, ";")
          .replace(/, /g, ",")
          .replace(/\s*\n\s*/g, "\n")
          .replace(/\{/g, "{\n")
          .replace(/\}/g, "}\n")
          .replace(/;/g, ";\n")
          .replace(/\n\s*\n/g, "\n")

        // Add indentation
        const lines = formatted.split("\n")
        let indentLevel = 0
        const indent = useTabs ? "\t" : " ".repeat(tabSize)

        formatted = lines
          .map((line) => {
            // Decrease indent for closing braces
            if (line.includes("}")) {
              indentLevel = Math.max(0, indentLevel - 1)
            }

            const indentedLine = indentLevel > 0 ? indent.repeat(indentLevel) + line : line

            // Increase indent for opening braces
            if (line.includes("{")) {
              indentLevel++
            }

            return indentedLine
          })
          .join("\n")

        setFormattedCode(formatted)

        toast({
          title: "Code Formatted",
          description: "Your code has been successfully formatted.",
        })
      } catch (error) {
        toast({
          title: "Formatting Error",
          description: "There was an error formatting your code. Please check the syntax.",
          variant: "destructive",
        })
      } finally {
        setIsFormatting(false)
      }
    }, 800)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Determine language from file extension
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (extension) {
      switch (extension) {
        case "js":
          setLanguage("javascript")
          break
        case "ts":
          setLanguage("typescript")
          break
        case "jsx":
        case "tsx":
          setLanguage("typescript")
          break
        case "html":
          setLanguage("html")
          break
        case "css":
          setLanguage("css")
          break
        case "json":
          setLanguage("json")
          break
        case "py":
          setLanguage("python")
          break
        default:
          // Keep current language
          break
      }
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCode(content)

      toast({
        title: "File Loaded",
        description: `${file.name} has been loaded successfully.`,
      })
    }
    reader.readAsText(file)
  }

  // Copy formatted code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedCode)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Copied!",
      description: "Formatted code copied to clipboard.",
    })
  }

  // Download formatted code
  const downloadFormattedCode = () => {
    if (!formattedCode) {
      toast({
        title: "No Formatted Code",
        description: "Please format your code first.",
        variant: "destructive",
      })
      return
    }

    // Determine file extension based on language
    let extension = "txt"
    switch (language) {
      case "javascript":
        extension = "js"
        break
      case "typescript":
        extension = "ts"
        break
      case "html":
        extension = "html"
        break
      case "css":
        extension = "css"
        break
      case "json":
        extension = "json"
        break
      case "python":
        extension = "py"
        break
    }

    const blob = new Blob([formattedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `formatted_code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: `Formatted code has been downloaded as formatted_code.${extension}`,
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Advanced Code Formatter is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Advanced Code Formatter</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Format code with customizable rules like Prettier</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Advanced Code Formatter helps you maintain consistent code style:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Format code with customizable rules similar to Prettier</li>
            <li>Support for multiple programming languages</li>
            <li>Configure indentation, quotes, semicolons, and more</li>
            <li>Upload code files or paste code directly</li>
            <li>Download formatted code or copy to clipboard</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Code Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Input</CardTitle>
              <CardDescription>Paste or upload code to format</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paste">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="paste">Paste Code</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Paste your code here..."
                    className="font-mono h-[300px]"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".js,.ts,.jsx,.tsx,.html,.css,.json,.py"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <FileCode className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">Upload a code file</p>
                    <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to browse</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Select File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={formatCode} className="w-full mt-4" disabled={isFormatting || !code.trim()}>
                {isFormatting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Formatting...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Format Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formatting Options</CardTitle>
              <CardDescription>Customize formatting rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tab-size">Tab Size</Label>
                  <Input
                    id="tab-size"
                    type="number"
                    min="1"
                    max="8"
                    value={tabSize}
                    onChange={(e) => setTabSize(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="print-width">Print Width</Label>
                  <Input
                    id="print-width"
                    type="number"
                    min="40"
                    max="120"
                    value={printWidth}
                    onChange={(e) => setPrintWidth(Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="use-tabs" checked={useTabs} onCheckedChange={setUseTabs} />
                <Label htmlFor="use-tabs">Use Tabs</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="semi-colons" checked={semiColons} onCheckedChange={setSemiColons} />
                <Label htmlFor="semi-colons">Semicolons</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="single-quotes" checked={singleQuotes} onCheckedChange={setSingleQuotes} />
                <Label htmlFor="single-quotes">Single Quotes</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailing-commas">Trailing Commas</Label>
                <Select value={trailingCommas} onValueChange={setTrailingCommas}>
                  <SelectTrigger id="trailing-commas">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="es5">ES5</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="bracket-spacing" checked={bracketSpacing} onCheckedChange={setBracketSpacing} />
                <Label htmlFor="bracket-spacing">Bracket Spacing</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrow-parens">Arrow Function Parentheses</Label>
                <Select value={arrowParens} onValueChange={setArrowParens}>
                  <SelectTrigger id="arrow-parens">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Reset to defaults
                  setTabSize(2)
                  setUseTabs(false)
                  setPrintWidth(80)
                  setSemiColons(true)
                  setSingleQuotes(true)
                  setTrailingCommas("es5")
                  setBracketSpacing(true)
                  setArrowParens("always")
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Formatted Output */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Formatted Code</CardTitle>
                  <CardDescription>Preview your formatted code</CardDescription>
                </div>
                {formattedCode && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadFormattedCode}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  className="font-mono h-[500px] bg-gray-50"
                  value={formattedCode}
                  readOnly
                  placeholder="Formatted code will appear here..."
                />
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-lg">Formatting Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">Current Settings</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>Tab Size: {tabSize}</li>
                      <li>Use Tabs: {useTabs ? "Yes" : "No"}</li>
                      <li>Print Width: {printWidth}</li>
                      <li>Semicolons: {semiColons ? "Yes" : "No"}</li>
                      <li>Single Quotes: {singleQuotes ? "Yes" : "No"}</li>
                      <li>Trailing Commas: {trailingCommas}</li>
                      <li>Bracket Spacing: {bracketSpacing ? "Yes" : "No"}</li>
                      <li>Arrow Parens: {arrowParens}</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-700 mb-2">Tips</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
                      <li>Use consistent formatting across your project</li>
                      <li>Consider adding a .prettierrc file to your project</li>
                      <li>Integrate with your IDE for automatic formatting</li>
                      <li>Format code before committing to version control</li>
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

