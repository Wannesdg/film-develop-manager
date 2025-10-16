"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Clock, Thermometer, Droplet } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight text-balance">{recipe.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{recipe.filmType}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(recipe)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Developer:</span>
            <span className="font-medium">{recipe.developer}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{recipe.dilution}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <Thermometer className="h-4 w-4 text-chart-1" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-medium">{recipe.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <Clock className="h-4 w-4 text-chart-2" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">{formatTime(recipe.time)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Agitation</p>
          <p className="text-sm">{recipe.agitation}</p>
        </div>

        {recipe.notes && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground">{recipe.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
