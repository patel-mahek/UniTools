"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function CronBuilderPage() {
  const [cronExpression, setCronExpression] = useState("* * * * *")
  const [minute, setMinute] = useState("*")
  const [hour, setHour] = useState("*")
  const [dayOfMonth, setDayOfMonth] = useState("*")
  const [month, setMonth] = useState("*")
  const [dayOfWeek, setDayOfWeek] = useState("*")
  const [nextExecutions, setNextExecutions] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("")
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  // Update cron expression when any part changes
  useEffect(() => {
    setCronExpression(`${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`)
  }, [minute, hour, dayOfMonth, month, dayOfWeek])

  // Calculate next execution times
  useEffect(() => {
    calculateNextExecutions()
  }, [cronExpression])

  // Calculate next execution times (simplified for demo)
  const calculateNextExecutions = () => {
    // This is a simplified version - in a real app, you'd use a library like cron-parser
    const now = new Date()
    const executions = []

    // Simple logic to generate some future dates
    for (let i = 1; i <= 5; i++) {
      const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000) // Add hours
      executions.push(futureDate.toLocaleString())
    }

    setNextExecutions(executions)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Copied!",
      description: "Cron expression copied to clipboard.",
    })
  }

  // Apply preset
  const applyPreset = (preset: string) => {
    setSelectedPreset(preset)

    switch (preset) {
      case "every-minute":
        setMinute("*")
        setHour("*")
        setDayOfMonth("*")
        setMonth("*")
        setDayOfWeek("*")
        break
      case "hourly":
        setMinute("0")
        setHour("*")
        setDayOfMonth("*")
        setMonth("*")
        setDayOfWeek("*")
        break
      case "daily":
        setMinute("0")
        setHour("0")
        setDayOfMonth("*")
        setMonth("*")
        setDayOfWeek("*")
        break
      case "weekly":
        setMinute("0")
        setHour("0")
        setDayOfMonth("*")
        setMonth("*")
        setDayOfWeek("0")
        break
      case "monthly":
        setMinute("0")
        setHour("0")
        setDayOfMonth("1")
        setMonth("*")
        setDayOfWeek("*")
        break
      case "yearly":
        setMinute("0")
        setHour("0")
        setDayOfMonth("1")
        setMonth("1")
        setDayOfWeek("*")
        break
      case "weekday":
        setMinute("0")
        setHour("9")
        setDayOfMonth("*")
        setMonth("*")
        setDayOfWeek("1-5")
        break
      default:
        break
    }
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Cron Expression Builder is a premium feature. Please login to access this tool.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center justify-center p-3 rounded-full bg-purple-100 mb-4">
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Cron Expression Builder</h1>
        <p className="text-muted-foreground text-center mt-2 max-w-2xl">
          Create and validate cron expressions with an intuitive visual interface. Perfect for scheduling backend jobs.
        </p>
      </div>

      <Tabs defaultValue="builder" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="presets">Common Presets</TabsTrigger>
          <TabsTrigger value="help">Syntax Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cron Expression</CardTitle>
              <CardDescription>Build your cron expression using the fields below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 p-4 bg-muted rounded-md mb-6">
                <div className="text-center">
                  <div className="font-mono text-xl">{minute}</div>
                  <div className="text-xs text-muted-foreground">Minute</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xl">{hour}</div>
                  <div className="text-xs text-muted-foreground">Hour</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xl">{dayOfMonth}</div>
                  <div className="text-xs text-muted-foreground">Day (Month)</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xl">{month}</div>
                  <div className="text-xs text-muted-foreground">Month</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xl">{dayOfWeek}</div>
                  <div className="text-xs text-muted-foreground">Day (Week)</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="minute">Minute (0-59)</Label>
                  <div className="flex gap-4">
                    <RadioGroup defaultValue="*" className="flex" onValueChange={setMinute}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="*" id="minute-every" />
                        <Label htmlFor="minute-every">Every minute</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="*/5" id="minute-every-5" />
                        <Label htmlFor="minute-every-5">Every 5 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="0" id="minute-0" />
                        <Label htmlFor="minute-0">At minute 0</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    id="minute-custom"
                    placeholder="Custom (e.g. */10, 5,10,15)"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="max-w-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hour">Hour (0-23)</Label>
                  <div className="flex gap-4">
                    <RadioGroup defaultValue="*" className="flex" onValueChange={setHour}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="*" id="hour-every" />
                        <Label htmlFor="hour-every">Every hour</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="*/2" id="hour-every-2" />
                        <Label htmlFor="hour-every-2">Every 2 hours</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="9-17" id="hour-business" />
                        <Label htmlFor="hour-business">Business hours (9-17)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    id="hour-custom"
                    placeholder="Custom (e.g. 9-17, 0,12)"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="max-w-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day-month">Day of Month (1-31)</Label>
                  <div className="flex gap-4">
                    <RadioGroup defaultValue="*" className="flex" onValueChange={setDayOfMonth}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="*" id="day-month-every" />
                        <Label htmlFor="day-month-every">Every day</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="1" id="day-month-first" />
                        <Label htmlFor="day-month-first">First day</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="15" id="day-month-15" />
                        <Label htmlFor="day-month-15">15th day</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    id="day-month-custom"
                    placeholder="Custom (e.g. 1,15, 1-5)"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    className="max-w-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month (1-12)</Label>
                  <div className="flex gap-4">
                    <RadioGroup defaultValue="*" className="flex" onValueChange={setMonth}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="*" id="month-every" />
                        <Label htmlFor="month-every">Every month</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="1,4,7,10" id="month-quarter" />
                        <Label htmlFor="month-quarter">Quarterly</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="1-6" id="month-half" />
                        <Label htmlFor="month-half">First half of year</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    id="month-custom"
                    placeholder="Custom (e.g. 1,6,12, 3-5)"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="max-w-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day-week">Day of Week (0-6, 0=Sunday)</Label>
                  <div className="flex gap-4">
                    <RadioGroup defaultValue="*" className="flex" onValueChange={setDayOfWeek}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="*" id="day-week-every" />
                        <Label htmlFor="day-week-every">Every day</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="1-5" id="day-week-weekday" />
                        <Label htmlFor="day-week-weekday">Weekdays</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="0,6" id="day-week-weekend" />
                        <Label htmlFor="day-week-weekend">Weekends</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    id="day-week-custom"
                    placeholder="Custom (e.g. 1,3,5, 1-5)"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="max-w-[300px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-mono text-sm">{cronExpression}</div>
              <Button onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Expression
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Execution Times</CardTitle>
              <CardDescription>Preview when your cron job will run</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {nextExecutions.map((time, index) => (
                  <li key={index} className="p-2 bg-muted rounded-md font-mono text-sm">
                    {time}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <CardTitle>Common Cron Presets</CardTitle>
              <CardDescription>Select a preset to quickly create a cron expression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant={selectedPreset === "every-minute" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("every-minute")}
                >
                  <div className="text-left">
                    <div className="font-medium">Every Minute</div>
                    <div className="text-xs text-muted-foreground font-mono">* * * * *</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "hourly" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("hourly")}
                >
                  <div className="text-left">
                    <div className="font-medium">Hourly</div>
                    <div className="text-xs text-muted-foreground font-mono">0 * * * *</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "daily" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("daily")}
                >
                  <div className="text-left">
                    <div className="font-medium">Daily (Midnight)</div>
                    <div className="text-xs text-muted-foreground font-mono">0 0 * * *</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "weekly" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("weekly")}
                >
                  <div className="text-left">
                    <div className="font-medium">Weekly (Sunday)</div>
                    <div className="text-xs text-muted-foreground font-mono">0 0 * * 0</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "monthly" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("monthly")}
                >
                  <div className="text-left">
                    <div className="font-medium">Monthly (1st day)</div>
                    <div className="text-xs text-muted-foreground font-mono">0 0 1 * *</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "yearly" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("yearly")}
                >
                  <div className="text-left">
                    <div className="font-medium">Yearly (Jan 1st)</div>
                    <div className="text-xs text-muted-foreground font-mono">0 0 1 1 *</div>
                  </div>
                </Button>

                <Button
                  variant={selectedPreset === "weekday" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset("weekday")}
                >
                  <div className="text-left">
                    <div className="font-medium">Weekdays at 9am</div>
                    <div className="text-xs text-muted-foreground font-mono">0 9 * * 1-5</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Cron Syntax Guide</CardTitle>
              <CardDescription>Learn how to write cron expressions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Cron Format</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">A cron expression consists of 5 fields separated by spaces:</p>
                    <pre className="bg-muted p-2 rounded-md font-mono text-sm">
                      ┌───────────── minute (0 - 59) │ ┌───────────── hour (0 - 23) │ │ ┌───────────── day of the month
                      (1 - 31) │ │ │ ┌───────────── month (1 - 12) │ │ │ │ ┌───────────── day of the week (0 - 6)
                      (Sunday to Saturday) │ │ │ │ │ * * * * *
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Special Characters</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li>
                        <strong>*</strong> - Matches any value (wildcard)
                      </li>
                      <li>
                        <strong>,</strong> - Separates multiple values (e.g., 1,3,5)
                      </li>
                      <li>
                        <strong>-</strong> - Defines a range (e.g., 1-5)
                      </li>
                      <li>
                        <strong>/</strong> - Specifies increments (e.g., */15 means every 15 units)
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Common Examples</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono text-sm">* * * * *</div>
                        <div>Every minute</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono text-sm">0 * * * *</div>
                        <div>Every hour (at minute 0)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono text-sm">0 0 * * *</div>
                        <div>Every day at midnight</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono text-sm">*/15 * * * *</div>
                        <div>Every 15 minutes</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono text-sm">0 9-17 * * 1-5</div>
                        <div>Every hour from 9 AM to 5 PM, Monday to Friday</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Best Practices</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li>
                        Avoid running jobs exactly at the top of the hour (0 * * * *) as this is when many cron jobs
                        run, causing server load spikes
                      </li>
                      <li>Use specific times rather than frequent intervals for resource-intensive jobs</li>
                      <li>Test your cron expressions with a validator before deploying</li>
                      <li>Document what each cron job does and when it runs</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

