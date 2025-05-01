"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Database, Copy, Download, Upload, Check, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SQLFormatterPage() {
  const [sql, setSql] = useState("")
  const [formattedSql, setFormattedSql] = useState("")
  const [indentSize, setIndentSize] = useState(2)
  const [uppercase, setUppercase] = useState(true)
  const [lineBreakBeforeComma, setLineBreakBeforeComma] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Format SQL function
  const formatSQL = () => {
    if (!sql.trim()) {
      toast({
        title: "Empty SQL",
        description: "Please enter SQL code to format.",
        variant: "destructive",
      })
      return
    }

    setIsFormatting(true)

    // Simulate processing time
    setTimeout(() => {
      try {
        // Basic SQL formatting logic
        let formatted = sql
          .replace(/\s+/g, " ")
          .replace(/\s*,\s*/g, lineBreakBeforeComma ? "\n, " : ", ")
          .replace(/\s*SELECT\s+/gi, "SELECT\n  ")
          .replace(/\s*FROM\s+/gi, "\nFROM\n  ")
          .replace(/\s*WHERE\s+/gi, "\nWHERE\n  ")
          .replace(/\s*AND\s+/gi, "\n  AND ")
          .replace(/\s*OR\s+/gi, "\n  OR ")
          .replace(/\s*ORDER\s+BY\s+/gi, "\nORDER BY\n  ")
          .replace(/\s*GROUP\s+BY\s+/gi, "\nGROUP BY\n  ")
          .replace(/\s*HAVING\s+/gi, "\nHAVING\n  ")
          .replace(/\s*JOIN\s+/gi, "\nJOIN\n  ")
          .replace(/\s*LEFT\s+JOIN\s+/gi, "\nLEFT JOIN\n  ")
          .replace(/\s*RIGHT\s+JOIN\s+/gi, "\nRIGHT JOIN\n  ")
          .replace(/\s*INNER\s+JOIN\s+/gi, "\nINNER JOIN\n  ")
          .replace(/\s*OUTER\s+JOIN\s+/gi, "\nOUTER JOIN\n  ")
          .replace(/\s*ON\s+/gi, "\n  ON ")
          .replace(/\s*UNION\s+/gi, "\nUNION\n")
          .replace(/\s*LIMIT\s+/gi, "\nLIMIT ")

        // Apply indentation based on user preference
        const indent = " ".repeat(indentSize)
        formatted = formatted.replace(/\n/g, "\n" + indent)

        // Apply uppercase if selected
        if (uppercase) {
          const keywords = [
            "SELECT",
            "FROM",
            "WHERE",
            "AND",
            "OR",
            "ORDER BY",
            "GROUP BY",
            "HAVING",
            "JOIN",
            "LEFT JOIN",
            "RIGHT JOIN",
            "INNER JOIN",
            "OUTER JOIN",
            "ON",
            "UNION",
            "LIMIT",
            "INSERT",
            "UPDATE",
            "DELETE",
            "CREATE",
            "ALTER",
            "DROP",
            "TRUNCATE",
            "AS",
            "DISTINCT",
            "CASE",
            "WHEN",
            "THEN",
            "ELSE",
            "END",
            "NULL",
            "NOT NULL",
            "PRIMARY KEY",
            "FOREIGN KEY",
            "REFERENCES",
          ]

          keywords.forEach((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "gi")
            formatted = formatted.replace(regex, keyword)
          })
        }

        setFormattedSql(formatted)
        toast({
          title: "SQL Formatted",
          description: "Your SQL has been successfully formatted.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error formatting your SQL. Please check the syntax.",
          variant: "destructive",
        })
      } finally {
        setIsFormatting(false)
      }
    }, 800)
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSql(content)
      toast({
        title: "File Loaded",
        description: `${file.name} has been loaded successfully.`,
      })
    }
    reader.readAsText(file)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSql)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Copied!",
      description: "SQL code copied to clipboard.",
    })
  }

  // Download formatted SQL
  const downloadSQL = () => {
    const blob = new Blob([formattedSql], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted-sql.sql"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Formatted SQL has been downloaded.",
    })
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center justify-center p-3 rounded-full bg-purple-100 mb-4">
          <Database className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">SQL Formatter</h1>
        <p className="text-muted-foreground text-center mt-2 max-w-2xl">
          Format your SQL queries with proper indentation and syntax highlighting. Upload SQL files and download the
          formatted results.
        </p>
      </div>

      <Tabs defaultValue="editor" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input SQL</CardTitle>
                <CardDescription>Paste your SQL query or upload a file</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="INSERT INTO users (name, email) VALUES ('John', 'john@example.com');"
                  className="min-h-[300px] font-mono text-sm"
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".sql,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={triggerFileInput}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload SQL
                  </Button>
                </div>
                <Button onClick={formatSQL} disabled={isFormatting}>
                  {isFormatting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Formatting...
                    </>
                  ) : (
                    "Format SQL"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formatted SQL</CardTitle>
                <CardDescription>Preview your formatted SQL code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea className="min-h-[300px] font-mono text-sm" value={formattedSql} readOnly />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={copyToClipboard} disabled={!formattedSql}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button onClick={downloadSQL} disabled={!formattedSql}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Formatting Options</CardTitle>
              <CardDescription>Customize how your SQL code is formatted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="indent-size">Indent Size</Label>
                <Input
                  id="indent-size"
                  type="number"
                  min="1"
                  max="8"
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number.parseInt(e.target.value))}
                  className="max-w-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                <Label htmlFor="uppercase">Uppercase Keywords</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="line-break" checked={lineBreakBeforeComma} onCheckedChange={setLineBreakBeforeComma} />
                <Label htmlFor="line-break">Line Break Before Comma</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

