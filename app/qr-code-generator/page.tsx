"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, LinkIcon, Smartphone, QrCode } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function QRCodeGeneratorPage() {
  const [url, setUrl] = useState("")
  const [qrSize, setQrSize] = useState("200")
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple URL validation
    if (!url) {
      setError("Please enter a URL")
      setGenerated(false)
      return
    }

    // Add http:// prefix if missing
    let processedUrl = url
    if (!/^https?:\/\//i.test(url)) {
      processedUrl = "https://" + url
      setUrl(processedUrl)
    }

    setError(null)
    setGenerated(true)
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const size = Number.parseInt(qrSize)
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)

      // Download the image
      const a = document.createElement("a")
      a.download = "qrcode.png"
      a.href = canvas.toDataURL("image/png")
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
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
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create QR Code</CardTitle>
            <CardDescription>Generate a QR code from any URL or text</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL or Text</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL or text (e.g., https://example.com)"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qr-size">QR Code Size</Label>
                  <Select value={qrSize} onValueChange={setQrSize}>
                    <SelectTrigger id="qr-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128">Small (128px)</SelectItem>
                      <SelectItem value="200">Medium (200px)</SelectItem>
                      <SelectItem value="256">Large (256px)</SelectItem>
                      <SelectItem value="320">Extra Large (320px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-color">QR Code Color</Label>
                  <div className="flex">
                    <Input
                      id="qr-color"
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Generate QR Code
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>Scan with a mobile device to open the URL</CardDescription>
          </CardHeader>
          <CardContent>
            {generated ? (
              <div className="flex flex-col items-center">
                <div ref={qrRef} className="p-4 bg-white rounded-lg border" style={{ backgroundColor: bgColor }}>
                  <QRCodeSVG
                    value={url}
                    size={Number.parseInt(qrSize)}
                    fgColor={qrColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="mt-6 space-y-4 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">URL:</span>
                    <span className="font-medium truncate max-w-[200px]">{url}</span>
                  </div>

                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>

                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <div className="flex justify-center mb-2">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <p>Scan with your phone's camera or QR code reader app to open the link</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mb-4 opacity-20" />
                <p>Your QR code will appear here</p>
                <p className="text-sm mt-2">Enter a URL and click Generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

