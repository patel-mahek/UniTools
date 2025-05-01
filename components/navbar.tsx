"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  FileText,
  Calculator,
  Code,
  FileSpreadsheet,
  QrCode,
  Lock,
  Menu,
  Settings,
  Globe,
  ImageIcon,
  Mic,
  Volume2,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Palette,
  BookOpen,
  Key,
  Database,
  Clock,
  BarChart,
  Layout,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Update the tools array to include the new Background Generator
const tools = [
  { name: "Text Formatter", href: "/validator", icon: FileText },
  { name: "Random Number Generator", href: "/mood-generator", icon: Calculator },
  { name: "Password Generator", href: "/password-generator", icon: Lock },
  { name: "Code Formatter", href: "/code-beautifier", icon: Code },
  { name: "File Converter", href: "/file-converter", icon: FileSpreadsheet },
  { name: "QR Code Generator", href: "/qr-code-generator", icon: QrCode },
  { name: "Image Converter", href: "/image-converter", icon: ImageIcon },
  { name: "Networking Utilities", href: "/networking-utilities", icon: Globe },
  { name: "API Tester", href: "/api-tester", icon: Code },
  { name: "Color Palette Generator", href: "/color-palette-generator", icon: Palette },
  { name: "Blob Generator", href: "/blob-generator", icon: Palette },
  { name: "Background Generator", href: "/background-generator", icon: ImageIcon },
]

