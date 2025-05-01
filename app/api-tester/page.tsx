"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

interface RequestParam {
  key: string
  value: string
  enabled: boolean
}

interface ResponseData {
  status: number
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  body: string
}

export default function ApiTesterPage() {
  const [url, setUrl] = useState<string>("https://jsonplaceholder.typicode.com/posts/1")
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Request data
  const [queryParams, setQueryParams] = useState<RequestParam[]>([{ key: "", value: "", enabled: true }])
  const [headers, setHeaders] = useState<RequestParam[]>([{ key: "", value: "", enabled: true }])
  const [body, setBody] = useState<string>("{}")

  const handleAddParam = (type: "query" | "header") => {
    if (type === "query") {
      setQueryParams([...queryParams, { key: "", value: "", enabled: true }])
    } else {
      setHeaders([...headers, { key: "", value: "", enabled: true }])
    }
  }

  const handleRemoveParam = (type: "query" | "header", index: number) => {
    if (type === "query") {
      setQueryParams(queryParams.filter((_, i) => i !== index))
    } else {
      setHeaders(headers.filter((_, i) => i !== index))
    }
  }

  const handleParamChange = (
    type: "query" | "header",
    index: number,
    field: "key" | "value" | "enabled",
    value: string | boolean,
  ) => {
    if (type === "query") {
      const newParams = [...queryParams]
      newParams[index] = {
        ...newParams[index],
        [field]: value,
      }
      setQueryParams(newParams)
    } else {
      const newHeaders = [...headers]
      newHeaders[index] = {
        ...newHeaders[index],
        [field]: value,
      }
      setHeaders(newHeaders)
    }
  }

  const buildUrl = () => {
    const baseUrl = url.split("?")[0]
    const enabledParams = queryParams.filter((param) => param.enabled && param.key)

    if (enabledParams.length === 0) return baseUrl

    const queryString = enabledParams
      .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
      .join("&")

    return `${baseUrl}?${queryString}`
  }

  const handleSendRequest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    const startTime = performance.now()

    try {
      const requestUrl = buildUrl()
      const requestHeaders: HeadersInit = {}

      // Add headers
      headers.forEach((header) => {
        if (header.enabled && header.key) {
          requestHeaders[header.key] = header.value
        }
      })

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: requestHeaders,
      }

      // Add body for non-GET requests
      if (method !== "GET" && method !== "HEAD") {
        options.body = body
      }

      const response = await fetch(requestUrl, options)
      const responseText = await response.text()

      const endTime = performance.now()
      const duration = endTime - startTime

      // Extract headers
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      setResponse({
        status: response.status,
        statusText: response.statusText,
        time: Math.round(duration),
        size: new Blob([responseText]).size,
        headers: responseHeaders,
        body: responseText,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
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
        <h1 className="text-3xl font-bold">API Tester</h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
            <SelectItem value="HEAD">HEAD</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter request URL"
          className="flex-1"
        />

        <Button onClick={handleSendRequest} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="params">Query Params</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>

            <TabsContent value="params" className="p-4">
              <div className="space-y-2">
                {queryParams.map((param, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) => handleParamChange("query", index, "enabled", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Input
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => handleParamChange("query", index, "key", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => handleParamChange("query", index, "value", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParam("query", index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleAddParam("query")} className="w-full mt-2">
                  Add Parameter
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="p-4">
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => handleParamChange("header", index, "enabled", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => handleParamChange("header", index, "key", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => handleParamChange("header", index, "value", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParam("header", index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleAddParam("header")} className="w-full mt-2">
                  Add Header
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="body" className="p-4">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Request body (JSON, XML, etc.)"
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
          </Tabs>
        </Card>

        <Card>
          <Tabs defaultValue="response" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent value="response" className="p-4">
              {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-md ${
                          response.status >= 200 && response.status < 300
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium">Time:</span> {response.time} ms
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {response.size} B
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <pre className="p-4 overflow-auto text-sm font-mono bg-muted max-h-[400px]">
                      {formatJson(response.body)}
                    </pre>
                  </div>
                </div>
              )}

              {!response && !error && (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <p>Response will appear here</p>
                  <p className="text-sm mt-2">Send a request to see the response</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="headers" className="p-4">
              {response ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted p-2 font-medium text-sm">Response Headers</div>
                  <div className="p-4 space-y-2">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">{key}</div>
                        <div className="col-span-2 font-mono break-all">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <p>Headers will appear here</p>
                  <p className="text-sm mt-2">Send a request to see the headers</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

