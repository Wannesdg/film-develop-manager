"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Beaker, Film, BookOpen, TrendingUp, Calendar, Star } from "lucide-react"
import { getChemicals, getRecipes, getFilmRolls } from "@/lib/storage"

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalChemicals: 0,
    lowStockChemicals: 0,
    totalRecipes: 0,
    totalFilmRolls: 0,
    developedRolls: 0,
    undevelopedRolls: 0,
    averageRating: 0,
    mostUsedFormat: "",
    mostUsedRecipe: "",
    recentActivity: [] as { date: string; count: number }[],
    filmsByFormat: [] as { format: string; count: number }[],
    chemicalsByType: [] as { type: string; count: number }[],
  })

  useEffect(() => {
    const chemicals = getChemicals()
    const recipes = getRecipes()
    const filmRolls = getFilmRolls()

    // Basic counts
    const totalChemicals = chemicals.length
    const lowStockChemicals = chemicals.filter((c) => (c.capacity - c.used) / c.capacity < 0.25).length
    const totalRecipes = recipes.length
    const totalFilmRolls = filmRolls.length
    const developedRolls = filmRolls.filter((f) => f.developedDate).length
    const undevelopedRolls = totalFilmRolls - developedRolls

    // Average rating
    const ratedRolls = filmRolls.filter((f) => f.rating)
    const averageRating =
      ratedRolls.length > 0 ? ratedRolls.reduce((sum, f) => sum + (f.rating || 0), 0) / ratedRolls.length : 0

    // Most used format
    const formatCounts = filmRolls.reduce(
      (acc, f) => {
        acc[f.format] = (acc[f.format] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const mostUsedFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    // Most used recipe
    const recipeCounts = filmRolls
      .filter((f) => f.recipeId)
      .reduce(
        (acc, f) => {
          acc[f.recipeId!] = (acc[f.recipeId!] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    const mostUsedRecipeId = Object.entries(recipeCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const mostUsedRecipe = recipes.find((r) => r.id === mostUsedRecipeId)?.name || "N/A"

    // Films by format
    const filmsByFormat = Object.entries(formatCounts)
      .map(([format, count]) => ({ format, count }))
      .sort((a, b) => b.count - a.count)

    // Chemicals by type
    const chemicalTypeCounts = chemicals.reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const chemicalsByType = Object.entries(chemicalTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    // Recent activity (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const recentRolls = filmRolls.filter((f) => f.developedDate && new Date(f.developedDate) >= sixMonthsAgo)

    const monthCounts = recentRolls.reduce(
      (acc, f) => {
        const month = new Date(f.developedDate!).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentActivity = Object.entries(monthCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setStats({
      totalChemicals,
      lowStockChemicals,
      totalRecipes,
      totalFilmRolls,
      developedRolls,
      undevelopedRolls,
      averageRating,
      mostUsedFormat,
      mostUsedRecipe,
      recentActivity,
      filmsByFormat,
      chemicalsByType,
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-balance">Statistics</h1>
            <p className="text-muted-foreground mt-2">Overview of your film development activity</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Chemicals</CardDescription>
                  <Beaker className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalChemicals}</div>
                {stats.lowStockChemicals > 0 && (
                  <p className="text-xs text-destructive mt-1">{stats.lowStockChemicals} low stock</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Recipes</CardDescription>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRecipes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Film Rolls</CardDescription>
                  <Film className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalFilmRolls}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.developedRolls} developed, {stats.undevelopedRolls} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Average Rating</CardDescription>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(stats.averageRating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Used Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{stats.mostUsedFormat}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Used Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.mostUsedRecipe}</div>
              </CardContent>
            </Card>
          </div>

          {/* Films by Format */}
          {stats.filmsByFormat.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Films by Format</CardTitle>
                <CardDescription>Distribution of your film rolls by format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.filmsByFormat.map((item) => {
                    const percentage = (item.count / stats.totalFilmRolls) * 100
                    return (
                      <div key={item.format} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{item.format}</span>
                          <span className="text-muted-foreground">
                            {item.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chemicals by Type */}
          {stats.chemicalsByType.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Chemicals by Type</CardTitle>
                <CardDescription>Your chemical inventory breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.chemicalsByType.map((item) => {
                    const percentage = (item.count / stats.totalChemicals) * 100
                    return (
                      <div key={item.type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{item.type.replace("-", " ")}</span>
                          <span className="text-muted-foreground">
                            {item.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-chart-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {stats.recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Development Activity</CardTitle>
                <CardDescription>Film rolls developed in the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((item) => (
                    <div key={item.date} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{item.count}</span>
                        <span className="text-sm text-muted-foreground">rolls</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {stats.totalFilmRolls === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Start logging film rolls to see your development statistics!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
