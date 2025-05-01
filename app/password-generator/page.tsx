"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Copy, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface PasswordResponse {
  password: string
  entropy: number
  strength: string
  is_common: boolean
  hashed_password: string
  twofa_enabled: boolean
  twofa_secret?: string
  twofa_uri?: string
  twofa_qr_url?: string
}

export default function PasswordGeneratorPage() {
  const [formData, setFormData] = useState({
    length: 12,
    include_uppercase: true,
    include_lowercase: true,
    include_digits: true,
    include_symbols: true,
    enable_2fa: false,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PasswordResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    const form = new FormData()
    form.append("length", formData.length.toString())
    form.append("use_upper", String(formData.include_uppercase))
    form.append("use_lower", String(formData.include_lowercase))
    form.append("use_digits", String(formData.include_digits))
    form.append("use_symbols", String(formData.include_symbols))
    form.append("enable_2fa", String(formData.enable_2fa))
  
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-2fa", {
        method: "POST",
        body: form,
      })
  
      if (!response.ok) throw new Error(`Error: ${response.status}`)
  
      const data = await response.json()
      setResult({
        password: data.password,
        entropy: data.entropy,
        strength: data.strength,
        is_common: data.is_common,
        hashed_password: data.hash,
        twofa_enabled: formData.enable_2fa,
        twofa_secret: data.twofa_secret,
        twofa_uri: data.twofa_uri,
        twofa_qr_url: data.twofa_qr_url,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "weak":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "strong":
        return "text-green-600"
      case "very strong":
        return "text-green-700"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Password Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Generate secure passwords with customizable options</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This tool helps you create strong, secure passwords with the following features:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Customize password length and character types</li>
            <li>View password entropy and strength assessment</li>
            <li>Check if your password is commonly used</li>
            <li>Enable two-factor authentication (2FA) for extra security</li>
          </ul>
          <p className="mt-4">
            Simply configure your password requirements, click generate, and get a secure password instantly.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Password</CardTitle>
          <CardDescription>Customize your password requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="length">Password Length</Label>
              <Input
                id="length"
                name="length"
                type="number"
                min="4"
                max="64"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label>Character Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include_uppercase"
                    name="include_uppercase"
                    checked={formData.include_uppercase}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, include_uppercase: checked === true }))
                    }
                  />
                  <Label htmlFor="include_uppercase" className="cursor-pointer">
                    Uppercase Letters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include_lowercase"
                    name="include_lowercase"
                    checked={formData.include_lowercase}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, include_lowercase: checked === true }))
                    }
                  />
                  <Label htmlFor="include_lowercase" className="cursor-pointer">
                    Lowercase Letters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include_digits"
                    name="include_digits"
                    checked={formData.include_digits}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, include_digits: checked === true }))
                    }
                  />
                  <Label htmlFor="include_digits" className="cursor-pointer">
                    Digits
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include_symbols"
                    name="include_symbols"
                    checked={formData.include_symbols}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, include_symbols: checked === true }))
                    }
                  />
                  <Label htmlFor="include_symbols" className="cursor-pointer">
                    Symbols
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable_2fa"
                name="enable_2fa"
                checked={formData.enable_2fa}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enable_2fa: checked === true }))}
              />
              <Label htmlFor="enable_2fa" className="cursor-pointer">
                Enable Two-Factor Authentication (2FA)
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Password"
              )}
            </Button>
          </form>

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

          {result && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Generated Password</h3>
                <div className="relative">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono">
                    <div className="pr-16 overflow-x-auto">
                      {showPassword ? result.password : "•".repeat(result.password.length)}
                    </div>
                    <div className="absolute right-3 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(result.password)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Entropy</h4>
                  <p className="text-sm">{result.entropy.toFixed(2)} bits</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Strength</h4>
                  <p className={`text-sm font-medium ${getStrengthColor(result.strength)}`}>{result.strength}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Common Password</h4>
                  <p className="text-sm">{result.is_common ? "Yes (not secure)" : "No (good)"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">2FA Enabled</h4>
                  <p className="text-sm">{result.twofa_enabled ? "Yes" : "No"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Hashed Password</h4>
                <div className="p-3 bg-muted rounded-md overflow-x-auto">
                  <code className="text-xs">{result.hashed_password}</code>
                </div>
              </div>

              {result.twofa_enabled && result.twofa_qr_url && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Two-Factor Authentication</h3>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Secret Key</h4>
                    <div className="flex items-center">
                      <code className="p-2 bg-muted rounded-md text-sm mr-2">{result.twofa_secret}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => result.twofa_secret && copyToClipboard(result.twofa_secret)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">QR Code</h4>
                    <div className="p-4 bg-white inline-block rounded-md">
                      <Image
                        src={result.twofa_qr_url || "/placeholder.svg"}
                        alt="2FA QR Code"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-sm mt-2">
                      Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft
                      Authenticator)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

