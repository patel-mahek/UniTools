"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Globe, Search, Activity, Route } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NetworkingUtilitiesPage() {
  // Public IP state
  const [publicIp, setPublicIp] = useState<string | null>(null)
  const [ipLoading, setIpLoading] = useState(false)
  const [ipError, setIpError] = useState<string | null>(null)

  // DNS Lookup state
  const [domain, setDomain] = useState("")
  const [dnsResult, setDnsResult] = useState<string | null>(null)
  const [dnsLoading, setDnsLoading] = useState(false)
  const [dnsError, setDnsError] = useState<string | null>(null)

  // Ping state
  const [pingHost, setPingHost] = useState("")
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [pingLoading, setPingLoading] = useState(false)
  const [pingError, setPingError] = useState<string | null>(null)

  // Traceroute state
  const [traceHost, setTraceHost] = useState("")
  const [traceResult, setTraceResult] = useState<string | null>(null)
  const [traceLoading, setTraceLoading] = useState(false)
  const [traceError, setTraceError] = useState<string | null>(null)

  // Get Public IP
  const handleGetPublicIp = async () => {
    setIpLoading(true)
    setIpError(null)
    setPublicIp(null)

    try {
      // In a real implementation, you would use a server endpoint
      // For this demo, we'll use a public API
      const response = await fetch("https://api.ipify.org?format=json")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setPublicIp(data.ip)
    } catch (err) {
      setIpError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIpLoading(false)
    }
  }

  // DNS Lookup
  const handleDnsLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setDnsLoading(true)
    setDnsError(null)
    setDnsResult(null)

    try {
      // In a real implementation, you would use a server endpoint
      // For this demo, we'll simulate the response
      if (!domain) {
        throw new Error("Please enter a domain name")
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a random IP for demo purposes
      const randomIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      setDnsResult(randomIp)
    } catch (err) {
      setDnsError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setDnsLoading(false)
    }
  }

  // Ping Test
  const handlePing = async (e: React.FormEvent) => {
    e.preventDefault()
    setPingLoading(true)
    setPingError(null)
    setPingResult(null)

    try {
      // In a real implementation, you would use a server endpoint
      // For this demo, we'll simulate the response
      if (!pingHost) {
        throw new Error("Please enter a hostname or IP address")
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a simulated ping response
      const pingLines = []
      pingLines.push(`PING ${pingHost} (192.168.1.1): 56 data bytes`)

      for (let i = 0; i < 4; i++) {
        const time = (Math.random() * 100).toFixed(3)
        pingLines.push(`64 bytes from 192.168.1.1: icmp_seq=${i} ttl=64 time=${time} ms`)
      }

      pingLines.push("")
      pingLines.push(`--- ${pingHost} ping statistics ---`)
      pingLines.push("4 packets transmitted, 4 packets received, 0.0% packet loss")
      pingLines.push("round-trip min/avg/max/stddev = 7.216/8.573/10.091/1.147 ms")

      setPingResult(pingLines.join("\n"))
    } catch (err) {
      setPingError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setPingLoading(false)
    }
  }

  // Traceroute
  const handleTraceroute = async (e: React.FormEvent) => {
    e.preventDefault()
    setTraceLoading(true)
    setTraceError(null)
    setTraceResult(null)

    try {
      // In a real implementation, you would use a server endpoint
      // For this demo, we'll simulate the response
      if (!traceHost) {
        throw new Error("Please enter a hostname or IP address")
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a simulated traceroute response
      const traceLines = []
      traceLines.push(`traceroute to ${traceHost} (142.250.190.78), 30 hops max, 60 byte packets`)

      for (let i = 1; i <= 8; i++) {
        const ip1 = Math.floor(Math.random() * 255)
        const ip2 = Math.floor(Math.random() * 255)
        const ip3 = Math.floor(Math.random() * 255)
        const ip4 = Math.floor(Math.random() * 255)
        const time1 = (Math.random() * 100).toFixed(3)
        const time2 = (Math.random() * 100).toFixed(3)
        const time3 = (Math.random() * 100).toFixed(3)

        traceLines.push(`${i}  ${ip1}.${ip2}.${ip3}.${ip4}  ${time1} ms  ${time2} ms  ${time3} ms`)
      }

      setTraceResult(traceLines.join("\n"))
    } catch (err) {
      setTraceError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setTraceLoading(false)
    }
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
        <h1 className="text-3xl font-bold">Networking Utilities</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About these tools</CardTitle>
          <CardDescription>Essential networking utilities for developers and IT professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <p>These networking tools help you diagnose connection issues and gather network information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Public IP Checker:</strong> Discover your current public IP address
            </li>
            <li>
              <strong>DNS Lookup:</strong> Resolve domain names to IP addresses
            </li>
            <li>
              <strong>Ping Test:</strong> Test connectivity to a host and measure response time
            </li>
            <li>
              <strong>Traceroute:</strong> Trace the path of packets across a network
            </li>
          </ul>
          <p className="mt-4">
            These tools are useful for network troubleshooting, server configuration, and understanding network
            topology.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="ip" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="ip">Public IP</TabsTrigger>
          <TabsTrigger value="dns">DNS Lookup</TabsTrigger>
          <TabsTrigger value="ping">Ping Test</TabsTrigger>
          <TabsTrigger value="trace">Traceroute</TabsTrigger>
        </TabsList>

        {/* Public IP Checker */}
        <TabsContent value="ip">
          <Card>
            <CardHeader>
              <CardTitle>Public IP Checker</CardTitle>
              <CardDescription>Find out your current public IP address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button onClick={handleGetPublicIp} disabled={ipLoading} className="w-full">
                  {ipLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrieving IP...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Get Public IP
                    </>
                  )}
                </Button>

                {ipError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{ipError}</AlertDescription>
                  </Alert>
                )}

                {publicIp && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium mb-1">Your Public IP Address:</p>
                    <p className="text-xl font-mono">{publicIp}</p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">What is a Public IP?</p>
                  <p>
                    A public IP address is how your device is identified on the internet. It's assigned by your Internet
                    Service Provider (ISP) and is visible to websites and online services you connect to.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DNS Lookup */}
        <TabsContent value="dns">
          <Card>
            <CardHeader>
              <CardTitle>DNS Lookup</CardTitle>
              <CardDescription>Resolve domain names to IP addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDnsLookup} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter domain name (e.g., google.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={dnsLoading}>
                    {dnsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Lookup</span>
                  </Button>
                </div>

                {dnsError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{dnsError}</AlertDescription>
                  </Alert>
                )}

                {dnsResult && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium mb-1">Resolved IP Address:</p>
                    <p className="text-xl font-mono">{dnsResult}</p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">What is DNS?</p>
                  <p>
                    DNS (Domain Name System) translates human-readable domain names (like google.com) into IP addresses
                    that computers use to identify each other on the network.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ping Test */}
        <TabsContent value="ping">
          <Card>
            <CardHeader>
              <CardTitle>Ping Test</CardTitle>
              <CardDescription>Test connectivity to a host and measure response time</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePing} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter hostname or IP (e.g., google.com)"
                    value={pingHost}
                    onChange={(e) => setPingHost(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={pingLoading}>
                    {pingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Ping</span>
                  </Button>
                </div>

                {pingError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{pingError}</AlertDescription>
                  </Alert>
                )}

                {pingResult && (
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="text-xs font-mono whitespace-pre">{pingResult}</pre>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">What is Ping?</p>
                  <p>
                    Ping is a network utility that tests the reachability of a host and measures the round-trip time for
                    packets sent from the origin to a destination computer.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traceroute */}
        <TabsContent value="trace">
          <Card>
            <CardHeader>
              <CardTitle>Traceroute</CardTitle>
              <CardDescription>Trace the path of packets across a network</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTraceroute} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter hostname or IP (e.g., google.com)"
                    value={traceHost}
                    onChange={(e) => setTraceHost(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={traceLoading}>
                    {traceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Route className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Trace</span>
                  </Button>
                </div>

                {traceError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{traceError}</AlertDescription>
                  </Alert>
                )}

                {traceResult && (
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="text-xs font-mono whitespace-pre">{traceResult}</pre>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">What is Traceroute?</p>
                  <p>
                    Traceroute is a network diagnostic tool that shows the route taken by packets across an IP network,
                    and measures transit delays of packets. It helps identify routing problems and network congestion.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

