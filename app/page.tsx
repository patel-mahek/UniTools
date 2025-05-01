"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import Link from "next/link"
import {
  FileText,
  Calculator,
  Code,
  FileSpreadsheet,
  QrCode,
  Lock,
  Mic,
  Volume2,
  Palette,
  BookOpen,
  Globe,
  Database,
  Clock,
  Key,
  BarChart,
  Layout,
  ImageIcon,
  FileAudio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useAuth } from "@/contexts/auth-context"

declare global {
  interface Window {
    scrollToUiUx?: () => void;
    scrollToWebDev?: () => void;
    scrollToBackend?: () => void;
    scrollToDataAnalytics?: () => void;
  }
}


export default function Home() {
  const { isAuthenticated, login, user } = useAuth()

  // Refs for scrolling to sections
  const uiUxRef = useRef<HTMLDivElement>(null)
  const webDevRef = useRef<HTMLDivElement>(null)
  const backendRef = useRef<HTMLDivElement>(null)
  const dataAnalyticsRef = useRef<HTMLDivElement>(null)

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Make scrollToSection available globally for navbar
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollToUiUx = () => scrollToSection(uiUxRef)
      window.scrollToWebDev = () => scrollToSection(webDevRef)
      window.scrollToBackend = () => scrollToSection(backendRef)
      window.scrollToDataAnalytics = () => scrollToSection(dataAnalyticsRef)
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.scrollToUiUx
        delete window.scrollToWebDev
        delete window.scrollToBackend
        delete window.scrollToDataAnalytics
      }
    }
  }, [])

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          UniTools
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your all-in-one platform for developer productivity tools. Simplify your workflow with our collection of
          powerful utilities designed to save time and boost efficiency.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          {isAuthenticated ? (
            <div className="text-center">
              <p className="mb-4">
                Welcome back,{" "}
                <span className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </span>
                !
              </p>
            </div>
          ) : (
            <>
              <Button size="lg" onClick={login}>
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Explore Premium
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Premium Features Section (only visible when logged in) */}
      {isAuthenticated && (
        <div className="space-y-16">
          {/* Data & Analytics Tools */}
          <div ref={dataAnalyticsRef} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Data & Analytics Tools</h2>
              <p className="text-muted-foreground mt-2">Transform and analyze data with powerful utilities</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              

              <Link href="/speech-to-text">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Mic className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Speech to Text</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Convert spoken words to written text with high accuracy. Perfect for transcribing meetings,
                        lectures, and interviews.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/text-to-speech">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Volume2 className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Text to Speech</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Transform written content into natural-sounding speech with multiple voices and languages to
                        choose from.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* <Link href="/data-visualizer">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <BarChart className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Data Visualization</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Generate interactive charts and graphs from CSV data. Visualize trends and patterns with
                        customizable chart types.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link> */}
            </div>
          </div>

          {/* UI/UX Design Tools */}
          <div ref={uiUxRef} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Layout className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">UI/UX Design Tools</h2>
              <p className="text-muted-foreground mt-2">Creative tools to enhance your design workflow</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/color-palette-generator">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Palette className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Color Palette Generator</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create beautiful color palettes for your projects. Extract colors from images and visualize them
                        on a demo website.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/color-selector">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Palette className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Color Selector</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create custom color gradients with multiple color stops. Copy color codes in various formats and
                        generate CSS.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/background-generator">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <ImageIcon className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Background Generator</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create beautiful backgrounds with custom colors and patterns. Add emoji doodles and download in
                        various formats.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blob-generator">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Palette className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Blob Generator</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Generate customizable blob shapes for modern UI designs. Adjust complexity, color, and download
                        as SVG.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/css-layout-visualizer">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Layout className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">CSS Grid/Flexbox Visualizer</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Visualize and experiment with CSS Grid and Flexbox layouts. Generate code for complex responsive
                        designs.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Web Development Tools */}
          <div ref={webDevRef} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Code className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Web Development Tools</h2>
              <p className="text-muted-foreground mt-2">Essential utilities for full-stack developers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/code-preview">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Code className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">HTML/CSS/JS Preview</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Preview HTML, CSS, and JavaScript code in real-time. Perfect for testing and debugging front-end
                        code snippets.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/code-formatter">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Code className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Advanced Code Formatter</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Format code with customizable rules like Prettier. Supports multiple languages and configuration
                        options.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/code-beautifier">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Code className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Code Formatter</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Format and beautify your code with proper indentation. Supports HTML, CSS, JavaScript, and
                        Python.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tech-stack-advisor">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <BookOpen className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Tech Stack Advisor</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Discover the technologies you need to learn for different development domains. Get personalized
                        learning paths.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/file-converter">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <FileSpreadsheet className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">File Converter</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Convert spreadsheet files between formats. Transform CSV to Excel, JSON, and more with an
                        interactive editor.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Backend Development Tools */}
          <div ref={backendRef} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Backend Development Tools</h2>
              <p className="text-muted-foreground mt-2">Powerful utilities for server-side developers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/sql-formatter">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Database className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">SQL Formatter</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Format SQL queries with proper indentation and syntax highlighting. Upload SQL files and
                        download the formatted results.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/cron-builder">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Cron Expression Builder</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create and validate cron expressions with an intuitive visual interface. Perfect for scheduling
                        backend jobs.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/token-generator">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Key className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Token Generator</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Generate secure authentication tokens like JWT and API keys. Also includes text tokenization for
                        natural language processing.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/networking-utilities">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <Globe className="h-8 w-8 mr-3 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Networking Utilities</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Essential networking tools including DNS lookup, ping, traceroute, and port scanning for network
                        diagnostics.
                      </p>
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block">
                        Premium Feature
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Tools Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Featured Tools</h2>
          <p className="text-muted-foreground mt-2">Discover our most popular developer tools</p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Free Version
                        </div>
                        <Link href="/validator" className="block">
                          <div className="flex items-center mb-2">
                            <FileText className="h-8 w-8 mr-3 text-purple-600" />
                            <h2 className="text-2xl font-semibold">Text Formatter</h2>
                          </div>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">
                        Format and validate JSON, YAML, XML, and Markdown with syntax highlighting. Identify errors and
                        ensure proper structure.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/validator">Try It Free</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Free Version
                        </div>
                        <Link href="/mood-generator" className="block">
                          <div className="flex items-center mb-2">
                            <Calculator className="h-8 w-8 mr-3 text-purple-600" />
                            <h2 className="text-2xl font-semibold">Random Number Generator</h2>
                          </div>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">
                        Generate random numbers, IDs, and values with customizable parameters for testing and
                        development.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/mood-generator">Try It Free</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Free Version
                        </div>
                        <Link href="/code-beautifier" className="block">
                          <div className="flex items-center mb-2">
                            <Code className="h-8 w-8 mr-3 text-purple-600" />
                            <h2 className="text-2xl font-semibold">Code Formatter</h2>
                          </div>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">
                        Format and beautify your code with proper indentation. Supports HTML, CSS, JavaScript, and
                        Python.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/code-beautifier">Try It Free</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Free Version
                        </div>
                        <Link href="/file-converter" className="block">
                          <div className="flex items-center mb-2">
                            <FileSpreadsheet className="h-8 w-8 mr-3 text-purple-600" />
                            <h2 className="text-2xl font-semibold">File Converter</h2>
                          </div>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">
                        Convert spreadsheet files between formats. Transform CSV to Excel, JSON, and more with an
                        interactive editor.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/file-converter">Try It Free</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Free Version
                        </div>
                        <Link href="/qr-code-generator" className="block">
                          <div className="flex items-center mb-2">
                            <QrCode className="h-8 w-8 mr-3 text-purple-600" />
                            <h2 className="text-2xl font-semibold">QR Code Generator</h2>
                          </div>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">
                        Create customizable QR codes for websites, text, and contact information with personalized
                        colors and sizes.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/qr-code-generator">Try It Free</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative static" />
            <CarouselNext className="relative static" />
          </div>
        </Carousel>
      </div>

      {/* All Tools Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">All Tools</h2>
          <p className="text-muted-foreground mt-2">Browse our complete collection of developer utilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <div className="space-y-4">
            <Link href="/validator" className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <FileText className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">Text Formatter</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Format and validate JSON, YAML, XML, and Markdown files with syntax highlighting. Quickly identify
                errors and ensure your data is properly structured.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/mood-generator"
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <Calculator className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">Random Number Generator</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Generate random numbers, IDs, and values with customizable parameters. Perfect for testing, development,
                and creating sample data for your applications.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/password-generator"
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <Lock className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">Password Generator</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Create secure passwords with customizable options. Analyze password strength, entropy, and enable
                two-factor authentication for enhanced security.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/code-beautifier"
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <Code className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">Code Formatter</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Format and beautify your code files for better readability. Supports HTML, CSS, JavaScript, and Python
                with syntax validation and proper indentation.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/file-converter"
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <FileSpreadsheet className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">File Converter</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Convert and edit spreadsheet files between different formats. Transform CSV to Excel, JSON, and more
                with an interactive editor for making quick changes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/qr-code-generator"
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <QrCode className="h-8 w-8 mr-3 text-purple-600" />
                <h2 className="text-2xl font-semibold">QR Code Generator</h2>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
            <div className="px-2">
              <p className="text-muted-foreground">
                Create customizable QR codes for websites, text, and contact information. Personalize colors and size,
                then download for print or digital use.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Premium Features Section */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Top Premium Features</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our most powerful developer tools that will transform your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FileAudio className="h-6 w-6 mr-2 text-purple-600" />
              <h3 className="text-xl font-semibold">Content Summarizer</h3>
            </div>
            <p className="text-muted-foreground">
              Summarize audio and PDF files to 1/3 of their original length. Download or listen to the summarized
              content with text-to-speech.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Database className="h-6 w-6 mr-2 text-purple-600" />
              <h3 className="text-xl font-semibold">SQL Formatter</h3>
            </div>
            <p className="text-muted-foreground">
              Format complex SQL queries with perfect syntax highlighting and indentation. Upload files, preview
              changes, and download formatted code.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Clock className="h-6 w-6 mr-2 text-purple-600" />
              <h3 className="text-xl font-semibold">Cron Builder</h3>
            </div>
            <p className="text-muted-foreground">
              Create precise cron expressions with our visual builder. Preview execution times and validate your
              schedules for backend jobs.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="/login">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}