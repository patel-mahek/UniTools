"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, Check, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type PlanType = "free" | "basic" | "premium"

interface Plan {
  id: PlanType
  name: string
  price: number
  description: string
  features: string[]
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic access to essential tools",
    features: ["Access to basic tools", "Limited usage per day", "Standard quality outputs", "Community support"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 4.99,
    description: "Enhanced access with more features",
    features: [
      "Access to all basic tools",
      "Content summarizer",
      "Unlimited usage",
      "Higher quality outputs",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    description: "Full access to all premium features",
    features: [
      "Access to all tools",
      "Priority processing",
      "Highest quality outputs",
      "Advanced customization",
      "Priority support",
      "Early access to new features",
    ],
  },
]

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free")
  const [step, setStep] = useState(1)

  // Payment details
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation for step 1
    if (step === 1) {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!firstName || !lastName || !email || !password) {
        setError("Please fill in all required fields")
        return
      }

      setError(null)
      setStep(2)
      return
    }

    // For free plan, skip payment step
    if (step === 2 && selectedPlan === "free") {
      handleSubmit(e)
      return
    }

    // Move to payment step for paid plans
    if (step === 2) {
      setStep(3)
      return
    }

    // Process payment and complete signup
    if (step === 3) {
      handleSubmit(e)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Auto-login after signup with the provided information and selected plan
      login(firstName, lastName, email, selectedPlan)
      router.push("/")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl flex flex-col items-center">
      <div className="flex items-center mb-6 w-full">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Sign Up</h1>
      </div>

      <div className="w-full mb-8">
        <div className="flex justify-between items-center relative">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <span className="text-sm mt-2">Account</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div
              className={`h-full ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}
              style={{ width: step >= 2 ? "100%" : "0%" }}
            ></div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="text-sm mt-2">Plan</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div
              className={`h-full ${step >= 3 ? "bg-purple-600" : "bg-gray-200"}`}
              style={{ width: step >= 3 ? "100%" : "0%" }}
            ></div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              3
            </div>
            <span className="text-sm mt-2">Payment</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full">
        {step === 1 && (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create Your Account</h1>
              <p className="text-muted-foreground">Enter your information to get started</p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Continue to Select Plan
              </Button>
            </form>

            <Separator />

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Choose Your Plan</h1>
              <p className="text-muted-foreground">Select the plan that works best for you</p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
              <RadioGroup
                value={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as PlanType)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {plans.map((plan) => (
                  <div key={plan.id} className="relative">
                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                    <Label
                      htmlFor={plan.id}
                      className={`flex flex-col h-full p-4 rounded-lg border-2 cursor-pointer ${
                        selectedPlan === plan.id ? "border-purple-600" : "border-gray-200"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="font-bold text-lg">{plan.name}</div>
                      <div className="text-2xl font-bold mt-1">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                      <div className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {selectedPlan === "free" ? "Complete Signup" : "Continue to Payment"}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Payment Details</h1>
              <p className="text-muted-foreground">
                You've selected the{" "}
                <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span> plan at{" "}
                <span className="font-medium">${plans.find((p) => p.id === selectedPlan)?.price}/month</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Enter your card details to complete your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required value={cvv} onChange={(e) => setCvv(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Your payment is secure and encrypted. We never store your full card details.
                  </p>
                </CardFooter>
              </Card>

              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Subscription"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

