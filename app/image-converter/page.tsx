"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload, Download, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>("png")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"]

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)

        // Create preview
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(objectUrl)

        // Set default target format based on current format
        const currentFormat = selectedFile.type.split("/")[1]
        if (currentFormat !== targetFormat && targetFormat === "png") {
          // Only auto-change if user hasn't explicitly selected a format
          setTargetFormat(currentFormat === "png" ? "jpeg" : "png")
        }
      } else {
        setFile(null)
        setPreviewUrl(null)
        setError("Only image files are allowed (JPEG, PNG, GIF, WebP, BMP, TIFF)")
      }
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError("Please select an image file")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real implementation, you would send the file to a server for conversion
      // For this demo, we'll simulate the conversion by creating a canvas and converting the image

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.drawImage(img, 0, 0)

          // Convert to the target format
          let mimeType = "image/png"
          switch (targetFormat) {
            case "jpeg":
              mimeType = "image/jpeg"
              break
            case "webp":
              mimeType = "image/webp"
              break
            case "gif":
              mimeType = "image/gif"
              break
            case "bmp":
              mimeType = "image/bmp"
              break
          }

          // Get the data URL
          const dataUrl = canvas.toDataURL(mimeType)

          // Create a download link
          const a = document.createElement("a")
          a.href = dataUrl
          a.download = `converted-image.${targetFormat}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)

          setSuccess(`Image successfully converted to ${targetFormat.toUpperCase()}`)
        } else {
          setError("Failed to create canvas context")
        }

        setLoading(false)
      }

      img.onerror = () => {
        setError("Failed to load image")
        setLoading(false)
      }

      img.src = URL.createObjectURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold">Image Converter</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Convert images between different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Image Converter helps you transform images between different file formats:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Convert between PNG, JPEG, WebP, GIF, and BMP formats</li>
            <li>Maintain image quality during conversion</li>
            <li>Preview your image before conversion</li>
            <li>Download the converted image instantly</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Upload your image file</li>
            <li>Select the target format you want to convert to</li>
            <li>Click "Convert" to process the image</li>
            <li>Download your converted image</li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Image</CardTitle>
            <CardDescription>Upload an image and select the target format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports JPEG, PNG, GIF, WebP, BMP, TIFF</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-format">Target Format</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger id="target-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                    <SelectItem value="bmp">BMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleConvert} disabled={loading || !file} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Convert and Download
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Preview of your image before conversion</CardDescription>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="flex justify-center">
                <div className="border rounded-md overflow-hidden max-h-[300px] flex items-center justify-center">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
                <p>Your image preview will appear here</p>
                <p className="text-sm mt-2">Upload an image to see the preview</p>
              </div>
            )}
            {file && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">File name:</span> {file.name}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {(file.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <span className="font-medium">Type:</span> {file.type}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

