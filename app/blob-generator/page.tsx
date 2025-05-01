"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Check, RefreshCw, Save, CodeIcon, ImageIcon, Layers } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface BlobSettings {
  complexity: number
  contrast: number
  smoothness: number
  seed: number
  width: number
  height: number
  rotation: number
}

interface GradientStop {
  id: string
  color: string
  position: number
}

interface SavedBlob {
  id: string
  name: string
  svgPath: string
  settings: BlobSettings
  gradient: {
    type: string
    angle: number
    stops: GradientStop[]
  }
}

export default function BlobGenerator() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("generator")
  const [blobSettings, setBlobSettings] = useState<BlobSettings>({
    complexity: 5,
    contrast: 50,
    smoothness: 50,
    seed: Math.floor(Math.random() * 1000),
    width: 300,
    height: 300,
    rotation: 0,
  })

  const [svgPath, setSvgPath] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [svgCode, setSvgCode] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [blobName, setBlobName] = useState("")
  const [savedBlobs, setSavedBlobs] = useState<SavedBlob[]>([])

  // Gradient settings
  const [gradientType, setGradientType] = useState("linear")
  const [gradientAngle, setGradientAngle] = useState(90)
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([
    { id: "stop1", color: "#6d28d9", position: 0 },
    { id: "stop2", color: "#db2777", position: 100 },
  ])

  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate blob on initial load and when settings change
  useEffect(() => {
    generateBlob()
  }, [blobSettings, gradientType, gradientAngle, gradientStops])

  // Generate a random blob
  const generateRandomBlob = () => {
    const newSettings: BlobSettings = {
      complexity: Math.floor(Math.random() * 8) + 3,
      contrast: Math.floor(Math.random() * 80) + 20,
      smoothness: Math.floor(Math.random() * 80) + 20,
      seed: Math.floor(Math.random() * 1000),
      width: blobSettings.width,
      height: blobSettings.height,
      rotation: Math.floor(Math.random() * 360),
    }

    setBlobSettings(newSettings)

    // Generate random gradient stops
    const newStops: GradientStop[] = [
      {
        id: "stop1",
        color: `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        position: 0,
      },
      {
        id: "stop2",
        color: `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        position: 100,
      },
    ]

    setGradientStops(newStops)
    setGradientAngle(Math.floor(Math.random() * 360))
  }

  // Generate blob SVG path
  const generateBlob = () => {
    const { complexity, contrast, smoothness, seed, width, height, rotation } = blobSettings

    // Use a seeded random number generator for consistency
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed + complexity) * 10000
      const rand = x - Math.floor(x)
      return min + rand * (max - min)
    }

    // Generate points for the blob
    const numPoints = complexity * 3
    const angleStep = (Math.PI * 2) / numPoints
    const points = []

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep
      const radius = 50 + seededRandom(-contrast / 2, contrast / 2)
      const x = 50 + radius * Math.cos(angle)
      const y = 50 + radius * Math.sin(angle)
      points.push({ x, y })
    }

    // Create a smooth path using cubic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < points.length; i++) {
      const p0 = points[i]
      const p1 = points[(i + 1) % points.length]

      const smoothFactor = smoothness / 100
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const controlPointLength = distance * smoothFactor

      const angle = Math.atan2(dy, dx)
      const controlAngle1 = angle + Math.PI / 4
      const controlAngle2 = angle - Math.PI / 4

      const cp1x = p0.x + Math.cos(controlAngle1) * controlPointLength
      const cp1y = p0.y + Math.sin(controlAngle1) * controlPointLength
      const cp2x = p1.x + Math.cos(controlAngle2) * controlPointLength
      const cp2y = p1.y + Math.sin(controlAngle2) * controlPointLength

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
    }

    path += " Z"
    setSvgPath(path)

    // Generate CSS code
    const gradientCSS = generateGradientCSS()
    const cssCode = `
.blob {
  width: ${width}px;
  height: ${height}px;
  background: ${gradientCSS};
  clip-path: path('${path}');
  transform: rotate(${rotation}deg);
}`.trim()

    setCssCode(cssCode)

    // Generate SVG code
    const svgId = `blob-${Date.now()}`
    const svgCode = `
<svg width="${width}" height="${height}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${generateGradientSVG(svgId)}
  </defs>
  <path fill="url(#${svgId})" d="${path}" transform="rotate(${rotation}, 50, 50)"></path>
</svg>`.trim()

    setSvgCode(svgCode)
  }

  // Generate gradient CSS
  const generateGradientCSS = () => {
    const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position)
    const stopsCSS = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")

    if (gradientType === "linear") {
      return `linear-gradient(${gradientAngle}deg, ${stopsCSS})`
    } else {
      return `radial-gradient(circle, ${stopsCSS})`
    }
  }

  // Generate gradient SVG
  const generateGradientSVG = (id: string) => {
    const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position)
    const stopsElements = sortedStops
      .map((stop) => `<stop offset="${stop.position}%" stopColor="${stop.color}" />`)
      .join("\n    ")

    if (gradientType === "linear") {
      // Convert angle to x1,y1,x2,y2 coordinates
      const angle = gradientAngle % 360
      const angleInRadians = (angle - 90) * (Math.PI / 180)
      const x1 = 50 + Math.cos(angleInRadians) * 50
      const y1 = 50 + Math.sin(angleInRadians) * 50
      const x2 = 50 + Math.cos(angleInRadians + Math.PI) * 50
      const y2 = 50 + Math.sin(angleInRadians + Math.PI) * 50

      return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    ${stopsElements}
  </linearGradient>`
    } else {
      return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
    ${stopsElements}
  </radialGradient>`
    }
  }

  // Add a gradient stop
  const addGradientStop = () => {
    if (gradientStops.length >= 5) {
      toast({
        title: "Maximum stops reached",
        description: "You can have a maximum of 5 gradient stops.",
        variant: "destructive",
      })
      return
    }

    // Find a position between existing stops
    const positions = gradientStops.map((stop) => stop.position)
    let newPosition = 50

    if (positions.includes(50)) {
      // Find the largest gap between stops
      const sortedPositions = [...positions].sort((a, b) => a - b)
      let maxGap = 0
      let gapPosition = 50

      for (let i = 0; i < sortedPositions.length - 1; i++) {
        const gap = sortedPositions[i + 1] - sortedPositions[i]
        if (gap > maxGap) {
          maxGap = gap
          gapPosition = sortedPositions[i] + gap / 2
        }
      }

      newPosition = gapPosition
    }

    const newStop: GradientStop = {
      id: `stop${Date.now()}`,
      color: "#ffffff",
      position: newPosition,
    }

    setGradientStops([...gradientStops, newStop])
  }

  // Remove a gradient stop
  const removeGradientStop = (id: string) => {
    if (gradientStops.length <= 2) {
      toast({
        title: "Minimum stops required",
        description: "You need at least 2 gradient stops.",
        variant: "destructive",
      })
      return
    }

    setGradientStops(gradientStops.filter((stop) => stop.id !== id))
  }

  // Update a gradient stop
  const updateGradientStop = (id: string, color: string, position: number) => {
    setGradientStops(gradientStops.map((stop) => (stop.id === id ? { ...stop, color, position } : stop)))
  }

  // Copy code to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "Copied!",
      description: `${type === "css" ? "CSS" : "SVG"} code copied to clipboard.`,
    })
  }

  // Save blob
  const saveBlob = () => {
    if (!blobName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your blob.",
        variant: "destructive",
      })
      return
    }

    const newBlob: SavedBlob = {
      id: `blob-${Date.now()}`,
      name: blobName,
      svgPath,
      settings: { ...blobSettings },
      gradient: {
        type: gradientType,
        angle: gradientAngle,
        stops: [...gradientStops],
      },
    }

    setSavedBlobs([...savedBlobs, newBlob])
    setBlobName("")

    toast({
      title: "Blob saved",
      description: `"${blobName}" has been saved to your collection.`,
    })
  }

  // Load a saved blob
  const loadBlob = (blob: SavedBlob) => {
    setBlobSettings(blob.settings)
    setGradientType(blob.gradient.type)
    setGradientAngle(blob.gradient.angle)
    setGradientStops(blob.gradient.stops)
    setSvgPath(blob.svgPath)

    toast({
      title: "Blob loaded",
      description: `"${blob.name}" has been loaded.`,
    })
  }

  // Delete a saved blob
  const deleteBlob = (id: string) => {
    setSavedBlobs(savedBlobs.filter((blob) => blob.id !== id))

    toast({
      title: "Blob deleted",
      description: "The blob has been removed from your collection.",
    })
  }

  // Download blob as SVG
  const downloadSVG = () => {
    const svgString = svgCode
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `blob-${Date.now()}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "SVG downloaded",
      description: "Your blob has been downloaded as an SVG file.",
    })
  }

  // Download blob as PNG
  const downloadPNG = () => {
    if (!svgRef.current || !canvasRef.current) return

    const svg = svgRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = blobSettings.width
    canvas.height = blobSettings.height

    // Create a data URL from the SVG
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    // Create an image from the SVG data URL
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Draw the image on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL("image/png")

      // Download the PNG
      const a = document.createElement("a")
      a.href = pngUrl
      a.download = `blob-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up
      URL.revokeObjectURL(url)

      toast({
        title: "PNG downloaded",
        description: "Your blob has been downloaded as a PNG file.",
      })
    }

    img.src = url
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Blob Generator is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Blob Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Create customizable blob shapes for your web designs</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Blob Generator helps you create organic shapes for your website designs:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generate random blob shapes with customizable parameters</li>
            <li>Apply beautiful gradients with multiple color stops</li>
            <li>Adjust size, rotation, and other properties</li>
            <li>Copy CSS code for easy implementation in your projects</li>
            <li>Export as SVG or PNG for use in design tools</li>
            <li>Save your favorite blobs for future use</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Adjust the blob parameters to create your desired shape</li>
            <li>Customize the gradient colors and positions</li>
            <li>Copy the CSS or SVG code for your project</li>
            <li>Download the blob as SVG or PNG</li>
            <li>Save your favorite blobs to your collection</li>
          </ol>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blob Settings</CardTitle>
              <CardDescription>Customize your blob shape</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="shape" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="shape">Shape</TabsTrigger>
                  <TabsTrigger value="gradient">Gradient</TabsTrigger>
                </TabsList>

                <TabsContent value="shape" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="complexity">Complexity: {blobSettings.complexity}</Label>
                    </div>
                    <Slider
                      id="complexity"
                      min={3}
                      max={10}
                      step={1}
                      value={[blobSettings.complexity]}
                      onValueChange={(value) => setBlobSettings({ ...blobSettings, complexity: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">Controls the number of points in the blob</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="contrast">Contrast: {blobSettings.contrast}%</Label>
                    </div>
                    <Slider
                      id="contrast"
                      min={0}
                      max={100}
                      step={1}
                      value={[blobSettings.contrast]}
                      onValueChange={(value) => setBlobSettings({ ...blobSettings, contrast: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">Controls how irregular the blob shape is</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="smoothness">Smoothness: {blobSettings.smoothness}%</Label>
                    </div>
                    <Slider
                      id="smoothness"
                      min={0}
                      max={100}
                      step={1}
                      value={[blobSettings.smoothness]}
                      onValueChange={(value) => setBlobSettings({ ...blobSettings, smoothness: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">Controls how smooth the blob edges are</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="rotation">Rotation: {blobSettings.rotation}°</Label>
                    </div>
                    <Slider
                      id="rotation"
                      min={0}
                      max={360}
                      step={1}
                      value={[blobSettings.rotation]}
                      onValueChange={(value) => setBlobSettings({ ...blobSettings, rotation: value[0] })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        min={50}
                        max={1000}
                        value={blobSettings.width}
                        onChange={(e) => setBlobSettings({ ...blobSettings, width: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        min={50}
                        max={1000}
                        value={blobSettings.height}
                        onChange={(e) => setBlobSettings({ ...blobSettings, height: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Button onClick={generateRandomBlob} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Random Blob
                  </Button>
                </TabsContent>

                <TabsContent value="gradient" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-type">Gradient Type</Label>
                    <Select value={gradientType} onValueChange={setGradientType}>
                      <SelectTrigger id="gradient-type">
                        <SelectValue placeholder="Select gradient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear Gradient</SelectItem>
                        <SelectItem value="radial">Radial Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {gradientType === "linear" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="gradient-angle">Angle: {gradientAngle}°</Label>
                      </div>
                      <Slider
                        id="gradient-angle"
                        min={0}
                        max={360}
                        step={1}
                        value={[gradientAngle]}
                        onValueChange={(value) => setGradientAngle(value[0])}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Gradient Stops</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addGradientStop}
                        disabled={gradientStops.length >= 5}
                      >
                        Add Stop
                      </Button>
                    </div>

                    <div className="space-y-3 mt-2">
                      {gradientStops.map((stop) => (
                        <div key={stop.id} className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md border cursor-pointer"
                            style={{ backgroundColor: stop.color }}
                          >
                            <input
                              type="color"
                              value={stop.color}
                              onChange={(e) => updateGradientStop(stop.id, e.target.value, stop.position)}
                              className="opacity-0 w-full h-full cursor-pointer"
                            />
                          </div>

                          <div className="flex-1">
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[stop.position]}
                              onValueChange={(value) => updateGradientStop(stop.id, stop.color, value[0])}
                            />
                          </div>

                          <div className="w-10 text-xs text-center">{stop.position}%</div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeGradientStop(stop.id)}
                            disabled={gradientStops.length <= 2}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-10 rounded-md mt-2" style={{ background: generateGradientCSS() }}></div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Copy code or download your blob</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>CSS Code</Label>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">{cssCode}</pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(cssCode, "css")}
                    >
                      {copied === "css" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy CSS
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SVG Code</Label>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">{svgCode}</pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(svgCode, "svg")}
                    >
                      {copied === "svg" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy SVG
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={downloadSVG} className="w-full">
                    <CodeIcon className="mr-2 h-4 w-4" />
                    Download SVG
                  </Button>
                  <Button onClick={downloadPNG} className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Blob name" value={blobName} onChange={(e) => setBlobName(e.target.value)} />
                    <Button onClick={saveBlob} disabled={!blobName}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {savedBlobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Blobs</CardTitle>
                <CardDescription>Your collection of saved blobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedBlobs.map((blob) => (
                    <div key={blob.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{blob.name}</h3>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => loadBlob(blob)}>
                            <Layers className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => deleteBlob(blob.id)}
                          >
                            &times;
                          </Button>
                        </div>
                      </div>

                      <div className="h-16 rounded-md overflow-hidden">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 100 100"
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id={`saved-${blob.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              {blob.gradient.stops.map((stop) => (
                                <stop key={stop.id} offset={`${stop.position}%`} stopColor={stop.color} />
                              ))}
                            </linearGradient>
                          </defs>
                          <path
                            fill={`url(#saved-${blob.id})`}
                            d={blob.svgPath}
                            transform={`rotate(${blob.settings.rotation}, 50, 50)`}
                          ></path>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blob Preview</CardTitle>
              <CardDescription>Live preview of your blob shape</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                <div
                  className="relative"
                  style={{
                    width: `${blobSettings.width}px`,
                    height: `${blobSettings.height}px`,
                    maxWidth: "100%",
                  }}
                >
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {gradientStops.map((stop) => (
                          <stop key={stop.id} offset={`${stop.position}%`} stopColor={stop.color} />
                        ))}
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#blob-gradient)"
                      d={svgPath}
                      transform={`rotate(${blobSettings.rotation}, 50, 50)`}
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-lg">Usage Examples</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Background Element</h4>
                    <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
                      <div
                        className="absolute -right-10 -bottom-10"
                        style={{
                          width: "150px",
                          height: "150px",
                          background: generateGradientCSS(),
                          clipPath: `path('${svgPath}')`,
                          transform: `rotate(${blobSettings.rotation}deg)`,
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-md shadow-sm">
                          <p className="font-medium">Content Box</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Image Mask</h4>
                    <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
                      <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                          backgroundImage: "url('/placeholder.svg?height=200&width=200')",
                          clipPath: `path('${svgPath}')`,
                          transform: `rotate(${blobSettings.rotation}deg)`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>How to use the blob in your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Using CSS</h3>
                  <p className="text-muted-foreground mb-4">
                    Add the CSS code to your stylesheet and apply the{" "}
                    <code className="bg-muted px-1 rounded">blob</code> class to any element:
                  </p>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">
                    {`<div class="blob"></div>

<style>
${cssCode}
</style>`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Using SVG</h3>
                  <p className="text-muted-foreground mb-4">Add the SVG code directly to your HTML:</p>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">
                    {`<!-- Add this to your HTML -->
${svgCode}`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Tips for Using Blobs</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Use blobs as background elements to add visual interest</li>
                    <li>Layer multiple blobs with different opacities for depth</li>
                    <li>Use blobs as masks for images or videos</li>
                    <li>Animate blobs with CSS transitions or animations</li>
                    <li>Combine blobs with other design elements for unique layouts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

