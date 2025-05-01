"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type PlanType = "free" | "basic" | "premium"

type User = {
  id: string
  name: string
  email: string
  avatar: string
  plan: PlanType
  firstName?: string
  lastName?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (firstName?: string, lastName?: string, email?: string, plan?: PlanType) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for saved user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user data")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = (firstName?: string, lastName?: string, email?: string, plan?: PlanType) => {
    // Create user with provided info or defaults
    const newUser = {
      id: "user-1",
      name: firstName && lastName ? `${firstName} ${lastName}` : "John Doe",
      email: email || "john.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      plan: plan || "premium",
      firstName: firstName || "John",
      lastName: lastName || "Doe",
    }

    // Save user to state and localStorage
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

