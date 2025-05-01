"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Check, Download, Plus, Minus, Trash, Grid, AlignJustify } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function CSSLayoutVisualizerPage() {
  const { isAuthenticated } = useAuth()
  const [layoutType, setLayoutType] = useState<"grid" | "flexbox">("grid")
  const [gridItems, setGridItems] = useState(9)
  const [gridColumns, setGridColumns] = useState(3)
  const [gridRows, setGridRows] = useState(3)
  const [gridGap, setGridGap] = useState(10)
  const [flexDirection, setFlexDirection] = useState<"row" | "column" | "row-reverse" | "column-reverse">("row")
  const [flexWrap, setFlexWrap] = useState<"nowrap" | "wrap" | "wrap-reverse">("wrap")
  const [justifyContent, setJustifyContent] = useState<string>("space-between")
  const [alignItems, setAlignItems] = useState<string>("center")
  const [cssCode, setCssCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [showNumbers, setShowNumbers] = useState(true)
  const [itemWidth, setItemWidth] = useState(100)
  const [itemHeight, setItemHeight] = useState(100)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [itemProperties, setItemProperties] = useState<Record<number, any>>({})

  // Generate CSS code based on current settings
  const generateCSSCode = () => {
    let code = ""

    if (layoutType === "grid") {
      code = `.container {
  display: grid;
  grid-template-columns: repeat(${gridColumns}, 1fr);
  grid-template-rows: repeat(${gridRows}, 1fr);
  gap: ${gridGap}px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.item {
  background-color: #4f46e5;
  color: white;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}`
    } else {
      code = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  flex-wrap: ${flexWrap};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.item {
  background-color: #4f46e5;
  color: white;
  border-radius: 4px;
  padding: 20px;
  margin: 5px;
  width: ${itemWidth}px;
  height: ${itemHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}`
    }

    // Add custom item properties
    Object.entries(itemProperties).forEach(([itemIndex, props]) => {
      if (props) {
        code += `\n\n.item:nth-child(${Number.parseInt(itemIndex) + 1}) {`

        if (layoutType === "grid" && props.gridArea) {
          code += `\n  grid-area: ${props.gridArea};`
        }

        if (props.backgroundColor) {
          code += `\n  background-color: ${props.backgroundColor};`
        }

        if (props.order !== undefined) {
          code += `\n  order: ${props.order};`
        }

        if (layoutType === "flexbox" && props.flexGrow !== undefined) {
          code += `\n  flex-grow: ${props.flexGrow};`
        }

        if (layoutType === "flexbox" && props.flexShrink !== undefined) {
          code += `\n  flex-shrink: ${props.flexShrink};`
        }

        code += `\n}`
      }
    })

    setCssCode(code)
    return code
  }

  // Copy CSS code to clipboard
  const copyToClipboard = () => {
    const code = generateCSSCode()
    navigator.clipboard.writeText(code)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Copied!",
      description: "CSS code copied to clipboard.",
    })
  }

  // Download CSS code as file
  const downloadCSSCode = () => {
    const code = generateCSSCode()
    const blob = new Blob([code], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${layoutType}-layout.css`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: `CSS code has been downloaded as ${layoutType}-layout.css`,
    })
  }

  // Add or remove grid items
  const updateGridItems = (count: number) => {
    if (count < 1) count = 1
    if (count > 20) count = 20
    setGridItems(count)
  }

  // Update item property
  const updateItemProperty = (itemIndex: number, property: string, value: any) => {
    setItemProperties((prev) => ({
      ...prev,
      [itemIndex]: {
        ...(prev[itemIndex] || {}),
        [property]: value,
      },
    }))
  }

  // Reset item properties
  const resetItemProperties = (itemIndex: number) => {
    setItemProperties((prev) => {
      const newProps = { ...prev }
      delete newProps[itemIndex]
      return newProps
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">CSS Grid/Flexbox Visualizer is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">CSS Grid/Flexbox Visualizer</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Visualize and experiment with CSS Grid and Flexbox layouts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The CSS Layout Visualizer helps you understand and create complex layouts:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Experiment with CSS Grid and Flexbox properties</li>
            <li>Visualize how different settings affect your layout</li>
            <li>Customize individual grid/flex items</li>
            <li>Generate and copy CSS code for your layouts</li>
            <li>Download ready-to-use CSS files</li>
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
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure your CSS layout</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={layoutType} onValueChange={(value) => setLayoutType(value as "grid" | "flexbox")}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="grid">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="flexbox">
                    <AlignJustify className="h-4 w-4 mr-2" />
                    Flexbox
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="grid-columns">Columns: {gridColumns}</Label>
                    </div>
                    <Slider
                      id="grid-columns"
                      min={1}
                      max={6}
                      step={1}
                      value={[gridColumns]}
                      onValueChange={(value) => setGridColumns(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="grid-rows">Rows: {gridRows}</Label>
                    </div>
                    <Slider
                      id="grid-rows"
                      min={1}
                      max={6}
                      step={1}
                      value={[gridRows]}
                      onValueChange={(value) => setGridRows(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="grid-gap">Gap: {gridGap}px</Label>
                    </div>
                    <Slider
                      id="grid-gap"
                      min={0}
                      max={40}
                      step={1}
                      value={[gridGap]}
                      onValueChange={(value) => setGridGap(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Grid Items</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateGridItems(gridItems - 1)}
                        disabled={gridItems <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={gridItems}
                        onChange={(e) => updateGridItems(Number.parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateGridItems(gridItems + 1)}
                        disabled={gridItems >= 20}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="show-numbers" checked={showNumbers} onCheckedChange={setShowNumbers} />
                    <Label htmlFor="show-numbers">Show Item Numbers</Label>
                  </div>
                </TabsContent>

                <TabsContent value="flexbox" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flex-direction">Flex Direction</Label>
                    <Select value={flexDirection} onValueChange={(value) => setFlexDirection(value as any)}>
                      <SelectTrigger id="flex-direction">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Row</SelectItem>
                        <SelectItem value="column">Column</SelectItem>
                        <SelectItem value="row-reverse">Row Reverse</SelectItem>
                        <SelectItem value="column-reverse">Column Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flex-wrap">Flex Wrap</Label>
                    <Select value={flexWrap} onValueChange={(value) => setFlexWrap(value as any)}>
                      <SelectTrigger id="flex-wrap">
                        <SelectValue placeholder="Select wrap" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nowrap">No Wrap</SelectItem>
                        <SelectItem value="wrap">Wrap</SelectItem>
                        <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justify-content">Justify Content</Label>
                    <Select value={justifyContent} onValueChange={setJustifyContent}>
                      <SelectTrigger id="justify-content">
                        <SelectValue placeholder="Select justify content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                        <SelectItem value="space-evenly">Space Evenly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="align-items">Align Items</Label>
                    <Select value={alignItems} onValueChange={setAlignItems}>
                      <SelectTrigger id="align-items">
                        <SelectValue placeholder="Select align items" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="stretch">Stretch</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="item-width">Item Width: {itemWidth}px</Label>
                    </div>
                    <Slider
                      id="item-width"
                      min={50}
                      max={200}
                      step={10}
                      value={[itemWidth]}
                      onValueChange={(value) => setItemWidth(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="item-height">Item Height: {itemHeight}px</Label>
                    </div>
                    <Slider
                      id="item-height"
                      min={50}
                      max={200}
                      step={10}
                      value={[itemHeight]}
                      onValueChange={(value) => setItemHeight(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Flex Items</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateGridItems(gridItems - 1)}
                        disabled={gridItems <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={gridItems}
                        onChange={(e) => updateGridItems(Number.parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateGridItems(gridItems + 1)}
                        disabled={gridItems >= 20}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="show-numbers" checked={showNumbers} onCheckedChange={setShowNumbers} />
                    <Label htmlFor="show-numbers">Show Item Numbers</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {selectedItem !== null && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Item {selectedItem + 1} Properties</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      resetItemProperties(selectedItem)
                      setSelectedItem(null)
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Customize the selected item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <div
                      className="w-10 h-10 rounded-md border cursor-pointer"
                      style={{
                        backgroundColor: itemProperties[selectedItem]?.backgroundColor || "#4f46e5",
                      }}
                    >
                      <input
                        type="color"
                        value={itemProperties[selectedItem]?.backgroundColor || "#4f46e5"}
                        onChange={(e) => updateItemProperty(selectedItem, "backgroundColor", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                      id="item-bg-color"
                      value={itemProperties[selectedItem]?.backgroundColor || "#4f46e5"}
                      onChange={(e) => updateItemProperty(selectedItem, "backgroundColor", e.target.value)}
                    />
                  </div>
                </div>

                {layoutType === "grid" && (
                  <div className="space-y-2">
                    <Label htmlFor="grid-area">Grid Area (e.g., "1 / 1 / 3 / 3")</Label>
                    <Input
                      id="grid-area"
                      placeholder="row-start / col-start / row-end / col-end"
                      value={itemProperties[selectedItem]?.gridArea || ""}
                      onChange={(e) => updateItemProperty(selectedItem, "gridArea", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="item-order">Order</Label>
                  <Input
                    id="item-order"
                    type="number"
                    placeholder="0"
                    value={itemProperties[selectedItem]?.order !== undefined ? itemProperties[selectedItem].order : ""}
                    onChange={(e) =>
                      updateItemProperty(
                        selectedItem,
                        "order",
                        e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                {layoutType === "flexbox" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="flex-grow">Flex Grow</Label>
                      <Input
                        id="flex-grow"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={
                          itemProperties[selectedItem]?.flexGrow !== undefined
                            ? itemProperties[selectedItem].flexGrow
                            : ""
                        }
                        onChange={(e) =>
                          updateItemProperty(
                            selectedItem,
                            "flexGrow",
                            e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flex-shrink">Flex Shrink</Label>
                      <Input
                        id="flex-shrink"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="1"
                        value={
                          itemProperties[selectedItem]?.flexShrink !== undefined
                            ? itemProperties[selectedItem].flexShrink
                            : ""
                        }
                        onChange={(e) =>
                          updateItemProperty(
                            selectedItem,
                            "flexShrink",
                            e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </>
                )}

                <Button variant="outline" className="w-full" onClick={() => setSelectedItem(null)}>
                  Done
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>CSS Code</CardTitle>
              <CardDescription>Generated CSS for your layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea className="font-mono text-sm h-[200px]" value={cssCode} readOnly />
                <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={downloadCSSCode} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSS
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Preview</CardTitle>
              <CardDescription>{layoutType === "grid" ? "CSS Grid" : "Flexbox"} layout visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div
                  className="container"
                  style={{
                    display: layoutType === "grid" ? "grid" : "flex",
                    gridTemplateColumns: layoutType === "grid" ? `repeat(${gridColumns}, 1fr)` : undefined,
                    gridTemplateRows: layoutType === "grid" ? `repeat(${gridRows}, 1fr)` : undefined,
                    gap: layoutType === "grid" ? `${gridGap}px` : undefined,
                    flexDirection: layoutType === "flexbox" ? flexDirection : undefined,
                    flexWrap: layoutType === "flexbox" ? flexWrap : undefined,
                    justifyContent: layoutType === "flexbox" ? justifyContent : undefined,
                    alignItems: layoutType === "flexbox" ? alignItems : undefined,
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    minHeight: "400px",
                  }}
                >
                  {Array.from({ length: gridItems }).map((_, index) => (
                    <div
                      key={index}
                      className="item"
                      style={{
                        backgroundColor: itemProperties[index]?.backgroundColor || "#4f46e5",
                        color: "white",
                        borderRadius: "4px",
                        padding: "20px",
                        margin: layoutType === "flexbox" ? "5px" : undefined,
                        width: layoutType === "flexbox" ? `${itemWidth}px` : undefined,
                        height: layoutType === "flexbox" ? `${itemHeight}px` : undefined,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        gridArea:
                          layoutType === "grid" && itemProperties[index]?.gridArea
                            ? itemProperties[index].gridArea
                            : undefined,
                        order: itemProperties[index]?.order,
                        flexGrow:
                          layoutType === "flexbox" && itemProperties[index]?.flexGrow !== undefined
                            ? itemProperties[index].flexGrow
                            : undefined,
                        flexShrink:
                          layoutType === "flexbox" && itemProperties[index]?.flexShrink !== undefined
                            ? itemProperties[index].flexShrink
                            : undefined,
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedItem(index)}
                    >
                      {showNumbers && index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-lg">Layout Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {layoutType === "grid" ? (
                    <>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-2">Grid Template Areas</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          Select an item and set its grid area to span multiple cells.
                        </p>
                        <p className="text-sm text-blue-700">
                          Example: "1 / 1 / 3 / 3" spans from row 1, column 1 to row 3, column 3.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <h4 className="font-medium text-green-700 mb-2">Grid Auto Flow</h4>
                        <p className="text-sm text-green-700">
                          Items automatically flow into the grid based on their order and available space. Try changing
                          the number of columns and rows to see how items reflow.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-2">Flex Grow & Shrink</h4>
                        <p className="text-sm text-blue-700">
                          Select an item to set its flex-grow and flex-shrink properties. Flex-grow determines how much
                          an item can grow relative to others.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <h4 className="font-medium text-green-700 mb-2">Item Order</h4>
                        <p className="text-sm text-green-700">
                          Change the visual order of items without changing the HTML structure. Select an item and set
                          its order property.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

