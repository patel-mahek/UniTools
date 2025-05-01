"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Check, Plus, Minus, Save, Trash } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface ColorStop {
  id: string
  color: string
  position: number
}

interface SavedGradient {
  id: string
  name: string
  type: string
  angle: number
  stops: ColorStop[]
}

export default function ColorSelector() {
  const { isAuthenticated } = useAuth()
  const [colorCount, setColorCount] = useState(2)
  const [gradientType, setGradientType] = useState("linear")
  const [gradientAngle, setGradientAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "color-1", color: "#6d28d9", position: 0 },
    { id: "color-2", color: "#db2777", position: 100 },
  ])
  const [activeTab, setActiveTab] = useState("gradient")
  const [copied, setCopied] = useState<string | null>(null)
  const [gradientName, setGradientName] = useState("")
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>([])

  // Generate CSS for the gradient
  const generateGradientCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
    const stopsCSS = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")

    if (gradientType === "linear") {
      return `linear-gradient(${gradientAngle}deg, ${stopsCSS})`
    } else if (gradientType === "radial") {
      return `radial-gradient(circle, ${stopsCSS})`
    } else {
      return `conic-gradient(from ${gradientAngle}deg, ${stopsCSS})`
    }
  }

  // Update color stops when color count changes
  useEffect(() => {
    if (colorCount > colorStops.length) {
      // Add more color stops
      const newStops = [...colorStops]
      for (let i = colorStops.length; i < colorCount; i++) {
        const position = i === 0 ? 0 : i === colorCount - 1 ? 100 : Math.round((i / (colorCount - 1)) * 100)
        newStops.push({
          id: `color-${i + 1}`,
          color: getRandomColor(),
          position,
        })
      }
      setColorStops(newStops)
    } else if (colorCount < colorStops.length) {
      // Remove excess color stops
      setColorStops(colorStops.slice(0, colorCount))
    }
  }, [colorCount])

  // Generate a random color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
  }

  // Update a color stop
  const updateColorStop = (id: string, color: string, position: number) => {
    setColorStops(colorStops.map((stop) => (stop.id === id ? { ...stop, color, position } : stop)))
  }

  // Generate random colors for all stops
  const generateRandomColors = () => {
    setColorStops(
      colorStops.map((stop) => ({
        ...stop,
        color: getRandomColor(),
      })),
    )
  }

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return "rgb(0, 0, 0)"

    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)

    return `rgb(${r}, ${g}, ${b})`
  }

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.slice(0, 2), 16) / 255
    const g = Number.parseInt(hex.slice(2, 4), 16) / 255
    const b = Number.parseInt(hex.slice(4, 6), 16) / 255

    // Find the min and max values to compute the lightness
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    // Calculate lightness
    let l = (max + min) / 2

    let h, s

    if (max === min) {
      // Achromatic
      h = s = 0
    } else {
      // Calculate saturation
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)

      // Calculate hue
      switch (max) {
        case r:
          h = (g - b) / (max - min) + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / (max - min) + 2
          break
        case b:
          h = (r - g) / (max - min) + 4
          break
        default:
          h = 0
      }

      h /= 6
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "Copied!",
      description: `${type.toUpperCase()} code copied to clipboard.`,
    })
  }

  // Save gradient
  const saveGradient = () => {
    if (!gradientName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your gradient.",
        variant: "destructive",
      })
      return
    }

    const newGradient: SavedGradient = {
      id: `gradient-${Date.now()}`,
      name: gradientName,
      type: gradientType,
      angle: gradientAngle,
      stops: [...colorStops],
    }

    setSavedGradients([...savedGradients, newGradient])
    setGradientName("")

    toast({
      title: "Gradient saved",
      description: `"${gradientName}" has been saved to your collection.`,
    })
  }

  // Load a saved gradient
  const loadGradient = (gradient: SavedGradient) => {
    setGradientType(gradient.type)
    setGradientAngle(gradient.angle)
    setColorStops(gradient.stops)
    setColorCount(gradient.stops.length)

    toast({
      title: "Gradient loaded",
      description: `"${gradient.name}" has been loaded.`,
    })
  }

  // Delete a saved gradient
  const deleteGradient = (id: string) => {
    setSavedGradients(savedGradients.filter((gradient) => gradient.id !== id))

    toast({
      title: "Gradient deleted",
      description: "The gradient has been removed from your collection.",
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Color Selector is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Color Selector</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Create and customize color gradients for your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Color Selector helps you create beautiful color combinations and gradients:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Select the number of colors for your gradient</li>
            <li>Choose specific colors with the color picker</li>
            <li>Adjust the position of each color in the gradient</li>
            <li>Copy color codes in HEX, RGB, and HSL formats</li>
            <li>Generate CSS code for your gradient</li>
            <li>Save your favorite gradients for future use</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Select the number of colors you want in your gradient</li>
            <li>Choose the gradient type (linear, radial, or conic)</li>
            <li>Customize each color and its position</li>
            <li>Copy the color codes or CSS for your project</li>
            <li>Save your favorite gradients to your collection</li>
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
              <CardTitle>Gradient Settings</CardTitle>
              <CardDescription>Customize your color gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gradient" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="gradient">Gradient</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                </TabsList>

                <TabsContent value="gradient" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-type">Gradient Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={gradientType === "linear" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setGradientType("linear")}
                      >
                        Linear
                      </Button>
                      <Button
                        variant={gradientType === "radial" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setGradientType("radial")}
                      >
                        Radial
                      </Button>
                      <Button
                        variant={gradientType === "conic" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setGradientType("conic")}
                      >
                        Conic
                      </Button>
                    </div>
                  </div>

                  {(gradientType === "linear" || gradientType === "conic") && (
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
                      <Label htmlFor="color-count">Number of Colors: {colorCount}</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setColorCount(Math.max(2, colorCount - 1))}
                          disabled={colorCount <= 2}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setColorCount(Math.min(10, colorCount + 1))}
                          disabled={colorCount >= 10}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={generateRandomColors} className="w-full">
                    Generate Random Colors
                  </Button>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div className="space-y-3">
                    {colorStops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-md border cursor-pointer"
                          style={{ backgroundColor: stop.color }}
                        >
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => updateColorStop(stop.id, e.target.value, stop.position)}
                            className="opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>

                        <div className="flex-1">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[stop.position]}
                            onValueChange={(value) => updateColorStop(stop.id, stop.color, value[0])}
                          />
                        </div>

                        <div className="w-10 text-xs text-center">{stop.position}%</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 space-y-2">
                    <Label>Color Information</Label>
                    <div className="space-y-3">
                      {colorStops.map((stop) => (
                        <div key={stop.id} className="space-y-2 p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: stop.color }}></div>
                            <span className="font-medium">Color {colorStops.indexOf(stop) + 1}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <Input value={stop.color} readOnly className="pr-10" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => copyToClipboard(stop.color, `hex-${stop.id}`)}
                              >
                                {copied === `hex-${stop.id}` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="relative">
                              <Input value={hexToRgb(stop.color)} readOnly className="pr-10" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => copyToClipboard(hexToRgb(stop.color), `rgb-${stop.id}`)}
                              >
                                {copied === `rgb-${stop.id}` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="relative">
                            <Input value={hexToHsl(stop.color)} readOnly className="pr-10" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => copyToClipboard(hexToHsl(stop.color), `hsl-${stop.id}`)}
                            >
                              {copied === `hsl-${stop.id}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save Gradient</CardTitle>
              <CardDescription>Save your gradient for future use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Gradient name"
                    value={gradientName}
                    onChange={(e) => setGradientName(e.target.value)}
                  />
                  <Button onClick={saveGradient} disabled={!gradientName}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                {savedGradients.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Saved Gradients</h3>
                    <div className="space-y-3">
                      {savedGradients.map((gradient) => (
                        <div key={gradient.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{gradient.name}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => loadGradient(gradient)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500"
                                onClick={() => deleteGradient(gradient.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div
                            className="h-8 rounded-md"
                            style={{
                              background:
                                gradient.type === "linear"
                                  ? `linear-gradient(${gradient.angle}deg, ${gradient.stops
                                      .map((s) => `${s.color} ${s.position}%`)
                                      .join(", ")})`
                                  : gradient.type === "radial"
                                    ? `radial-gradient(circle, ${gradient.stops
                                        .map((s) => `${s.color} ${s.position}%`)
                                        .join(", ")})`
                                    : `conic-gradient(from ${gradient.angle}deg, ${gradient.stops
                                        .map((s) => `${s.color} ${s.position}%`)
                                        .join(", ")})`,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Preview</CardTitle>
              <CardDescription>Live preview of your color gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className="h-60 rounded-lg"
                  style={{
                    background: generateGradientCSS(),
                  }}
                ></div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">CSS Code</h3>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                      {`background: ${generateGradientCSS()};`}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`background: ${generateGradientCSS()};`, "css")}
                    >
                      {copied === "css" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy CSS
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Usage Examples</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Button</h4>
                        <div className="flex justify-center">
                          <button
                            className="px-4 py-2 rounded-md text-white font-medium"
                            style={{ background: generateGradientCSS() }}
                          >
                            Gradient Button
                          </button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Card</h4>
                        <div className="p-4 rounded-md text-white" style={{ background: generateGradientCSS() }}>
                          <h5 className="font-medium mb-1">Card Title</h5>
                          <p className="text-sm opacity-90">This is a card with your gradient background.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Color Palette</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {colorStops.map((stop) => (
                        <div key={stop.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: stop.color }}></div>
                          <div>
                            <div className="font-mono text-sm">{stop.color}</div>
                            <div className="text-xs text-muted-foreground">{hexToRgb(stop.color)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Implementation Guide</h3>
                  <div className="space-y-2">
                    <h4 className="font-medium">CSS</h4>
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                      {`.element {
  background: ${generateGradientCSS()};
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Tailwind CSS</h4>
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                      {`<div class="bg-gradient-to-r from-[${colorStops.find((s) => s.position === 0)?.color || "#000000"}] to-[${
                        colorStops.find((s) => s.position === 100)?.color || "#ffffff"
                      }]">
  <!-- Your content here -->
</div>`}
                    </pre>
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

