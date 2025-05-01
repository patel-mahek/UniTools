"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Key, CreditCard, Bell, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  if (!user) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="mb-6">You need to be logged in to view your profile.</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Use firstName and lastName from user object if available
  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={user.avatar || "/placeholder.svg?height=128&width=128"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {user.plan === "premium" ? "Premium Plan" : "Free Plan"}
                </div>
                <Button className="mt-4 w-full">Change Avatar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan</p>
                    <p className="text-sm text-muted-foreground">$9.99/month</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="name" defaultValue={displayName} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="email" type="email" defaultValue={user.email} className="rounded-l-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                          <Key className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input id="current-password" type="password" className="rounded-l-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-3">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-medium">Protect your account with 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Update Security"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about your account via email
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Product Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about new features and improvements
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Security Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified about important security updates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your payment methods and billing history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Payment Methods</h3>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                      <Button variant="outline" className="mt-3">
                        Add Payment Method
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Billing History</h3>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted text-sm font-medium">
                          <div>Date</div>
                          <div>Description</div>
                          <div>Amount</div>
                          <div>Status</div>
                        </div>
                        <div className="divide-y">
                          <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Apr 1, 2025</span>
                            </div>
                            <div>Premium Subscription</div>
                            <div>$9.99</div>
                            <div className="text-green-600">Paid</div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Mar 1, 2025</span>
                            </div>
                            <div>Premium Subscription</div>
                            <div>$9.99</div>
                            <div className="text-green-600">Paid</div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Feb 1, 2025</span>
                            </div>
                            <div>Premium Subscription</div>
                            <div>$9.99</div>
                            <div className="text-green-600">Paid</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

