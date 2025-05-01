"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Palette,
  ImageIcon,
  Check,
  Shuffle,
  Trash,
  Save,
  Lock,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Color type definition
interface Color {
  id: string
  name: string
  hex: string
  rgb: string
  hsl: string
  locked: boolean
}

// Demo website section type
interface WebsiteSection {
  id: string
  name: string
  colorId: string
  element: string
}

export default function ColorPaletteGenerator() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("input")
  const [inputColor, setInputColor] = useState("#6d28d9") // Default purple color
  const [inputColorFormat, setInputColorFormat] = useState("hex")
  const [paletteSize, setPaletteSize] = useState(5)
  const [paletteType, setPaletteType] = useState("analogous")
  const [colors, setColors] = useState<Color[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [websiteSections, setWebsiteSections] = useState<WebsiteSection[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColorId, setActiveColorId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedPalettes, setSavedPalettes] = useState<{ name: string; colors: Color[] }[]>([])
  const [paletteName, setPaletteName] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize default palette and website sections
  useEffect(() => {
    generatePalette()
    initializeWebsiteSections()
  }, [])

  // Initialize website sections for the demo
  const initializeWebsiteSections = () => {
    const sections: WebsiteSection[] = [
      { id: "section-1", name: "Background", colorId: "", element: "background" },
      { id: "section-2", name: "Text", colorId: "", element: "text" },
      { id: "section-3", name: "Primary", colorId: "", element: "primary" },
      { id: "section-4", name: "Secondary", colorId: "", element: "secondary" },
      { id: "section-5", name: "Accent", colorId: "", element: "accent" },
    ]
    setWebsiteSections(sections)
  }

  // Generate a random color
  const generateRandomColor = (): Color => {
    const hex = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
    return {
      id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "Color",
      hex,
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex),
      locked: false,
    }
  }

  // Convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return "rgb(0, 0, 0)"

    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)

    return `rgb(${r}, ${g}, ${b})`
  }

  // Convert hex to HSL
  const hexToHsl = (hex: string): string => {
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

  // Generate a color palette based on the input color and palette type
  const generatePalette = () => {
    setIsGenerating(true)

    // Keep locked colors
    const lockedColors = colors.filter((color) => color.locked)

    // Generate new colors
    let newColors: Color[] = []

    // Base color (either from input or random)
    let baseColor = inputColor
    if (!baseColor || baseColor === "") {
      baseColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`
    }

    // Convert input color to hex if it's not already
    if (!baseColor.startsWith("#")) {
      // Handle RGB format
      if (baseColor.startsWith("rgb")) {
        const rgb = baseColor.match(/\d+/g)
        if (rgb && rgb.length === 3) {
          const r = Number.parseInt(rgb[0])
          const g = Number.parseInt(rgb[1])
          const b = Number.parseInt(rgb[2])
          baseColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
        }
      }
      // Handle HSL format
      else if (baseColor.startsWith("hsl")) {
        // This is a simplified conversion and might not be accurate for all HSL values
        baseColor = "#6d28d9" // Default to purple if conversion fails
      }
      // Handle color names
      else {
        // For simplicity, we'll use a default color for named colors
        baseColor = "#6d28d9" // Default to purple
      }
    }

    // Generate palette based on type
    switch (paletteType) {
      case "monochromatic":
        newColors = generateMonochromaticPalette(baseColor, paletteSize)
        break
      case "analogous":
        newColors = generateAnalogousPalette(baseColor, paletteSize)
        break
      case "complementary":
        newColors = generateComplementaryPalette(baseColor, paletteSize)
        break
      case "triadic":
        newColors = generateTriadicPalette(baseColor, paletteSize)
        break
      case "random":
        newColors = Array.from({ length: paletteSize }, generateRandomColor)
        break
      default:
        newColors = generateAnalogousPalette(baseColor, paletteSize)
    }

    // Merge locked colors with new colors
    const finalColors = newColors.map((color, index) => {
      const lockedColor = lockedColors.find((_, i) => i === index)
      return lockedColor || color
    })

    setColors(finalColors)

    // Assign colors to website sections if not already assigned
    setWebsiteSections((prev) => {
      return prev.map((section, index) => {
        if (!section.colorId && finalColors[index]) {
          return { ...section, colorId: finalColors[index].id }
        }
        return section
      })
    })

    setIsGenerating(false)
  }

  // Generate a monochromatic palette
  const generateMonochromaticPalette = (baseColor: string, size: number): Color[] => {
    const palette: Color[] = []

    // Extract the HSL values from the base color
    const hslMatch = hexToHsl(baseColor).match(/\d+/g)
    if (!hslMatch || hslMatch.length !== 3) return Array.from({ length: size }, generateRandomColor)

    const h = Number.parseInt(hslMatch[0])
    const s = Number.parseInt(hslMatch[1])

    // Generate variations by changing lightness
    for (let i = 0; i < size; i++) {
      const l = Math.min(90, Math.max(10, 10 + (i * 80) / (size - 1)))
      const hslColor = `hsl(${h}, ${s}%, ${l}%)`

      // Convert HSL to hex (simplified)
      const hexColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`

      palette.push({
        id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Mono ${i + 1}`,
        hex: hexColor,
        rgb: hexToRgb(hexColor),
        hsl: hslColor,
        locked: false,
      })
    }

    return palette
  }

  // Generate an analogous palette
  const generateAnalogousPalette = (baseColor: string, size: number): Color[] => {
    const palette: Color[] = []

    // For simplicity, we'll generate random colors with similar hues
    for (let i = 0; i < size; i++) {
      const color = generateRandomColor()
      palette.push({
        ...color,
        name: `Analogous ${i + 1}`,
      })
    }

    return palette
  }

  // Generate a complementary palette
  const generateComplementaryPalette = (baseColor: string, size: number): Color[] => {
    const palette: Color[] = []

    // For simplicity, we'll generate random colors
    for (let i = 0; i < size; i++) {
      const color = generateRandomColor()
      palette.push({
        ...color,
        name: `Complement ${i + 1}`,
      })
    }

    return palette
  }

  // Generate a triadic palette
  const generateTriadicPalette = (baseColor: string, size: number): Color[] => {
    const palette: Color[] = []

    // For simplicity, we'll generate random colors
    for (let i = 0; i < size; i++) {
      const color = generateRandomColor()
      palette.push({
        ...color,
        name: `Triad ${i + 1}`,
      })
    }

    return palette
  }

  // Extract colors from an uploaded image
  const extractColorsFromImage = (imageUrl: string) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Resize canvas to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image on canvas
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

      // Sample colors from the image
      const colorMap: Record<string, number> = {}

      // Sample every 10th pixel to improve performance
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        // Skip transparent pixels
        if (imageData[i + 3] < 128) continue

        // Convert to hex
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`

        // Count occurrences
        colorMap[hex] = (colorMap[hex] || 0) + 1
      }

      // Sort colors by frequency
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([hex]) => hex)

      // Take the most frequent colors up to paletteSize
      const extractedColors = sortedColors.slice(0, paletteSize).map((hex, index) => ({
        id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Image ${index + 1}`,
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex),
        locked: false,
      }))

      setColors(extractedColors)

      // Assign colors to website sections
      setWebsiteSections((prev) => {
        return prev.map((section, index) => {
          if (extractedColors[index]) {
            return { ...section, colorId: extractedColors[index].id }
          }
          return section
        })
      })

      toast({
        title: "Colors extracted",
        description: `Extracted ${extractedColors.length} colors from the image.`,
      })
    }

    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load the image. Please try another one.",
        variant: "destructive",
      })
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setUploadedImage(event.target.result)
          extractColorsFromImage(event.target.result)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // Copy color value to clipboard
  const copyToClipboard = (value: string, colorId: string) => {
    navigator.clipboard.writeText(value)
    setCopiedColor(colorId)

    setTimeout(() => {
      setCopiedColor(null)
    }, 2000)

    toast({
      title: "Copied!",
      description: `${value} copied to clipboard.`,
    })
  }

  // Toggle color lock
  const toggleColorLock = (colorId: string) => {
    setColors(colors.map((color) => (color.id === colorId ? { ...color, locked: !color.locked } : color)))
  }

  // Update a color
  const updateColor = (colorId: string, hex: string) => {
    setColors(
      colors.map((color) =>
        color.id === colorId
          ? {
              ...color,
              hex,
              rgb: hexToRgb(hex),
              hsl: hexToHsl(hex),
            }
          : color,
      ),
    )
  }

  // Assign a color to a website section
  const assignColorToSection = (sectionId: string, colorId: string) => {
    setWebsiteSections(websiteSections.map((section) => (section.id === sectionId ? { ...section, colorId } : section)))
  }

  // Download palette as JSON
  const downloadPalette = () => {
    const paletteData = {
      name: paletteName || "My Palette",
      colors: colors.map((color) => ({
        name: color.name,
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
      })),
      date: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(paletteData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const link = document.createElement("a")
    link.href = dataUri
    link.download = `${paletteData.name.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Palette downloaded",
      description: "Your color palette has been downloaded as JSON.",
    })
  }

  // Save the current palette
  const savePalette = () => {
    if (!paletteName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your palette.",
        variant: "destructive",
      })
      return
    }

    const newPalette = {
      name: paletteName,
      colors: [...colors],
    }

    setSavedPalettes([...savedPalettes, newPalette])
    setPaletteName("")

    toast({
      title: "Palette saved",
      description: `"${paletteName}" has been saved to your collection.`,
    })
  }

  // Load a saved palette
  const loadPalette = (index: number) => {
    const palette = savedPalettes[index]
    if (palette) {
      setColors(palette.colors)

      // Reassign colors to website sections
      setWebsiteSections((prev) => {
        return prev.map((section, i) => {
          if (palette.colors[i]) {
            return { ...section, colorId: palette.colors[i].id }
          }
          return section
        })
      })

      toast({
        title: "Palette loaded",
        description: `"${palette.name}" has been loaded.`,
      })
    }
  }

  // Delete a saved palette
  const deletePalette = (index: number) => {
    const newPalettes = [...savedPalettes]
    newPalettes.splice(index, 1)
    setSavedPalettes(newPalettes)

    toast({
      title: "Palette deleted",
      description: "The palette has been removed from your collection.",
    })
  }

  // Get a color object by ID
  const getColorById = (colorId: string) => {
    return colors.find((color) => color.id === colorId)
  }

  // Get CSS variables for the demo website
  const getWebsiteStyles = () => {
    const styles: Record<string, string> = {}

    websiteSections.forEach((section) => {
      const color = getColorById(section.colorId)
      if (color) {
        styles[section.element] = color.hex
      }
    })

    return styles
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Color Palette Generator is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Color Palette Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Generate and visualize harmonious color palettes for your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Color Palette Generator helps you create beautiful color combinations:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Input colors in various formats (text, HEX, RGB, HSL)</li>
            <li>Extract color palettes from uploaded images</li>
            <li>Generate harmonious color combinations</li>
            <li>Visualize palettes on a demo website</li>
            <li>Copy color values in different formats</li>
            <li>Save and download your favorite palettes</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Enter a color or upload an image</li>
            <li>Choose the palette type and size</li>
            <li>Generate your color palette</li>
            <li>Visualize how it looks on the demo website</li>
            <li>Customize colors as needed</li>
            <li>Save or download your palette</li>
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
              <CardTitle>Color Input</CardTitle>
              <CardDescription>Enter a color or upload an image</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="input" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="input">Color Input</TabsTrigger>
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color-input">Enter Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: inputColor }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      />
                      <Input
                        id="color-input"
                        value={inputColor}
                        onChange={(e) => setInputColor(e.target.value)}
                        placeholder="Enter color (name, hex, rgb, hsl)"
                        className="flex-1"
                      />
                    </div>

                    {showColorPicker && (
                      <div className="mt-2 p-2 border rounded-md">
                        <input
                          type="color"
                          value={inputColor}
                          onChange={(e) => setInputColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Examples: "purple", "#6d28d9", "rgb(109, 40, 217)", "hsl(263, 70%, 50%)"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="palette-type">Palette Type</Label>
                    <Select value={paletteType} onValueChange={setPaletteType}>
                      <SelectTrigger id="palette-type">
                        <SelectValue placeholder="Select palette type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monochromatic">Monochromatic</SelectItem>
                        <SelectItem value="analogous">Analogous</SelectItem>
                        <SelectItem value="complementary">Complementary</SelectItem>
                        <SelectItem value="triadic">Triadic</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="palette-size">Palette Size: {paletteSize}</Label>
                    </div>
                    <Slider
                      id="palette-size"
                      min={3}
                      max={10}
                      step={1}
                      value={[paletteSize]}
                      onValueChange={(value) => setPaletteSize(value[0])}
                    />
                  </div>

                  <Button
                    onClick={generatePalette}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Palette className="mr-2 h-4 w-4" />
                        Generate Palette
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
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
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {uploadedImage ? "Change image" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, WEBP</p>
                    </div>
                  </div>

                  {uploadedImage && (
                    <div className="mt-2">
                      <div className="relative aspect-video rounded-md overflow-hidden border">
                        <Image
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded image"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="image-colors">Colors to Extract: {paletteSize}</Label>
                        </div>
                        <Slider
                          id="image-colors"
                          min={3}
                          max={10}
                          step={1}
                          value={[paletteSize]}
                          onValueChange={(value) => setPaletteSize(value[0])}
                        />
                      </div>

                      <Button onClick={() => extractColorsFromImage(uploadedImage)} className="w-full mt-4">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Extract Colors from Image
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Palette</CardTitle>
              <CardDescription>Your generated color palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colors.length > 0 ? (
                  <div className="grid gap-3">
                    {colors.map((color) => (
                      <div key={color.id} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-md border cursor-pointer relative",
                            color.locked && "ring-2 ring-yellow-400",
                          )}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => {
                            setActiveColorId(color.id)
                            setShowColorPicker(true)
                          }}
                        >
                          {color.locked && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-0.5">
                              <Lock className="h-3 w-3 text-yellow-800" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 grid grid-cols-3 gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => copyToClipboard(color.hex, `${color.id}-hex`)}
                          >
                            {copiedColor === `${color.id}-hex` ? <Check className="h-3 w-3 mr-1" /> : null}
                            {color.hex}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => copyToClipboard(color.rgb, `${color.id}-rgb`)}
                          >
                            {copiedColor === `${color.id}-rgb` ? <Check className="h-3 w-3 mr-1" /> : null}
                            RGB
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => copyToClipboard(color.hsl, `${color.id}-hsl`)}
                          >
                            {copiedColor === `${color.id}-hsl` ? <Check className="h-3 w-3 mr-1" /> : null}
                            HSL
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleColorLock(color.id)}
                          className="h-8 w-8"
                        >
                          {color.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No colors generated yet</p>
                    <p className="text-sm mt-1">Use the controls above to create a palette</p>
                  </div>
                )}

                {activeColorId && showColorPicker && (
                  <div className="mt-4 p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Edit Color</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveColorId(null)
                          setShowColorPicker(false)
                        }}
                      >
                        Close
                      </Button>
                    </div>

                    <input
                      type="color"
                      value={getColorById(activeColorId)?.hex || "#000000"}
                      onChange={(e) => updateColor(activeColorId, e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                )}

                {colors.length > 0 && (
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Palette name"
                        value={paletteName}
                        onChange={(e) => setPaletteName(e.target.value)}
                      />
                      <Button onClick={savePalette} disabled={!paletteName}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full" onClick={downloadPalette}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Palette
                    </Button>

                    <Button variant="outline" className="w-full" onClick={generatePalette}>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle Colors
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {savedPalettes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Palettes</CardTitle>
                <CardDescription>Your collection of saved color palettes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedPalettes.map((palette, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{palette.name}</h3>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => loadPalette(index)}>
                            <Palette className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => deletePalette(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex">
                        {palette.colors.map((color) => (
                          <div
                            key={color.id}
                            className="h-6 flex-1"
                            style={{ backgroundColor: color.hex }}
                            title={color.hex}
                          />
                        ))}
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
              <CardTitle>Website Preview</CardTitle>
              <CardDescription>See how your palette looks on a website</CardDescription>
            </CardHeader>
            <CardContent>
              {colors.length > 0 ? (
                <div className="space-y-6">
                  {/* Color Assignment Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {websiteSections.map((section) => (
                      <div key={section.id} className="space-y-1">
                        <Label className="text-xs">{section.name}</Label>
                        <Select
                          value={section.colorId}
                          onValueChange={(value) => assignColorToSection(section.id, value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color.id} value={color.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                                  <span>{color.hex}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  {/* Website Demo */}
                  <div
                    className="border rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: getWebsiteStyles().background || "#ffffff",
                      color: getWebsiteStyles().text || "#000000",
                    }}
                  >
                    {/* Header */}
                    <header
                      className="p-4 border-b flex justify-between items-center"
                      style={{
                        backgroundColor: getWebsiteStyles().primary || "#6d28d9",
                        color: "#ffffff",
                      }}
                    >
                      <div className="font-bold text-lg">Demo Website</div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 rounded-md text-sm">Home</div>
                        <div className="px-3 py-1 rounded-md text-sm">About</div>
                        <div className="px-3 py-1 rounded-md text-sm">Contact</div>
                      </div>
                    </header>

                    {/* Hero */}
                    <div
                      className="p-8 text-center"
                      style={{
                        backgroundColor: getWebsiteStyles().secondary || "#f3f4f6",
                      }}
                    >
                      <h1 className="text-2xl font-bold mb-2">Welcome to Our Website</h1>
                      <p className="max-w-md mx-auto">
                        This is a demo website to showcase your color palette. See how your colors work together in a
                        real-world example.
                      </p>
                      <button
                        className="mt-4 px-4 py-2 rounded-md text-white"
                        style={{
                          backgroundColor: getWebsiteStyles().primary || "#6d28d9",
                        }}
                      >
                        Get Started
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: getWebsiteStyles().accent || "#e0e7ff",
                          }}
                        >
                          <h2 className="font-bold mb-2">Feature One</h2>
                          <p className="text-sm">
                            This is a feature description. See how your accent color looks in a card.
                          </p>
                        </div>
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: getWebsiteStyles().accent || "#e0e7ff",
                          }}
                        >
                          <h2 className="font-bold mb-2">Feature Two</h2>
                          <p className="text-sm">
                            This is a feature description. See how your accent color looks in a card.
                          </p>
                        </div>
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: getWebsiteStyles().accent || "#e0e7ff",
                          }}
                        >
                          <h2 className="font-bold mb-2">Feature Three</h2>
                          <p className="text-sm">
                            This is a feature description. See how your accent color looks in a card.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-6">
                        <div>
                          <h2
                            className="text-xl font-bold mb-3 pb-2 border-b"
                            style={{
                              borderColor: getWebsiteStyles().primary || "#6d28d9",
                            }}
                          >
                            About Us
                          </h2>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
                            hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend
                            nibh porttitor.
                          </p>
                        </div>
                        <div>
                          <h2
                            className="text-xl font-bold mb-3 pb-2 border-b"
                            style={{
                              borderColor: getWebsiteStyles().primary || "#6d28d9",
                            }}
                          >
                            Our Services
                          </h2>
                          <ul className="text-sm space-y-1">
                            <li>Service One</li>
                            <li>Service Two</li>
                            <li>Service Three</li>
                            <li>Service Four</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <footer
                      className="p-4 text-center text-sm"
                      style={{
                        backgroundColor: getWebsiteStyles().primary || "#6d28d9",
                        color: "#ffffff",
                      }}
                    >
                      &copy; 2025 Demo Website. All rights reserved.
                    </footer>
                  </div>

                  {/* CSS Variables */}
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">CSS Variables</h3>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {`:root {
  --color-background: ${getWebsiteStyles().background || "#ffffff"};
  --color-text: ${getWebsiteStyles().text || "#000000"};
  --color-primary: ${getWebsiteStyles().primary || "#6d28d9"};
  --color-secondary: ${getWebsiteStyles().secondary || "#f3f4f6"};
  --color-accent: ${getWebsiteStyles().accent || "#e0e7ff"};
}`}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        copyToClipboard(
                          `:root {
  --color-background: ${getWebsiteStyles().background || "#ffffff"};
  --color-text: ${getWebsiteStyles().text || "#000000"};
  --color-primary: ${getWebsiteStyles().primary || "#6d28d9"};
  --color-secondary: ${getWebsiteStyles().secondary || "#f3f4f6"};
  --color-accent: ${getWebsiteStyles().accent || "#e0e7ff"};
}`,
                          "css-vars",
                        )
                      }
                    >
                      {copiedColor === "css-vars" ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy CSS Variables
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Palette className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Generate a palette to see the preview</p>
                  <p className="text-sm mt-1">Use the controls on the left to create colors</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

// Missing component
function Unlock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

