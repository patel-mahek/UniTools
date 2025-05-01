"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Moon, Sun, Bell, Globe, Shield, Palette } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  const [lightMode, setLightMode] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [systemMode, setSystemMode] = useState(true)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(isAuthenticated)
  const [productUpdates, setProductUpdates] = useState(isAuthenticated)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Privacy settings
  const [dataCollection, setDataCollection] = useState(true)
  const [cookies, setCookies] = useState(true)
  const [thirdParty, setThirdParty] = useState(false)

  // Set initial theme state
  useEffect(() => {
    setLightMode(theme === "light")
    setDarkMode(theme === "dark")
    setSystemMode(theme === "system")
  }, [theme])

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    setLightMode(newTheme === "light")
    setDarkMode(newTheme === "dark")
    setSystemMode(newTheme === "system")
  }

  const handleSave = () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      })
    }, 1000)
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how UniTools looks on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Light Mode</p>
                      <p className="text-sm text-muted-foreground">Use light theme</p>
                    </div>
                  </div>
                  <Switch id="light-mode" checked={lightMode} onCheckedChange={() => handleThemeChange("light")} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Moon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Use dark theme</p>
                    </div>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={() => handleThemeChange("dark")} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">System Preference</p>
                      <p className="text-sm text-muted-foreground">Follow system theme</p>
                    </div>
                  </div>
                  <Switch id="system-theme" checked={systemMode} onCheckedChange={() => handleThemeChange("system")} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about new features</p>
                    </div>
                  </div>
                  <Switch id="product-updates" checked={productUpdates} onCheckedChange={setProductUpdates} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                    </div>
                  </div>
                  <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Set your preferred language and region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">Select your preferred language</p>
                    </div>
                  </div>
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Region</p>
                      <p className="text-sm text-muted-foreground">Set your location for regional settings</p>
                    </div>
                  </div>
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="eu">European Union</option>
                    <option value="jp">Japan</option>
                    <option value="cn">China</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Data Collection</p>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                    </div>
                  </div>
                  <Switch id="data-collection" checked={dataCollection} onCheckedChange={setDataCollection} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Cookies</p>
                      <p className="text-sm text-muted-foreground">Allow cookies for improved experience</p>
                    </div>
                  </div>
                  <Switch id="cookies" checked={cookies} onCheckedChange={setCookies} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Third-Party Integrations</p>
                      <p className="text-sm text-muted-foreground">Allow third-party service integrations</p>
                    </div>
                  </div>
                  <Switch id="third-party" checked={thirdParty} onCheckedChange={setThirdParty} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

