"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate credentials here
      // For demo purposes, we'll just log in with the email
      const nameParts = email.split("@")[0].split(".")
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : undefined
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : undefined

      login(firstName, lastName, email)
      router.push("/")
    } catch (err) {
      setError("Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md flex flex-col items-center">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Login</h1>
      </div>

      <div className="space-y-6 w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Separator />

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full">
            Continue with GitHub
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