// Domain categories for premium features
const domains = [
  { name: "UI/UX Design", action: "scrollToUiUx", icon: Layout },
  { name: "Web Development", action: "scrollToWebDev", icon: Code },
  { name: "Backend Development", action: "scrollToBackend", icon: Database },
  { name: "Data & Analytics", action: "scrollToDataAnalytics", icon: BarChart },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, login, logout } = useAuth()

  // Function to handle domain category clicks
  const handleDomainClick = (action: string) => {
    if (typeof window !== "undefined" && window[action as keyof Window]) {
      // @ts-ignore - we know these functions exist because we added them
      window[action]()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              UniTools
            </span>
          </Link>
        </div>

        {/* Only show premium features in dropdown if authenticated */}
        <div className="hidden md:flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                <Menu className="h-4 w-4 mr-2" />
                Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
              <DropdownMenuLabel>All Tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href} className="flex items-center cursor-pointer">
                    <tool.icon className="h-4 w-4 mr-2 text-purple-600" />
                    {tool.name}
                  </Link>
                </DropdownMenuItem>
              ))}

              {isAuthenticated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Premium Features</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/speech-to-text" className="flex items-center cursor-pointer">
                      <Mic className="h-4 w-4 mr-2 text-purple-600" />
                      Speech to Text
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/text-to-speech" className="flex items-center cursor-pointer">
                      <Volume2 className="h-4 w-4 mr-2 text-purple-600" />
                      Text to Speech
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/color-selector" className="flex items-center cursor-pointer">
                      <Palette className="h-4 w-4 mr-2 text-purple-600" />
                      Color Selector
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tech-stack-advisor" className="flex items-center cursor-pointer">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                      Tech Stack Advisor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/background-generator" className="flex items-center cursor-pointer">
                      <ImageIcon className="h-4 w-4 mr-2 text-purple-600" />
                      Background Generator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/token-generator" className="flex items-center cursor-pointer">
                      <Key className="h-4 w-4 mr-2 text-purple-600" />
                      Token Generator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sql-formatter" className="flex items-center cursor-pointer">
                      <Database className="h-4 w-4 mr-2 text-purple-600" />
                      SQL Formatter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cron-builder" className="flex items-center cursor-pointer">
                      <Clock className="h-4 w-4 mr-2 text-purple-600" />
                      Cron Expression Builder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/code-preview" className="flex items-center cursor-pointer">
                      <Code className="h-4 w-4 mr-2 text-purple-600" />
                      HTML/CSS/JS Preview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/css-layout-visualizer" className="flex items-center cursor-pointer">
                      <Layout className="h-4 w-4 mr-2 text-purple-600" />
                      CSS Grid/Flexbox Visualizer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/code-formatter" className="flex items-center cursor-pointer">
                      <Code className="h-4 w-4 mr-2 text-purple-600" />
                      Advanced Code Formatter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/content-summarizer" className="flex items-center cursor-pointer">
                      <Code className="h-4 w-4 mr-2 text-purple-600" />
                      content Summarizer
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Domain Categories Dropdown - Only visible when authenticated */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                  Domains
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Feature Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {domains.map((domain) => (
                  <DropdownMenuItem
                    key={domain.action}
                    onClick={() => handleDomainClick(domain.action)}
                    className="cursor-pointer"
                  >
                    <domain.icon className="h-4 w-4 mr-2 text-purple-600" />
                    {domain.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex-1"></div>

        <div className="hidden md:flex items-center space-x-2">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="cursor-pointer">
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Feature Categories</DropdownMenuLabel>
                {domains.map((domain) => (
                  <DropdownMenuItem
                    key={domain.action}
                    onClick={() => handleDomainClick(domain.action)}
                    className="cursor-pointer"
                  >
                    <domain.icon className="h-4 w-4 mr-2 text-purple-600" />
                    {domain.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" onClick={login}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>UniTools</SheetTitle>
                <SheetDescription>Your all-in-one platform for developer productivity tools</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
                {isAuthenticated && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="grid grid-cols-1 gap-2">
                    <h3 className="mb-1 text-sm font-medium">Feature Categories</h3>
                    {domains.map((domain) => (
                      <Button
                        key={domain.action}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleDomainClick(domain.action)
                          setIsOpen(false)
                        }}
                      >
                        <domain.icon className="h-4 w-4 mr-2 text-purple-600" />
                        {domain.name}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {isAuthenticated && (
                    <>
                      <h3 className="mb-1 text-sm font-medium">Premium Features</h3>
                      <Link href="/speech-to-text" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Mic className="h-4 w-4 mr-2 text-purple-600" />
                          Speech to Text
                        </Button>
                      </Link>
                      <Link href="/text-to-speech" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Volume2 className="h-4 w-4 mr-2 text-purple-600" />
                          Text to Speech
                        </Button>
                      </Link>
                      {/* <Link href="/audio-to-image" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <ImageIcon className="h-4 w-4 mr-2 text-purple-600" />
                          Audio to Image
                        </Button>
                      </Link> */}
                      <Link href="/blob-generator" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Palette className="h-4 w-4 mr-2 text-purple-600" />
                          Blob Generator
                        </Button>
                      </Link>
                      <Link href="/color-selector" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Palette className="h-4 w-4 mr-2 text-purple-600" />
                          Color Selector
                        </Button>
                      </Link>
                      <Link href="/tech-stack-advisor" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                          Tech Stack Advisor
                        </Button>
                      </Link>
                      <Link href="/background-generator" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <ImageIcon className="h-4 w-4 mr-2 text-purple-600" />
                          Background Generator
                        </Button>
                      </Link>
                      <Link href="/token-generator" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Key className="h-4 w-4 mr-2 text-purple-600" />
                          Token Generator
                        </Button>
                      </Link>
                      <Link href="/sql-formatter" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Database className="h-4 w-4 mr-2 text-purple-600" />
                          SQL Formatter
                        </Button>
                      </Link>
                      <Link href="/cron-builder" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Clock className="h-4 w-4 mr-2 text-purple-600" />
                          Cron Expression Builder
                        </Button>
                      </Link>
                      <Link href="/code-preview" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Code className="h-4 w-4 mr-2 text-purple-600" />
                          HTML/CSS/JS Preview
                        </Button>
                      </Link>
                      <Link href="/css-layout-visualizer" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Layout className="h-4 w-4 mr-2 text-purple-600" />
                          CSS Grid/Flexbox Visualizer
                        </Button>
                      </Link>
                      <Link href="/code-formatter" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Code className="h-4 w-4 mr-2 text-purple-600" />
                          Advanced Code Formatter
                        </Button>
                      </Link>
                      <Link href="/content-summarizer" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <BarChart className="h-4 w-4 mr-2 text-purple-600" />
                          Content Summarizer
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="mb-2 text-sm font-medium">All Tools</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {tools.map((tool) => (
                      <Link key={tool.href} href={tool.href} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <tool.icon className="h-4 w-4 mr-2 text-purple-600" />
                          {tool.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>

                    {isAuthenticated ? (
                      <>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            login()
                            setIsOpen(false)
                          }}
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

