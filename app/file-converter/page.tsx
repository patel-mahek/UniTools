"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload, Download, FileSpreadsheet, Table } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DataGrid } from "react-data-grid"
import * as XLSX from "xlsx"
import "react-data-grid/lib/styles.css"

// Define the type for our data
type RowData = Record<string, string | number | boolean | null>

export default function FileConverterPage() {
  // File conversion state
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>("csv")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // File editing state
  const [gridData, setGridData] = useState<{ rows: RowData[]; columns: { key: string; name: string }[] }>({
    rows: [],
    columns: [],
  })
  const [fileName, setFileName] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")

  // Handle file selection for conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase()

      if ([".csv", ".xlsx", ".xls"].includes(fileExtension)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Only .csv, .xlsx, or .xls files are allowed")
      }
    }
  }

  // Handle file selection for editing
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase()

      if ([".csv", ".xlsx", ".xls"].includes(fileExtension)) {
        setFileName(selectedFile.name)
        setFileType(fileExtension)
        loadFileForEditing(selectedFile)
      } else {
        setError("Only .csv, .xlsx, or .xls files are allowed for editing")
      }
    }
  }

  // Load file data for editing
  const loadFileForEditing = (file: File) => {
    setLoading(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<RowData>(worksheet)

        // Create columns from the first row
        const columns = Object.keys(jsonData[0] || {}).map((key) => ({
          key,
          name: key,
          resizable: true,
          sortable: true,
          editable: true,
        }))

        setGridData({
          rows: jsonData,
          columns,
        })

        setLoading(false)
      } catch (err) {
        setError("Failed to parse file. Please check the file format.")
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError("Failed to read file")
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  // Handle cell changes in the data grid
  const handleRowsChange = useCallback((newRows: RowData[]) => {
    setGridData((prevState) => ({
      ...prevState,
      rows: newRows,
    }))
  }, [])

  // Convert and download file
  const handleConvert = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Read the file
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]

          let outputData: Blob
          let outputFileName = file.name.substring(0, file.name.lastIndexOf("."))

          // Convert to target format
          switch (targetFormat) {
            case "csv":
              const csvData = XLSX.utils.sheet_to_csv(worksheet)
              outputData = new Blob([csvData], { type: "text/csv" })
              outputFileName += ".csv"
              break

            case "excel":
              const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
              outputData = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
              outputFileName += ".xlsx"
              break

            case "json":
              const jsonData = XLSX.utils.sheet_to_json(worksheet)
              outputData = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
              outputFileName += ".json"
              break

            default:
              throw new Error("Invalid target format")
          }

          // Create download link and trigger download
          const url = URL.createObjectURL(outputData)
          const a = document.createElement("a")
          a.href = url
          a.download = outputFileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          setSuccess(`File successfully converted to ${targetFormat.toUpperCase()}`)
          setLoading(false)
        } catch (err) {
          setError("Failed to convert file. Please check the file format.")
          setLoading(false)
        }
      }

      reader.onerror = () => {
        setError("Failed to read file")
        setLoading(false)
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  // Save edited file
  const handleSaveFile = (format: "csv" | "xlsx") => {
    if (gridData.rows.length === 0) {
      setError("No data to save")
      return
    }

    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(gridData.rows)
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

      let outputData: Blob
      let outputFileName = fileName.substring(0, fileName.lastIndexOf("."))

      if (format === "csv") {
        const csvData = XLSX.utils.sheet_to_csv(worksheet)
        outputData = new Blob([csvData], { type: "text/csv" })
        outputFileName += ".csv"
      } else {
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
        outputData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        outputFileName += ".xlsx"
      }

      // Create download link and trigger download
      const url = URL.createObjectURL(outputData)
      const a = document.createElement("a")
      a.href = url
      a.download = outputFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess(`File successfully saved as ${format.toUpperCase()}`)
    } catch (err) {
      setError("Failed to save file")
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
        <h1 className="text-3xl font-bold">File Converter & Editor</h1>
      </div>

      <Tabs defaultValue="convert" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="convert">Convert Files</TabsTrigger>
          <TabsTrigger value="edit">Edit Spreadsheets</TabsTrigger>
        </TabsList>

        {/* File Conversion Tab */}
        <TabsContent value="convert">
          <Card>
            <CardHeader>
              <CardTitle>Convert File Format</CardTitle>
              <CardDescription>
                Upload a file in .csv, .xlsx, or .xls format and convert it to another format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Only .csv, .xlsx, or .xls files are allowed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-format">Target Format</Label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger id="target-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
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
        </TabsContent>

        {/* File Editing Tab */}
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Spreadsheet</CardTitle>
              <CardDescription>
                Open a spreadsheet file, edit it in the browser, and save it in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-file-upload">Open File</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <input
                      ref={editFileInputRef}
                      id="edit-file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleEditFileChange}
                      className="hidden"
                    />
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{fileName || "Click to open a spreadsheet file"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Only .csv, .xlsx, or .xls files are allowed</p>
                  </div>
                </div>

                {gridData.rows.length > 0 && (
                  <>
                    <div className="border rounded-md overflow-hidden">
                      <div className="h-[400px]">
                        <DataGrid
                          columns={gridData.columns}
                          rows={gridData.rows}
                          onRowsChange={handleRowsChange}
                          className="rdg-light"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={() => handleSaveFile("csv")} className="flex-1">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Save as CSV
                      </Button>
                      <Button onClick={() => handleSaveFile("xlsx")} className="flex-1">
                        <Table className="mr-2 h-4 w-4" />
                        Save as Excel
                      </Button>
                    </div>
                  </>
                )}

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

                {!gridData.rows.length && !loading && !error && fileName && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Table className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No data found in the file or the file is empty.</p>
                  </div>
                )}

                {loading && (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading spreadsheet data...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

