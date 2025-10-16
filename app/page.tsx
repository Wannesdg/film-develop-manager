"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Beaker, BookOpen, Film, BarChart3, ArrowRight } from "lucide-react"
import { getChemicals, getRecipes, getFilmRolls } from "@/lib/storage"

export default function HomePage() {
  const [stats, setStats] = useState({
    chemicals: 0,
    recipes: 0,
    filmRolls: 0,
    developed: 0,
  })

  useEffect(() => {
    const chemicals = getChemicals()
    const recipes = getRecipes()
    const filmRolls = getFilmRolls()
    const developed = filmRolls.filter((f) => f.developedDate).length

    setStats({
      chemicals: chemicals.length,
      recipes: recipes.length,
      filmRolls: filmRolls.length,
      developed,
    })
  }, [])

  const features = [
    {
      icon: Beaker,
      title: "Chemicals",
      description: "Track your chemistry inventory, usage, and expiration dates",
      href: "/chemicals",
      count: stats.chemicals,
      color: "text-chart-1",
    },
    {
      icon: BookOpen,
      title: "Recipes",
      description: "Store and organize your development recipes and techniques",
      href: "/recipes",
      count: stats.recipes,
      color: "text-chart-2",
    },
    {
      icon: Film,
      title: "Film Rolls",
      description: "Log your film rolls, development process, and results",
      href: "/film-rolls",
      count: stats.filmRolls,
      color: "text-chart-3",
    },
    {
      icon: BarChart3,
      title: "Statistics",
      description: "Analyze your development patterns and track progress",
      href: "/stats",
      count: stats.developed,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">Film Development Tracker</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Your complete analog photography companion for tracking chemicals, recipes, and film development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.href} className="group hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <div className="text-2xl font-bold mt-1">{feature.count}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View {feature.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Start tracking your analog photography workflow in three simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Add your chemicals to track inventory and usage</li>
              <li>Create development recipes for different film types</li>
              <li>Log your film rolls and link them to recipes for reference</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
