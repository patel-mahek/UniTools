"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Code, ExternalLink, Star, Bookmark, CheckCircle, Smartphone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface Technology {
  id: string
  name: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  url: string
  category: string
  starred?: boolean
}

interface Domain {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  coreTechnologies: Technology[]
  additionalTechnologies: Technology[]
  learningPath: string[]
}

export default function TechStackAdvisor() {
  const { isAuthenticated } = useAuth()
  const [selectedDomain, setSelectedDomain] = useState<string | null>("frontend")
  const [starredTechnologies, setStarredTechnologies] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("core")

  // Define domains and their technologies
  const domains: Domain[] = [
    {
      id: "frontend",
      name: "Frontend Development",
      description:
        "Frontend development focuses on creating the user interface and experience of websites and web applications.",
      icon: <Code className="h-8 w-8 text-purple-600" />,
      coreTechnologies: [
        {
          id: "html",
          name: "HTML",
          description: "The standard markup language for creating web pages and web applications.",
          level: "beginner",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
          category: "markup",
        },
        {
          id: "css",
          name: "CSS",
          description: "A style sheet language used for describing the presentation of a document.",
          level: "beginner",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
          category: "styling",
        },
        {
          id: "javascript",
          name: "JavaScript",
          description: "A programming language that enables interactive web pages.",
          level: "beginner",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          category: "programming",
        },
        {
          id: "react",
          name: "React",
          description: "A JavaScript library for building user interfaces.",
          level: "intermediate",
          url: "https://reactjs.org/",
          category: "framework",
        },
        {
          id: "typescript",
          name: "TypeScript",
          description: "A typed superset of JavaScript that compiles to plain JavaScript.",
          level: "intermediate",
          url: "https://www.typescriptlang.org/",
          category: "programming",
        },
      ],
      additionalTechnologies: [
        {
          id: "nextjs",
          name: "Next.js",
          description: "A React framework with hybrid static & server rendering, TypeScript support, and more.",
          level: "intermediate",
          url: "https://nextjs.org/",
          category: "framework",
        },
        {
          id: "tailwindcss",
          name: "Tailwind CSS",
          description: "A utility-first CSS framework for rapidly building custom designs.",
          level: "intermediate",
          url: "https://tailwindcss.com/",
          category: "styling",
        },
        {
          id: "vue",
          name: "Vue.js",
          description: "A progressive framework for building user interfaces.",
          level: "intermediate",
          url: "https://vuejs.org/",
          category: "framework",
        },
        {
          id: "angular",
          name: "Angular",
          description: "A platform for building mobile and desktop web applications.",
          level: "advanced",
          url: "https://angular.io/",
          category: "framework",
        },
        {
          id: "webpack",
          name: "Webpack",
          description: "A static module bundler for modern JavaScript applications.",
          level: "advanced",
          url: "https://webpack.js.org/",
          category: "tooling",
        },
      ],
      learningPath: [
        "Start with HTML, CSS, and JavaScript fundamentals",
        "Learn responsive design principles",
        "Master a JavaScript framework (React, Vue, or Angular)",
        "Study TypeScript for type safety",
        "Explore build tools and module bundlers",
        "Learn state management patterns and libraries",
        "Study web performance optimization techniques",
        "Explore advanced CSS and animation",
      ],
    },
    {
      id: "backend",
      name: "Backend Development",
      description: "Backend development focuses on server-side logic, databases, and application architecture.",
      icon: <Code className="h-8 w-8 text-purple-600" />,
      coreTechnologies: [
        {
          id: "nodejs",
          name: "Node.js",
          description: "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
          level: "intermediate",
          url: "https://nodejs.org/",
          category: "runtime",
        },
        {
          id: "express",
          name: "Express.js",
          description: "A minimal and flexible Node.js web application framework.",
          level: "intermediate",
          url: "https://expressjs.com/",
          category: "framework",
        },
        {
          id: "sql",
          name: "SQL",
          description: "A standard language for storing, manipulating, and retrieving data in databases.",
          level: "intermediate",
          url: "https://www.w3schools.com/sql/",
          category: "database",
        },
        {
          id: "mongodb",
          name: "MongoDB",
          description: "A document-oriented NoSQL database used for high volume data storage.",
          level: "intermediate",
          url: "https://www.mongodb.com/",
          category: "database",
        },
        {
          id: "rest",
          name: "REST API Design",
          description: "Architectural style for designing networked applications.",
          level: "intermediate",
          url: "https://restfulapi.net/",
          category: "architecture",
        },
      ],
      additionalTechnologies: [
        {
          id: "graphql",
          name: "GraphQL",
          description: "A query language for APIs and a runtime for executing those queries.",
          level: "advanced",
          url: "https://graphql.org/",
          category: "api",
        },
        {
          id: "docker",
          name: "Docker",
          description: "A platform for developing, shipping, and running applications in containers.",
          level: "advanced",
          url: "https://www.docker.com/",
          category: "devops",
        },
        {
          id: "kubernetes",
          name: "Kubernetes",
          description:
            "An open-source system for automating deployment, scaling, and management of containerized applications.",
          level: "advanced",
          url: "https://kubernetes.io/",
          category: "devops",
        },
        {
          id: "python",
          name: "Python",
          description: "A programming language that lets you work quickly and integrate systems effectively.",
          level: "intermediate",
          url: "https://www.python.org/",
          category: "programming",
        },
        {
          id: "java",
          name: "Java",
          description: "A high-level, class-based, object-oriented programming language.",
          level: "advanced",
          url: "https://www.java.com/",
          category: "programming",
        },
      ],
      learningPath: [
        "Learn a server-side programming language (Node.js, Python, Java, etc.)",
        "Study database fundamentals (SQL and NoSQL)",
        "Master API design principles (REST, GraphQL)",
        "Learn authentication and authorization techniques",
        "Study server deployment and hosting options",
        "Explore containerization and orchestration",
        "Learn about microservices architecture",
        "Study performance optimization and scaling strategies",
      ],
    },
    {
      id: "fullstack",
      name: "Full Stack Development",
      description: "Full stack development combines both frontend and backend development skills.",
      icon: <Code className="h-8 w-8 text-purple-600" />,
      coreTechnologies: [
        {
          id: "html-css-js",
          name: "HTML, CSS, JavaScript",
          description: "The fundamental technologies for web development.",
          level: "beginner",
          url: "https://developer.mozilla.org/en-US/docs/Web",
          category: "frontend",
        },
        {
          id: "react-or-vue",
          name: "React or Vue.js",
          description: "Popular JavaScript frameworks for building user interfaces.",
          level: "intermediate",
          url: "https://reactjs.org/",
          category: "frontend",
        },
        {
          id: "nodejs-express",
          name: "Node.js & Express",
          description: "Server-side JavaScript runtime and framework.",
          level: "intermediate",
          url: "https://nodejs.org/",
          category: "backend",
        },
        {
          id: "databases",
          name: "SQL & NoSQL Databases",
          description: "Database technologies for storing and retrieving data.",
          level: "intermediate",
          url: "https://www.mongodb.com/",
          category: "backend",
        },
        {
          id: "git",
          name: "Git & GitHub",
          description: "Version control system and hosting platform for software development.",
          level: "beginner",
          url: "https://github.com/",
          category: "tooling",
        },
      ],
      additionalTechnologies: [
        {
          id: "nextjs-fullstack",
          name: "Next.js",
          description: "A React framework that enables server-side rendering and generating static websites.",
          level: "intermediate",
          url: "https://nextjs.org/",
          category: "framework",
        },
        {
          id: "typescript-fullstack",
          name: "TypeScript",
          description: "A typed superset of JavaScript that compiles to plain JavaScript.",
          level: "intermediate",
          url: "https://www.typescriptlang.org/",
          category: "programming",
        },
        {
          id: "graphql-fullstack",
          name: "GraphQL",
          description: "A query language for APIs and a runtime for executing those queries.",
          level: "advanced",
          url: "https://graphql.org/",
          category: "api",
        },
        {
          id: "aws",
          name: "AWS",
          description: "A comprehensive cloud computing platform provided by Amazon.",
          level: "advanced",
          url: "https://aws.amazon.com/",
          category: "cloud",
        },
        {
          id: "testing",
          name: "Testing Frameworks",
          description: "Tools for testing applications (Jest, Cypress, Mocha, etc.).",
          level: "intermediate",
          url: "https://jestjs.io/",
          category: "testing",
        },
      ],
      learningPath: [
        "Master HTML, CSS, and JavaScript fundamentals",
        "Learn a frontend framework (React, Vue, Angular)",
        "Study server-side programming with Node.js",
        "Learn database design and management",
        "Master API development and integration",
        "Study authentication and security best practices",
        "Learn deployment and DevOps basics",
        "Explore full-stack frameworks like Next.js or Nuxt.js",
      ],
    },
    {
      id: "mobile",
      name: "Mobile Development",
      description:
        "Mobile development focuses on creating applications for mobile devices like smartphones and tablets.",
      icon: <Smartphone className="h-8 w-8 text-purple-600" />,
      coreTechnologies: [
        {
          id: "react-native",
          name: "React Native",
          description: "A framework for building native apps using React.",
          level: "intermediate",
          url: "https://reactnative.dev/",
          category: "framework",
        },
        {
          id: "flutter",
          name: "Flutter",
          description: "Google's UI toolkit for building natively compiled applications.",
          level: "intermediate",
          url: "https://flutter.dev/",
          category: "framework",
        },
        {
          id: "swift",
          name: "Swift",
          description: "A powerful and intuitive programming language for iOS development.",
          level: "intermediate",
          url: "https://developer.apple.com/swift/",
          category: "programming",
        },
        {
          id: "kotlin",
          name: "Kotlin",
          description: "A modern programming language for Android development.",
          level: "intermediate",
          url: "https://kotlinlang.org/",
          category: "programming",
        },
        {
          id: "mobile-design",
          name: "Mobile UI/UX Design",
          description: "Principles and practices for designing mobile user interfaces.",
          level: "intermediate",
          url: "https://developer.android.com/design",
          category: "design",
        },
      ],
      additionalTechnologies: [
        {
          id: "pwa",
          name: "Progressive Web Apps",
          description: "Web apps that use modern web capabilities to provide an app-like experience.",
          level: "intermediate",
          url: "https://web.dev/progressive-web-apps/",
          category: "web",
        },
        {
          id: "firebase",
          name: "Firebase",
          description: "Google's platform for mobile and web application development.",
          level: "intermediate",
          url: "https://firebase.google.com/",
          category: "backend",
        },
        {
          id: "expo",
          name: "Expo",
          description: "An open-source platform for making universal native apps with React.",
          level: "intermediate",
          url: "https://expo.io/",
          category: "tooling",
        },
        {
          id: "native-apis",
          name: "Native Device APIs",
          description: "APIs for accessing device features like camera, GPS, and sensors.",
          level: "advanced",
          url: "https://reactnative.dev/docs/native-modules-intro",
          category: "api",
        },
        {
          id: "app-store",
          name: "App Store Optimization",
          description: "Techniques to improve an app's visibility in app stores.",
          level: "intermediate",
          url: "https://developer.apple.com/app-store/resources/",
          category: "marketing",
        },
      ],
      learningPath: [
        "Learn mobile development fundamentals",
        "Choose a development approach (native, cross-platform)",
        "Master a mobile framework or language",
        "Study mobile UI/UX design principles",
        "Learn about device APIs and capabilities",
        "Study offline storage and data synchronization",
        "Learn app deployment and distribution",
        "Explore analytics and performance monitoring",
      ],
    },
    {
      id: "devops",
      name: "DevOps",
      description: "DevOps combines software development and IT operations to shorten the development lifecycle.",
      icon: <Code className="h-8 w-8 text-purple-600" />,
      coreTechnologies: [
        {
          id: "linux",
          name: "Linux",
          description: "An open-source operating system that's essential for most server environments.",
          level: "intermediate",
          url: "https://www.linux.org/",
          category: "os",
        },
        {
          id: "git-devops",
          name: "Git & GitHub",
          description: "Version control system and platform for collaborative development.",
          level: "intermediate",
          url: "https://github.com/",
          category: "version-control",
        },
        {
          id: "docker-devops",
          name: "Docker",
          description: "A platform for developing, shipping, and running applications in containers.",
          level: "intermediate",
          url: "https://www.docker.com/",
          category: "containerization",
        },
        {
          id: "ci-cd",
          name: "CI/CD",
          description: "Continuous Integration and Continuous Deployment practices and tools.",
          level: "intermediate",
          url: "https://github.com/features/actions",
          category: "automation",
        },
        {
          id: "cloud-platforms",
          name: "Cloud Platforms",
          description: "Services like AWS, Azure, and Google Cloud for hosting and infrastructure.",
          level: "intermediate",
          url: "https://aws.amazon.com/",
          category: "cloud",
        },
      ],
      additionalTechnologies: [
        {
          id: "kubernetes-devops",
          name: "Kubernetes",
          description:
            "An open-source system for automating deployment, scaling, and management of containerized applications.",
          level: "advanced",
          url: "https://kubernetes.io/",
          category: "orchestration",
        },
        {
          id: "terraform",
          name: "Terraform",
          description: "An open-source infrastructure as code software tool.",
          level: "advanced",
          url: "https://www.terraform.io/",
          category: "iac",
        },
        {
          id: "ansible",
          name: "Ansible",
          description:
            "An open-source software provisioning, configuration management, and application-deployment tool.",
          level: "advanced",
          url: "https://www.ansible.com/",
          category: "automation",
        },
        {
          id: "monitoring",
          name: "Monitoring Tools",
          description: "Tools like Prometheus, Grafana, and ELK stack for monitoring and logging.",
          level: "intermediate",
          url: "https://prometheus.io/",
          category: "monitoring",
        },
        {
          id: "security",
          name: "Security Practices",
          description: "DevSecOps practices and tools for secure development and deployment.",
          level: "advanced",
          url: "https://www.devsecops.org/",
          category: "security",
        },
      ],
      learningPath: [
        "Learn Linux fundamentals and shell scripting",
        "Master version control with Git",
        "Study containerization with Docker",
        "Learn CI/CD principles and tools",
        "Study cloud platforms and services",
        "Explore infrastructure as code",
        "Learn monitoring and logging techniques",
        "Study security best practices in DevOps",
      ],
    },
  ]

  // Toggle star status for a technology
  const toggleStar = (techId: string) => {
    if (starredTechnologies.includes(techId)) {
      setStarredTechnologies(starredTechnologies.filter((id) => id !== techId))
      toast({
        title: "Removed from favorites",
        description: "Technology removed from your favorites.",
      })
    } else {
      setStarredTechnologies([...starredTechnologies, techId])
      toast({
        title: "Added to favorites",
        description: "Technology added to your favorites.",
      })
    }
  }

  // Get the currently selected domain
  const getCurrentDomain = () => {
    return domains.find((domain) => domain.id === selectedDomain) || domains[0]
  }

  // Get technologies with star status
  const getStarredTechnologies = (technologies: Technology[]) => {
    return technologies.map((tech) => ({
      ...tech,
      starred: starredTechnologies.includes(tech.id),
    }))
  }

  // Premium feature check
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="mb-6">Tech Stack Advisor is a premium feature. Please login to access this tool.</p>
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
        <h1 className="text-3xl font-bold">Tech Stack Advisor</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this tool</CardTitle>
          <CardDescription>
            Discover the technologies you need to learn for different development domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Tech Stack Advisor helps you navigate the complex world of development technologies:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Explore different development domains (frontend, backend, mobile, etc.)</li>
            <li>Discover core technologies required for each domain</li>
            <li>Find additional technologies to expand your skills</li>
            <li>Follow recommended learning paths</li>
            <li>Save your favorite technologies for future reference</li>
          </ul>
          <p className="mt-4">How to use this tool:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Select a development domain you're interested in</li>
            <li>Explore the core and additional technologies</li>
            <li>Star technologies you want to learn or remember</li>
            <li>Follow the recommended learning path</li>
            <li>Click on technology links to access learning resources</li>
          </ol>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800">
              <strong>Premium Feature:</strong> This tool is available as part of your premium subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Domain Selection */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Domains</CardTitle>
              <CardDescription>Select a domain to explore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {domains.map((domain) => (
                  <Button
                    key={domain.id}
                    variant={selectedDomain === domain.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedDomain(domain.id)}
                  >
                    {domain.icon}
                    <span className="ml-2">{domain.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Starred Technologies</CardTitle>
              <CardDescription>Your saved technologies</CardDescription>
            </CardHeader>
            <CardContent>
              {starredTechnologies.length > 0 ? (
                <div className="space-y-3">
                  {domains.map((domain) => {
                    const domainTechs = [...domain.coreTechnologies, ...domain.additionalTechnologies].filter((tech) =>
                      starredTechnologies.includes(tech.id),
                    )

                    if (domainTechs.length === 0) return null

                    return (
                      <div key={domain.id} className="space-y-2">
                        <h3 className="font-medium text-sm">{domain.name}</h3>
                        <div className="space-y-1">
                          {domainTechs.map((tech) => (
                            <div key={tech.id} className="flex items-center justify-between p-2 border rounded-md">
                              <span className="font-medium">{tech.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => toggleStar(tech.id)}
                              >
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No starred technologies yet</p>
                  <p className="text-sm mt-1">Click the star icon to save technologies</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Technology Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{getCurrentDomain().name}</CardTitle>
              <CardDescription>{getCurrentDomain().description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="core" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="core">Core Technologies</TabsTrigger>
                  <TabsTrigger value="additional">Additional Technologies</TabsTrigger>
                  <TabsTrigger value="learning">Learning Path</TabsTrigger>
                </TabsList>

                <TabsContent value="core">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getStarredTechnologies(getCurrentDomain().coreTechnologies).map((tech) => (
                      <div key={tech.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">{tech.name}</h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStar(tech.id)}>
                            <Star
                              className={`h-5 w-5 ${
                                tech.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        </div>
                        <p className="text-muted-foreground">{tech.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                tech.level === "beginner"
                                  ? "bg-green-100 text-green-800"
                                  : tech.level === "intermediate"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {tech.level.charAt(0).toUpperCase() + tech.level.slice(1)}
                            </span>
                            <span className="text-xs ml-2 text-muted-foreground">{tech.category}</span>
                          </div>
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                          >
                            Learn <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="additional">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getStarredTechnologies(getCurrentDomain().additionalTechnologies).map((tech) => (
                      <div key={tech.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">{tech.name}</h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStar(tech.id)}>
                            <Star
                              className={`h-5 w-5 ${
                                tech.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        </div>
                        <p className="text-muted-foreground">{tech.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                tech.level === "beginner"
                                  ? "bg-green-100 text-green-800"
                                  : tech.level === "intermediate"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {tech.level.charAt(0).toUpperCase() + tech.level.slice(1)}
                            </span>
                            <span className="text-xs ml-2 text-muted-foreground">{tech.category}</span>
                          </div>
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                          >
                            Learn <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="learning">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Recommended Learning Path</h3>
                      <div className="space-y-3">
                        {getCurrentDomain().learningPath.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                            <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Learning Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium">Online Courses</h4>
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.udemy.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Udemy
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.coursera.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Coursera
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.pluralsight.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Pluralsight
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium">Documentation & Tutorials</h4>
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://developer.mozilla.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                MDN Web Docs
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.w3schools.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                W3Schools
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.freecodecamp.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                freeCodeCamp
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium">YouTube Channels</h4>
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.youtube.com/c/TraversyMedia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Traversy Media
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.youtube.com/c/TheNetNinja"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                The Net Ninja
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.youtube.com/c/Fireship"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Fireship
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium">Practice & Projects</h4>
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                GitHub
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.frontendmentor.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Frontend Mentor
                              </a>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <a
                                href="https://www.hackerrank.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                HackerRank
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Opportunities</CardTitle>
              <CardDescription>Job roles and career paths in {getCurrentDomain().name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedDomain === "frontend" && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Frontend Developer</h3>
                        <p className="text-muted-foreground">
                          Build user interfaces and implement visual elements that users interact with.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $75,000 - $120,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">UI/UX Developer</h3>
                        <p className="text-muted-foreground">
                          Focus on creating intuitive, accessible, and visually appealing interfaces.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $80,000 - $130,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">React Developer</h3>
                        <p className="text-muted-foreground">
                          Specialize in building applications using React and related technologies.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $85,000 - $140,000</div>
                      </div>
                    </>
                  )}

                  {selectedDomain === "backend" && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Backend Developer</h3>
                        <p className="text-muted-foreground">
                          Build and maintain server-side applications, databases, and APIs.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $80,000 - $130,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">API Developer</h3>
                        <p className="text-muted-foreground">
                          Design and implement APIs for internal and external consumption.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $85,000 - $135,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Database Administrator</h3>
                        <p className="text-muted-foreground">Manage, optimize, and secure database systems.</p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $90,000 - $140,000</div>
                      </div>
                    </>
                  )}

                  {selectedDomain === "fullstack" && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Full Stack Developer</h3>
                        <p className="text-muted-foreground">Work on both client and server-side of applications.</p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $85,000 - $140,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Software Engineer</h3>
                        <p className="text-muted-foreground">
                          Design, develop, and maintain complete software systems.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $90,000 - $150,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Web Application Developer</h3>
                        <p className="text-muted-foreground">Build complex web applications from front to back.</p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $80,000 - $135,000</div>
                      </div>
                    </>
                  )}

                  {selectedDomain === "mobile" && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Mobile App Developer</h3>
                        <p className="text-muted-foreground">
                          Create applications for iOS, Android, or cross-platform.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $85,000 - $140,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">iOS Developer</h3>
                        <p className="text-muted-foreground">
                          Specialize in developing applications for Apple's iOS platform.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $90,000 - $145,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Android Developer</h3>
                        <p className="text-muted-foreground">
                          Focus on creating applications for the Android platform.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $85,000 - $140,000</div>
                      </div>
                    </>
                  )}

                  {selectedDomain === "devops" && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">DevOps Engineer</h3>
                        <p className="text-muted-foreground">
                          Implement and manage CI/CD pipelines and infrastructure.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $95,000 - $150,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Site Reliability Engineer</h3>
                        <p className="text-muted-foreground">
                          Focus on availability, performance, and reliability of systems.
                        </p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $100,000 - $160,000</div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-lg">Cloud Engineer</h3>
                        <p className="text-muted-foreground">Design and implement cloud infrastructure and services.</p>
                        <div className="text-sm text-muted-foreground">Avg. Salary: $90,000 - $150,000</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <h3 className="font-medium mb-2">Career Growth Path</h3>
                  <p className="text-sm text-purple-800">
                    As you gain experience in {getCurrentDomain().name}, you can progress from Junior to Senior roles,
                    and eventually to Lead, Architect, or Management positions. Continuous learning and staying updated
                    with the latest technologies are key to career advancement in this field.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

