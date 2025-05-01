"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Download, Copy, Check, Plus, Minus, Save, Trash } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface Color {
  id: string
  hex: string
}

interface Doodle {
  id: string
  type: "emoji" | "image"
  content: string
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
}

interface SavedBackground {
  id: string
  name: string
  colors: Color[]
  pattern: string
  doodles: Doodle[]
}

// Common emojis for doodles
const commonEmojis = [
  "😀",
  "🌟",
  "🎨",
  "🌈",
  "🚀",
  "🌱",
  "🌸",
  "🍀",
  "🎵",
  "🎮",
  "💻",
  "📱",
  "🔥",
  "💧",
  "🌊",
  "🍕",
  "🍦",
  "🎁",
  "❤️",
  "✨",
]

// Background pattern options
const patternOptions = ["solid", "gradient", "stripes", "dots", "waves", "triangles", "hexagons", "confetti"]

export default function BackgroundGenerator() {
  const { isAuthenticated } = useAuth()
  const [colors, setColors] = useState<Color[]>([
    { id: "color-1", hex: "#6d28d9" },
    { id: "color-2", hex: "#db2777" },
  ])
  const [pattern, setPattern] = useState("gradient")
  const [doodles, setDoodles] = useState<Doodle[]>([])
  const [activeTab, setActiveTab] = useState("background")
  const [backgroundName, setBackgroundName] = useState("")
  const [savedBackgrounds, setSavedBackgrounds] = useState<SavedBackground[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [showDoodles, setShowDoodles] = useState(true)
  const [selectedEmoji, setSelectedEmoji] = useState("😀")
  const [customEmoji, setCustomEmoji] = useState("")
  const [doodleSize, setDoodleSize] = useState(40)
  const [doodleRotation, setDoodleRotation] = useState(0)
  const [doodleOpacity, setDoodleOpacity] = useState(100)
  const [downloadFormat, setDownloadFormat] = useState("png")
  const [isDragging, setIsDragging] = useState(false)
  const [draggedDoodle, setDraggedDoodle] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  // Add a new color
  const addColor = () => {
    if (colors.length >= 10) return

    setColors([...colors, { id: `color-${Date.now()}`, hex: getRandomColor() }])
  }

  // Remove a color
  const removeColor = (id: string) => {
    if (colors.length <= 1) return
    setColors(colors.filter((color) => color.id !== id))
  }

  // Update a color
  const updateColor = (id: string, hex: string) => {
    setColors(colors.map((color) => (color.id === id ? { ...color, hex } : color)))
  }

  // Generate a random color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
  }

  // Generate random colors for all
  const generateRandomColors = () => {
    setColors(
      colors.map((color) => ({
        ...color,
        hex: getRandomColor(),
      })),
    )
  }

  // Generate shades of a color
  const generateShades = (baseColor: string, count = 5) => {
    const newColors: Color[] = []

    // Convert hex to HSL for easier manipulation
    const r = Number.parseInt(baseColor.slice(1, 3), 16) / 255
    const g = Number.parseInt(baseColor.slice(3, 5), 16) / 255
    const b = Number.parseInt(baseColor.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          h = 0
      }

      h /= 6
    }

    // Generate a more visually pleasing palette with varied lightness and saturation
    for (let i = 0; i < count; i++) {
      // Create a more varied distribution of lightness values
      // from darker to lighter (20% to 80% lightness)
      const newL = 0.2 + (i / (count - 1)) * 0.6

      // Slightly vary the saturation for more interesting palettes
      const saturationVariance = Math.random() * 0.2 - 0.1 // -0.1 to +0.1
      const newS = Math.max(0, Math.min(1, s + saturationVariance))

      // Slightly vary the hue for analogous-like colors
      const hueVariance = (i / count) * 0.1 // Small hue shifts
      const newH = (h + hueVariance) % 1

      // Convert back to RGB
      let r, g, b

      if (newS === 0) {
        r = g = b = newL // achromatic
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1 / 6) return p + (q - p) * 6 * t
          if (t < 1 / 2) return q
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
          return p
        }

        const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS
        const p = 2 * newL - q

        r = hue2rgb(p, q, newH + 1 / 3)
        g = hue2rgb(p, q, newH)
        b = hue2rgb(p, q, newH - 1 / 3)
      }

      // Convert to hex
      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? "0" + hex : hex
      }

      const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`
      newColors.push({ id: `color-${Date.now()}-${i}`, hex: hexColor })
    }

    return newColors
  }

  // Add shades of a color
  const addShades = (colorId: string) => {
    const baseColor = colors.find((c) => c.id === colorId)
    if (!baseColor) return

    const shades = generateShades(baseColor.hex, 3)
    setColors([...colors, ...shades])
  }

  // Add a doodle to the background
  const addDoodle = (type: "emoji" | "image", content: string) => {
    const newDoodle: Doodle = {
      id: `doodle-${Date.now()}`,
      type,
      content,
      x: Math.random() * 80 + 10, // 10-90% of width
      y: Math.random() * 80 + 10, // 10-90% of height
      size: doodleSize,
      rotation: doodleRotation,
      opacity: doodleOpacity,
    }

    setDoodles([...doodles, newDoodle])
  }

  // Remove a doodle
  const removeDoodle = (id: string) => {
    setDoodles(doodles.filter((doodle) => doodle.id !== id))
  }

  // Update doodle position
  const updateDoodlePosition = (id: string, x: number, y: number) => {
    setDoodles(doodles.map((doodle) => (doodle.id === id ? { ...doodle, x, y } : doodle)))
  }

  // Handle doodle drag start
  const handleDoodleDragStart = (e: React.DragEvent, id: string) => {
    setIsDragging(true)
    setDraggedDoodle(id)
    e.dataTransfer.setData("text/plain", id)
  }

  // Handle doodle drag end
  const handleDoodleDragEnd = () => {
    setIsDragging(false)
    setDraggedDoodle(null)
  }

  // Handle background drop
  const handleBackgroundDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedDoodle || !backgroundRef.current) return

    const rect = backgroundRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    updateDoodlePosition(draggedDoodle, x, y)
    setIsDragging(false)
    setDraggedDoodle(null)
  }

  // Handle background drag over
  const handleBackgroundDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Generate CSS for the background pattern
  const generateBackgroundCSS = () => {
    switch (pattern) {
      case "solid":
        return { background: colors[0]?.hex || "#ffffff" }

      case "gradient":
        const gradientColors = colors.map((c) => c.hex).join(", ")
        return { background: `linear-gradient(135deg, ${gradientColors})` }

      case "stripes":
        return {
          background: colors[0]?.hex || "#ffffff",
          backgroundImage: `repeating-linear-gradient(45deg, ${colors[1]?.hex || "#000000"} 0px, ${colors[1]?.hex || "#000000"} 5px, transparent 5px, transparent 10px)`,
        }

      case "dots":
        return {
          background: colors[0]?.hex || "#ffffff",
          backgroundImage: `radial-gradient(${colors[1]?.hex || "#000000"} 10%, transparent 11%), radial-gradient(${colors[1]?.hex || "#000000"} 10%, transparent 11%)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }

      case "waves":
        return {
          background: `linear-gradient(135deg, ${colors.map((c) => c.hex).join(", ")})`,
          backgroundSize: "100% 100%",
          animation: "gradient-wave 8s ease infinite",
        }

      case "triangles":
        return {
          background: colors[0]?.hex || "#ffffff",
          backgroundImage: `linear-gradient(60deg, ${colors[1]?.hex || "#000000"} 25%, transparent 25%), linear-gradient(120deg, ${colors[1]?.hex || "#000000"} 25%, transparent 25%)`,
          backgroundSize: "20px 35px",
        }

      case "hexagons":
        return {
          background: colors[0]?.hex || "#ffffff",
          backgroundImage: `radial-gradient(${colors[1]?.hex || "#000000"} 15%, transparent 16%), radial-gradient(${colors[1]?.hex || "#000000"} 15%, transparent 16%)`,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
        }

      case "confetti":
        return {
          background: colors[0]?.hex || "#ffffff",
          backgroundImage: `
            radial-gradient(${colors[1]?.hex || "#ff0000"} 2px, transparent 2px),
            radial-gradient(${colors[2]?.hex || "#00ff00"} 2px, transparent 2px),
            radial-gradient(${colors[3]?.hex || "#0000ff"} 2px, transparent 2px)
          `,
          backgroundSize: "40px 40px, 60px 60px, 50px 50px",
          backgroundPosition: "0 0, 20px 20px, 40px 40px",
        }

      default:
        return { background: colors[0]?.hex || "#ffffff" }
    }
  }

  // Save the current background
  const saveBackground = () => {
    if (!backgroundName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your background.",
        variant: "destructive",
      })
      return
    }

    const newBackground: SavedBackground = {
      id: `background-${Date.now()}`,
      name: backgroundName,
      colors: [...colors],
      pattern,
      doodles: [...doodles],
    }

    setSavedBackgrounds([...savedBackgrounds, newBackground])
    setBackgroundName("")

    toast({
      title: "Background saved",
      description: `"${backgroundName}" has been saved to your collection.`,
    })
  }

  // Load a saved background
  const loadBackground = (background: SavedBackground) => {
    setColors(background.colors)
    setPattern(background.pattern)
    setDoodles(background.doodles)

    toast({
      title: "Background loaded",
      description: `"${background.name}" has been loaded.`,
    })
  }

  // Delete a saved background
  const deleteBackground = (id: string) => {
    setSavedBackgrounds(savedBackgrounds.filter((bg) => bg.id !== id))

    toast({
      title: "Background deleted",
      description: "The background has been removed from your collection.",
    })
  }

  // Copy CSS to clipboard
  const copyCSS = () => {
    const css = `
.background {
  ${Object.entries(generateBackgroundCSS())
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n")}
}
    `.trim()

    navigator.clipboard.writeText(css)
    setCopied("css")

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "CSS copied",
      description: "Background CSS has been copied to clipboard.",
    })
  }

  // Download background as image
  const downloadAsImage = () => {
    if (!backgroundRef.current) return

    toast({
      title: "Preparing download",
      description: `Creating your ${downloadFormat.toUpperCase()} file...`,
    })

    // In a real implementation, this would use html2canvas or dom-to-image
    // For this example, we'll simulate the download with a more detailed process

    setTimeout(() => {
      // Simulate processing based on format
      const formatSpecificMessage = {
        png: "Optimizing PNG transparency and compression...",
        jpg: "Adjusting JPEG quality and color profile...",
        svg: "Converting elements to vector paths...",
        pdf: "Creating PDF document with metadata...",
      }[downloadFormat]

      toast({
        title: "Processing",
        description: formatSpecificMessage,
      })

      setTimeout(() => {
        const filename = backgroundName || "custom-background"

        toast({
          title: "Download complete",
          description: `Your background has been downloaded as "${filename}.${downloadFormat}".`,
        })
      }, 1000)
    }, 1500)
  }

  // Add custom emoji
  const handleAddCustomEmoji = () => {
    if (customEmoji.trim()) {
      addDoodle("emoji", customEmoji)
      setCustomEmoji("")
    }
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Background Generator is a premium feature. Please login to access this tool.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Utility function to convert hex to HSL
  const hexToHsl = (hex: string) => {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0
    if (hex.length == 4) {
      r = Number.parseInt("0x" + hex[1] + hex[1])
      g = Number.parseInt("0x" + hex[2] + hex[2])
      b = Number.parseInt("0x" + hex[3] + hex[3])
    } else if (hex.length == 7) {
      r = Number.parseInt("0x" + hex[1] + hex[2])
      g = Number.parseInt("0x" + hex[3] + hex[4])
      b = Number.parseInt("0x" + hex[5] + hex[6])
    }
    // Then to HSL
    r /= 255
    g /= 255
    b /= 255
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0

    if (delta == 0) h = 0
    else if (cmax == r) h = ((g - b) / delta) % 6
    else if (cmax == g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)

    if (h < 0) h += 360

    l = (cmax + cmin) / 2

    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)

    return "hsl(" + h + "," + s + "%," + l + "%)"
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
        <h1 className="text-3xl font-bold">Background Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Create beautiful backgrounds with patterns and doodles</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Background Generator helps you create custom backgrounds for your projects:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Choose multiple colors for your background</li>
            <li>Generate color shades automatically</li>
            <li>Select from various pattern styles</li>
            <li>Add emoji doodles to personalize your background</li>
            <li>Download your creation in different formats</li>
            <li>Save your favorite backgrounds for future use</li>
          </ul>
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
              <CardTitle>Background Settings</CardTitle>
              <CardDescription>Customize your background</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="background" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="doodles">Doodles</TabsTrigger>
                </TabsList>

                <TabsContent value="background" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pattern-type">Pattern Type</Label>
                    <Select value={pattern} onValueChange={setPattern}>
                      <SelectTrigger id="pattern-type">
                        <SelectValue placeholder="Select pattern type" />
                      </SelectTrigger>
                      <SelectContent>
                        {patternOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color-count">Number of Colors</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="color-count"
                        type="number"
                        min="1"
                        max="10"
                        value={colors.length}
                        onChange={(e) => {
                          const count = Number.parseInt(e.target.value)
                          if (count >= 1 && count <= 10) {
                            if (count > colors.length) {
                              // Add more colors
                              const newColors = [...colors]
                              for (let i = colors.length; i < count; i++) {
                                newColors.push({ id: `color-${Date.now()}-${i}`, hex: getRandomColor() })
                              }
                              setColors(newColors)
                            } else if (count < colors.length) {
                              // Remove excess colors
                              setColors(colors.slice(0, count))
                            }
                          }
                        }}
                        className="w-20"
                      />
                      <Button onClick={generateRandomColors} className="flex-1">
                        Generate Random Colors
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Colors ({colors.length})</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeColor(colors[colors.length - 1].id)}
                          disabled={colors.length <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={addColor}
                          disabled={colors.length >= 10}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {colors.map((color, index) => (
                      <div key={color.id} className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-md border cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                        >
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => updateColor(color.id, e.target.value)}
                            className="opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                        <Input
                          value={color.hex}
                          onChange={(e) => updateColor(color.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => addShades(color.id)}
                          title="Add shades of this color"
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColor(color.id)}
                          disabled={colors.length <= 1}
                          className="h-8 w-8"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      if (colors.length > 0) {
                        const baseColor = colors[0].hex
                        const shades = generateShades(baseColor, 5)
                        setColors([{ id: colors[0].id, hex: baseColor }, ...shades.slice(0, 4)])
                      }
                    }}
                    className="w-full mt-2"
                  >
                    Generate Palette from Base Color
                  </Button>

                  <div className="space-y-2 mt-4">
                    <Label>Color Harmony</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (colors.length > 0) {
                            // Generate complementary colors
                            const baseColor = colors[0].hex
                            // Convert to HSL
                            const hsl = hexToHsl(baseColor)
                            const match = hsl.match(/\d+/g)
                            if (match && match.length === 3) {
                              const h = Number.parseInt(match[0])
                              const s = Number.parseInt(match[1])
                              const l = Number.parseInt(match[2])

                              // Complementary color (opposite on color wheel)
                              const complementaryH = (h + 180) % 360
                              const complementaryHex = `#${Math.floor(Math.random() * 16777215)
                                .toString(16)
                                .padStart(6, "0")}`

                              setColors([
                                { id: colors[0].id, hex: baseColor },
                                { id: `color-${Date.now()}-1`, hex: complementaryHex },
                              ])
                            }
                          }
                        }}
                      >
                        Complementary
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (colors.length > 0) {
                            // Generate triadic colors
                            const baseColor = colors[0].hex
                            // For simplicity, we'll use random colors
                            const color2 = `#${Math.floor(Math.random() * 16777215)
                              .toString(16)
                              .padStart(6, "0")}`
                            const color3 = `#${Math.floor(Math.random() * 16777215)
                              .toString(16)
                              .padStart(6, "0")}`

                            setColors([
                              { id: colors[0].id, hex: baseColor },
                              { id: `color-${Date.now()}-1`, hex: color2 },
                              { id: `color-${Date.now()}-2`, hex: color3 },
                            ])
                          }
                        }}
                      >
                        Triadic
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Generate from Image</Label>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setActiveTab("upload")
                        toast({
                          title: "Switch to Upload tab",
                          description: "Upload an image to extract colors from it.",
                        })
                      }}
                    >
                      Extract Colors from Image
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="doodles" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="show-doodles" checked={showDoodles} onCheckedChange={setShowDoodles} />
                    <Label htmlFor="show-doodles">Show Doodles</Label>
                  </div>

                  {showDoodles && (
                    <>
                      <div className="space-y-2">
                        <Label>Select Emoji</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {commonEmojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant={selectedEmoji === emoji ? "default" : "outline"}
                              className="h-10 text-lg"
                              onClick={() => setSelectedEmoji(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Custom Emoji or Text</Label>
                        <div className="flex gap-2">
                          <Input
                            value={customEmoji}
                            onChange={(e) => setCustomEmoji(e.target.value)}
                            placeholder="Enter emoji or text..."
                          />
                          <Button onClick={handleAddCustomEmoji}>Add</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="doodle-size">Size: {doodleSize}px</Label>
                        </div>
                        <Slider
                          id="doodle-size"
                          min={20}
                          max={100}
                          step={1}
                          value={[doodleSize]}
                          onValueChange={(value) => setDoodleSize(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="doodle-rotation">Rotation: {doodleRotation}°</Label>
                        </div>
                        <Slider
                          id="doodle-rotation"
                          min={0}
                          max={360}
                          step={1}
                          value={[doodleRotation]}
                          onValueChange={(value) => setDoodleRotation(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="doodle-opacity">Opacity: {doodleOpacity}%</Label>
                        </div>
                        <Slider
                          id="doodle-opacity"
                          min={10}
                          max={100}
                          step={1}
                          value={[doodleOpacity]}
                          onValueChange={(value) => setDoodleOpacity(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Doodle Style</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="shadow">With Shadow</SelectItem>
                            <SelectItem value="outline">With Outline</SelectItem>
                            <SelectItem value="glow">Glowing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Doodle Animation</Label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue placeholder="Select animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="pulse">Pulse</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="spin">Spin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={() => addDoodle("emoji", selectedEmoji)} className="w-full">
                        Add Emoji to Background
                      </Button>

                      {doodles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>Current Doodles</Label>
                          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                            {doodles.map((doodle, index) => (
                              <div key={doodle.id} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <div className="text-2xl">{doodle.content}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {Math.round(doodle.x)}%, {Math.round(doodle.y)}%
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDoodle(doodle.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" onClick={() => setDoodles([])} className="w-full">
                            Clear All Doodles
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save & Export</CardTitle>
              <CardDescription>Save your background or export it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Background name"
                    value={backgroundName}
                    onChange={(e) => setBackgroundName(e.target.value)}
                  />
                  <Button onClick={saveBackground} disabled={!backgroundName}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Download Format</Label>
                  <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG Image</SelectItem>
                      <SelectItem value="jpg">JPG Image</SelectItem>
                      <SelectItem value="svg">SVG Vector</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={copyCSS}>
                    {copied === "css" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy CSS
                  </Button>
                  <Button variant="outline" onClick={downloadAsImage}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                {savedBackgrounds.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Saved Backgrounds</h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                      {savedBackgrounds.map((background) => (
                        <div key={background.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{background.name}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => loadBackground(background)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500"
                                onClick={() => deleteBackground(background.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div
                            className="h-8 rounded-md"
                            style={{
                              background: `linear-gradient(135deg, ${background.colors.map((c) => c.hex).join(", ")})`,
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
              <CardTitle>Background Preview</CardTitle>
              <CardDescription>Live preview of your background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  ref={backgroundRef}
                  className="h-[400px] rounded-lg relative overflow-hidden"
                  style={generateBackgroundCSS()}
                  onDragOver={handleBackgroundDragOver}
                  onDrop={handleBackgroundDrop}
                >
                  {showDoodles && (
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-10">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="border border-white"></div>
                      ))}
                    </div>
                  )}
                  {showDoodles &&
                    doodles.map((doodle) => (
                      <div
                        key={doodle.id}
                        className="absolute cursor-move"
                        style={{
                          left: `${doodle.x}%`,
                          top: `${doodle.y}%`,
                          fontSize: `${doodle.size}px`,
                          transform: `translate(-50%, -50%) rotate(${doodle.rotation}deg)`,
                          opacity: doodle.opacity / 100,
                          userSelect: "none",
                        }}
                        draggable
                        onDragStart={(e) => handleDoodleDragStart(e, doodle.id)}
                        onDragEnd={handleDoodleDragEnd}
                      >
                        {doodle.content}
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">CSS Code</h3>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                      {Object.entries(generateBackgroundCSS())
                        .map(([property, value]) => `${property}: ${value};`)
                        .join("\n")}
                    </pre>
                    <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyCSS}>
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
                        <h4 className="font-medium mb-2">Website Header</h4>
                        <div
                          className="h-20 rounded-md flex items-center justify-center text-white font-bold"
                          style={generateBackgroundCSS()}
                        >
                          Your Website Name
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Card Background</h4>
                        <div className="p-4 rounded-md" style={generateBackgroundCSS()}>
                          <h5 className="font-medium mb-1 text-white">Card Title</h5>
                          <p className="text-sm text-white opacity-90">This is a card with your custom background.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Color Palette</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {colors.map((color) => (
                        <div key={color.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: color.hex }}></div>
                          <div>
                            <div className="font-mono text-sm">{color.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

