"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Copy, Check, RefreshCw, Save, Trash, Key, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface SavedToken {
  id: string
  name: string
  token: string
  type: string
}

export default function TokenGenerator() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("auth")
  const [tokenType, setTokenType] = useState("jwt")
  const [tokenLength, setTokenLength] = useState(32)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [payload, setPayload] = useState('{\n  "userId": "123456",\n  "role": "user",\n  "exp": 1672531200\n}')
  const [secret, setSecret] = useState("your-secret-key")
  const [generatedToken, setGeneratedToken] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [savedTokens, setSavedTokens] = useState<SavedToken[]>([])
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [textToTokenize, setTextToTokenize] = useState("")
  const [tokenizedText, setTokenizedText] = useState<string[]>([])

  // Generate a random token
  const generateRandomToken = () => {
    setIsGenerating(true)

    setTimeout(() => {
      let characters = ""
      if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz"
      if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (includeNumbers) characters += "0123456789"
      if (includeSymbols) characters += "!@#$%^&*()_+-=[]{}|;:,.<>?"

      if (characters.length === 0) {
        characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      }

      let token = ""
      for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      setGeneratedToken(token)
      setIsGenerating(false)
    }, 500)
  }

  // Generate a JWT token
  const generateJWT = () => {
    setIsGenerating(true)

    setTimeout(() => {
      try {
        // Parse the payload
        const payloadObj = JSON.parse(payload)

        // Create header
        const header = {
          alg: "HS256",
          typ: "JWT",
        }

        // Encode header and payload
        const encodedHeader = btoa(JSON.stringify(header))
        const encodedPayload = btoa(JSON.stringify(payloadObj))

        // Create signature (in a real app, this would use a proper signing algorithm)
        // This is just a simulation
        const signature = btoa(secret).substring(0, 20)

        // Combine to form JWT
        const jwt = `${encodedHeader}.${encodedPayload}.${signature}`

        setGeneratedToken(jwt)
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please check your payload format.",
          variant: "destructive",
        })
      }

      setIsGenerating(false)
    }, 500)
  }

  // Generate token based on type
  const generateToken = () => {
    if (tokenType === "jwt") {
      generateJWT()
    } else {
      generateRandomToken()
    }
  }

  // Tokenize text
  const tokenizeText = () => {
    if (!textToTokenize.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to tokenize.",
        variant: "destructive",
      })
      return
    }

    // Simple tokenization by splitting on spaces and punctuation
    const tokens = textToTokenize
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 0)

    setTokenizedText(tokens)

    toast({
      title: "Text tokenized",
      description: `Split into ${tokens.length} tokens.`,
    })
  }

  // Copy token to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedToken)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Copied!",
      description: "Token copied to clipboard.",
    })
  }

  // Save the current token
  const saveToken = () => {
    if (!tokenName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your token.",
        variant: "destructive",
      })
      return
    }

    if (!generatedToken) {
      toast({
        title: "No token",
        description: "Please generate a token first.",
        variant: "destructive",
      })
      return
    }

    const newToken: SavedToken = {
      id: `token-${Date.now()}`,
      name: tokenName,
      token: generatedToken,
      type: tokenType,
    }

    setSavedTokens([...savedTokens, newToken])
    setTokenName("")

    toast({
      title: "Token saved",
      description: `"${tokenName}" has been saved to your collection.`,
    })
  }

  // Delete a saved token
  const deleteToken = (id: string) => {
    setSavedTokens(savedTokens.filter((token) => token.id !== id))

    toast({
      title: "Token deleted",
      description: "The token has been removed from your collection.",
    })
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Token Generator is a premium feature. Please login to access this tool.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Token Generator</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>Generate authentication tokens and tokenize text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Token Generator helps you create and manage tokens for your applications:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generate secure random tokens for authentication</li>
            <li>Create JWT tokens with custom payloads</li>
            <li>Tokenize text for natural language processing</li>
            <li>Save and manage your tokens for future use</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Settings</CardTitle>
              <CardDescription>Configure your token generation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="auth" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="auth">Auth Tokens</TabsTrigger>
                  <TabsTrigger value="text">Text Tokenization</TabsTrigger>
                </TabsList>

                <TabsContent value="auth" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-type">Token Type</Label>
                    <Select value={tokenType} onValueChange={setTokenType}>
                      <SelectTrigger id="token-type">
                        <SelectValue placeholder="Select token type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random Token</SelectItem>
                        <SelectItem value="jwt">JWT Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {tokenType === "random" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="token-length">Token Length: {tokenLength}</Label>
                        <Input
                          id="token-length"
                          type="number"
                          min={8}
                          max={128}
                          value={tokenLength}
                          onChange={(e) => setTokenLength(Number.parseInt(e.target.value) || 32)}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-lowercase">Include Lowercase</Label>
                          <Switch
                            id="include-lowercase"
                            checked={includeLowercase}
                            onCheckedChange={setIncludeLowercase}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-uppercase">Include Uppercase</Label>
                          <Switch
                            id="include-uppercase"
                            checked={includeUppercase}
                            onCheckedChange={setIncludeUppercase}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-numbers">Include Numbers</Label>
                          <Switch id="include-numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-symbols">Include Symbols</Label>
                          <Switch id="include-symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="jwt-payload">JWT Payload (JSON)</Label>
                        <Textarea
                          id="jwt-payload"
                          value={payload}
                          onChange={(e) => setPayload(e.target.value)}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jwt-secret">Secret Key</Label>
                        <Input
                          id="jwt-secret"
                          value={secret}
                          onChange={(e) => setSecret(e.target.value)}
                          type="password"
                        />
                      </div>
                    </>
                  )}

                  <Button onClick={generateToken} className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Generate Token
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-to-tokenize">Text to Tokenize</Label>
                    <Textarea
                      id="text-to-tokenize"
                      value={textToTokenize}
                      onChange={(e) => setTextToTokenize(e.target.value)}
                      rows={8}
                      placeholder="Enter text to tokenize..."
                    />
                  </div>

                  <Button onClick={tokenizeText} className="w-full">
                    Tokenize Text
                  </Button>

                  {tokenizedText.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Tokenized Result ({tokenizedText.length} tokens)</Label>
                      <div className="p-3 bg-muted rounded-md max-h-[200px] overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {tokenizedText.map((token, index) => (
                            <div key={index} className="px-2 py-1 bg-background border rounded-md text-sm">
                              {token}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Tokens</CardTitle>
              <CardDescription>Your collection of saved tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Token name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
                  <Button onClick={saveToken} disabled={!tokenName || !generatedToken}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                {savedTokens.length > 0 && (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {savedTokens.map((token) => (
                      <div key={token.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h4 className="font-medium">{token.name}</h4>
                            <p className="text-xs text-muted-foreground">{token.type.toUpperCase()}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => deleteToken(token.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="relative">
                          <pre className="p-2 bg-muted rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                            {token.token.length > 50 ? `${token.token.substring(0, 50)}...` : token.token}
                          </pre>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(token.token)
                              toast({
                                title: "Copied!",
                                description: "Token copied to clipboard.",
                              })
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Token</CardTitle>
              <CardDescription>Your token will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedToken ? (
                <div className="space-y-6">
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
                      {generatedToken}
                    </pre>
                    <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy
                    </Button>
                  </div>

                  {tokenType === "jwt" && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">JWT Structure</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <h4 className="font-medium">Header</h4>
                          </div>
                          <pre className="p-3 bg-blue-50 rounded-md text-xs font-mono overflow-x-auto">
                            {JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)}
                          </pre>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            <h4 className="font-medium">Payload</h4>
                          </div>
                          <pre className="p-3 bg-purple-50 rounded-md text-xs font-mono overflow-x-auto">{payload}</pre>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <h4 className="font-medium">Signature</h4>
                          </div>
                          <div className="p-3 bg-green-50 rounded-md text-xs font-mono">
                            HMACSHA256(
                            <br />
                            &nbsp;&nbsp;base64UrlEncode(header) + "." + base64UrlEncode(payload),
                            <br />
                            &nbsp;&nbsp;{secret}
                            <br />)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Usage Examples</h3>

                    <div className="space-y-2">
                      <h4 className="font-medium">JavaScript/Node.js</h4>
                      <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                        {`// Using the token in an Authorization header
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer ${generatedToken}'
  }
})`}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">cURL</h4>
                      <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                        {`curl -X GET \\
  -H "Authorization: Bearer ${generatedToken}" \\
  https://api.example.com/data`}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Security Tips</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Store tokens securely, preferably in HTTP-only cookies</li>
                        <li>Set appropriate expiration times for tokens</li>
                        <li>Use HTTPS to prevent token interception</li>
                        <li>Implement token refresh mechanisms for long-lived sessions</li>
                        <li>Validate tokens on the server for every protected request</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Lock className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>No token generated yet</p>
                  <p className="text-sm mt-1">Use the controls on the left to create a token</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

