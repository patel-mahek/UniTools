"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ValidatorPage() {
  const [jsonResult, setJsonResult] = useState<{ valid: boolean; message?: string } | null>(null)
  const [yamlResult, setYamlResult] = useState<{ valid: boolean; message?: string } | null>(null)
  const [xmlResult, setXmlResult] = useState<{ valid: boolean; message?: string } | null>(null)
  const [markdownResult, setMarkdownResult] = useState<{ valid: boolean; message?: string } | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  
  const handleSubmit = async (type: string, content: string) => {
    setLoading(type)
  
    const fieldName = `${type.toLowerCase()}_str`
    const endpoint = `http://127.0.0.1:8000/validate-${type.toLowerCase()}`
  
    try {
      const formData = new FormData()
      formData.append(fieldName, content)
  
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })
  
      if (!response.ok) throw new Error("Validation failed.")
  
      const data = await response.json()
  
      switch (type) {
        case "json":
          setJsonResult(data)
          break
        case "yaml":
          setYamlResult(data)
          break
        case "xml":
          setXmlResult(data)
          break
        case "markdown":
          setMarkdownResult(data)
          break
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const errorData = { valid: false, message: errorMessage }
  
      switch (type) {
        case "json":
          setJsonResult(errorData)
          break
        case "yaml":
          setYamlResult(errorData)
          break
        case "xml":
          setXmlResult(errorData)
          break
        case "markdown":
          setMarkdownResult(errorData)
          break
      }
    } finally {
      setLoading(null)
    }
  }

  const renderResult = (result: { valid: boolean; message?: string } | null) => {
    if (!result) return null

    return (
      <Alert className={result.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
        {result.valid ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
        <AlertTitle className={result.valid ? "text-green-800" : "text-red-800"}>
          {result.valid ? "Valid" : "Invalid"}
        </AlertTitle>
        {result.message && (
          <AlertDescription className={result.valid ? "text-green-700" : "text-red-700"}>
            {result.message}
          </AlertDescription>
        )}
      </Alert>
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
        <h1 className="text-3xl font-bold">Text Formatter</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Format and validate various text formats</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Text Formatter helps you validate and format different text-based data formats:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>JSON - JavaScript Object Notation for data interchange</li>
            <li>YAML - Human-readable data serialization format</li>
            <li>XML - Extensible Markup Language for storing and transporting data</li>
            <li>Markdown - Lightweight markup language for creating formatted text</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Select the format tab you want to validate (JSON, YAML, XML, or Markdown)</li>
            <li>Paste your text into the text area</li>
            <li>Click the "Validate" button</li>
            <li>View the results to see if your text is valid and properly formatted</li>
          </ol>
          <p className="mt-4">
            This free version allows you to validate and format individual text snippets. Upgrade to premium for batch
            processing and advanced formatting options.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="json" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
          <TabsTrigger value="xml">XML</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="json">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const textarea = e.currentTarget.querySelector("textarea")
              if (textarea) handleSubmit("json", textarea.value)
            }}
            className="space-y-4"
          >
            <Textarea placeholder="Paste your JSON here..." className="min-h-[300px] font-mono" name="json_str" />
            <Button type="submit" disabled={loading === "json"}>
              {loading === "json" ? "Validating..." : "Validate JSON"}
            </Button>
            {renderResult(jsonResult)}
          </form>
        </TabsContent>

        <TabsContent value="yaml">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const textarea = e.currentTarget.querySelector("textarea")
              if (textarea) handleSubmit("yaml", textarea.value)
            }}
            className="space-y-4"
          >
            <Textarea placeholder="Paste your YAML here..." className="min-h-[300px] font-mono" name="yaml_str" />
            <Button type="submit" disabled={loading === "yaml"}>
              {loading === "yaml" ? "Validating..." : "Validate YAML"}
            </Button>
            {renderResult(yamlResult)}
          </form>
        </TabsContent>

        <TabsContent value="xml">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const textarea = e.currentTarget.querySelector("textarea")
              if (textarea) handleSubmit("xml", textarea.value)
            }}
            className="space-y-4"
          >
            <Textarea placeholder="Paste your XML here..." className="min-h-[300px] font-mono" name="xml_str" />
            <Button type="submit" disabled={loading === "xml"}>
              {loading === "xml" ? "Validating..." : "Validate XML"}
            </Button>
            {renderResult(xmlResult)}
          </form>
        </TabsContent>

        <TabsContent value="markdown">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const textarea = e.currentTarget.querySelector("textarea")
              if (textarea) handleSubmit("markdown", textarea.value)
            }}
            className="space-y-4"
          >
            <Textarea placeholder="Paste your Markdown here..." className="min-h-[300px] font-mono" name="md_str" />
            <Button type="submit" disabled={loading === "markdown"}>
              {loading === "markdown" ? "Validating..." : "Validate Markdown"}
            </Button>
            {renderResult(markdownResult)}
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

