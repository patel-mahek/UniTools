"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Upload,
  Download,
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Table,
  RefreshCw,
  Palette,
  Settings,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function DataVisualizerPage() {
  const { isAuthenticated } = useAuth()
  const [csvData, setCsvData] = useState("")
  const [parsedData, setParsedData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [chartType, setChartType] = useState("bar")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [chartTitle, setChartTitle] = useState("Data Visualization")
  const [chartColors, setChartColors] = useState(["#4f46e5", "#06b6d4", "#8b5cf6", "#ec4899", "#f97316"])
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasData, setHasData] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample data for demonstration
  const sampleData = `Country,Population,GDP,Life Expectancy,Literacy Rate
United States,331002651,21433225,78.9,99
China,1439323776,14342903,76.9,96.8
India,1380004385,2875142,69.7,74.4
Japan,126476461,5081770,84.6,99
Germany,83783942,3845630,81.2,99
United Kingdom,67886011,2827113,81.3,99
France,65273511,2715518,82.5,99
Italy,60461826,1885432,82.4,99.2
Brazil,212559417,1839758,75.9,93.2
Canada,37742154,1736425,82.3,99`

  // Parse CSV data
  const parseCSV = (csv: string) => {
    try {
      setIsProcessing(true)

      // Split by lines and remove empty lines
      const lines = csv.split("\n").filter((line) => line.trim() !== "")

      if (lines.length === 0) {
        throw new Error("No data found in CSV")
      }

      // Extract headers
      const headerLine = lines[0]
      const extractedHeaders = headerLine.split(",").map((header) => header.trim())
      setHeaders(extractedHeaders)

      // Parse data rows
      const data = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",")
        if (values.length === extractedHeaders.length) {
          const row: Record<string, any> = {}
          extractedHeaders.forEach((header, index) => {
            // Try to convert to number if possible
            const value = values[index].trim()
            row[header] = isNaN(Number(value)) ? value : Number(value)
          })
          data.push(row)
        }
      }

      setParsedData(data)

      // Set default axes if not already set
      if (!xAxis && extractedHeaders.length > 0) {
        setXAxis(extractedHeaders[0])
      }

      if (!yAxis && extractedHeaders.length > 1) {
        setYAxis(extractedHeaders[1])
      }

      setHasData(true)

      toast({
        title: "Data Parsed Successfully",
        description: `Loaded ${data.length} rows of data with ${extractedHeaders.length} columns.`,
      })
    } catch (error) {
      toast({
        title: "Error Parsing CSV",
        description: error instanceof Error ? error.message : "Failed to parse CSV data",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Load sample data
  const loadSampleData = () => {
    setCsvData(sampleData)
    parseCSV(sampleData)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCsvData(content)
      parseCSV(content)
    }
    reader.readAsText(file)
  }

  // Generate chart component based on type and data
  const renderChart = () => {
    if (!hasData || !xAxis || !yAxis) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg border">
          <BarChart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">No data to visualize</p>
          <p className="text-gray-400 text-sm mt-2">Upload a CSV file or use sample data</p>
        </div>
      )
    }

    // In a real implementation, this would use a charting library like Chart.js or Recharts
    // For this demo, we'll show a placeholder with chart information
    return (
      <div className="relative h-[400px] bg-white rounded-lg border p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">{chartTitle}</p>
            <p className="text-sm text-gray-500 mb-4">
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart visualization
            </p>

            {chartType === "bar" && <BarChart className="h-12 w-12 mx-auto mb-4 text-purple-600" />}
            {chartType === "line" && <LineChart className="h-12 w-12 mx-auto mb-4 text-purple-600" />}
            {chartType === "pie" && <PieChart className="h-12 w-12 mx-auto mb-4 text-purple-600" />}
            {chartType === "area" && <AreaChart className="h-12 w-12 mx-auto mb-4 text-purple-600" />}

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
              <div>
                <p className="text-sm font-medium">X-Axis:</p>
                <p className="text-sm text-gray-600">{xAxis}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Y-Axis:</p>
                <p className="text-sm text-gray-600">{yAxis}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data Points:</p>
                <p className="text-sm text-gray-600">{parsedData.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Legend:</p>
                <p className="text-sm text-gray-600">{showLegend ? "Visible" : "Hidden"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {chartColors.map((color, index) => (
            <div key={index} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
          ))}
        </div>
      </div>
    )
  }

  // Download chart as image
  const downloadChart = () => {
    // In a real implementation, this would convert the chart to an image
    // For this demo, we'll just show a toast
    toast({
      title: "Download Started",
      description: `Your ${chartType} chart has been downloaded as PNG.`,
    })
  }

  // Export data as CSV
  const exportData = () => {
    if (!hasData) {
      toast({
        title: "No Data",
        description: "There is no data to export.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...parsedData.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "exported_data.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Your data has been exported as CSV.",
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Data Visualization is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Data Visualization</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Generate charts and graphs from CSV data</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Data Visualization tool helps you create visual representations of your data:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Upload CSV files or paste CSV data directly</li>
            <li>Generate various chart types (bar, line, pie, area)</li>
            <li>Customize chart appearance and settings</li>
            <li>Download charts as images for presentations</li>
            <li>Export processed data for further analysis</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Data Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Input</CardTitle>
              <CardDescription>Upload or paste CSV data</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paste">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="paste">Paste Data</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4">
                  <Textarea
                    placeholder="Paste your CSV data here..."
                    className="h-[200px] font-mono text-sm"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => parseCSV(csvData)}
                      disabled={!csvData.trim() || isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Parse Data"
                      )}
                    </Button>
                    <Button variant="outline" onClick={loadSampleData} className="flex-1">
                      Load Sample
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">Upload a CSV file</p>
                    <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to browse</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Select File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {hasData && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Data Preview</h3>
                  <div className="bg-gray-50 rounded-md p-2 overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr>
                          {headers.slice(0, 5).map((header, index) => (
                            <th key={index} className="px-2 py-1 text-left font-medium">
                              {header}
                            </th>
                          ))}
                          {headers.length > 5 && <th className="px-2 py-1 text-left font-medium">...</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 3).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {headers.slice(0, 5).map((header, colIndex) => (
                              <td key={colIndex} className="px-2 py-1 border-t">
                                {row[header]}
                              </td>
                            ))}
                            {headers.length > 5 && <td className="px-2 py-1 border-t">...</td>}
                          </tr>
                        ))}
                        {parsedData.length > 3 && (
                          <tr>
                            <td colSpan={Math.min(headers.length, 6)} className="px-2 py-1 text-center text-gray-500">
                              ... {parsedData.length - 3} more rows
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {hasData && (
            <Card>
              <CardHeader>
                <CardTitle>Chart Settings</CardTitle>
                <CardDescription>Configure your visualization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger id="chart-type">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="x-axis">X-Axis</Label>
                  <Select value={xAxis} onValueChange={setXAxis}>
                    <SelectTrigger id="x-axis">
                      <SelectValue placeholder="Select X-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="y-axis">Y-Axis</Label>
                  <Select value={yAxis} onValueChange={setYAxis}>
                    <SelectTrigger id="y-axis">
                      <SelectValue placeholder="Select Y-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-title">Chart Title</Label>
                  <Input
                    id="chart-title"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="show-legend" checked={showLegend} onCheckedChange={setShowLegend} />
                  <Label htmlFor="show-legend">Show Legend</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  <Label htmlFor="show-grid">Show Grid</Label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Visualization</CardTitle>
                  <CardDescription>Chart preview</CardDescription>
                </div>
                {hasData && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={downloadChart}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {renderChart()}

              {hasData && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">Data Insights</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>
                        <span className="font-medium">Total Records:</span> {parsedData.length}
                      </li>
                      {yAxis && typeof parsedData[0]?.[yAxis] === "number" && (
                        <>
                          <li>
                            <span className="font-medium">Average {yAxis}:</span>{" "}
                            {(parsedData.reduce((sum, row) => sum + row[yAxis], 0) / parsedData.length).toFixed(2)}
                          </li>
                          <li>
                            <span className="font-medium">Max {yAxis}:</span>{" "}
                            {Math.max(...parsedData.map((row) => row[yAxis]))}
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-700 mb-2">Export Options</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={exportData}>
                        <Table className="h-4 w-4 mr-2" />
                        Export as CSV
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Palette className="h-4 w-4 mr-2" />
                        Customize Colors
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

