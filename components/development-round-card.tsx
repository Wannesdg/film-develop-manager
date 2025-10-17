"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Layers, Film, Beaker, Calendar } from "lucide-react"
import type { DevelopmentRound, FilmRoll, Recipe, Chemical } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface DevelopmentRoundCardProps {
  round: DevelopmentRound
  filmRolls: FilmRoll[]
  recipe?: Recipe
  chemicals: Chemical[]
  onEdit: (round: DevelopmentRound) => void
  onDelete: (id: string) => void
}

export function DevelopmentRoundCard({
  round,
  filmRolls,
  recipe,
  chemicals,
  onEdit,
  onDelete,
}: DevelopmentRoundCardProps) {
  // Get the film rolls for this round
  const roundFilmRolls = filmRolls.filter((f) => round.filmRollIds.includes(f.id))

  // Get chemical details
  const getChemical = (chemicalId: string) => chemicals.find((c) => c.id === chemicalId)

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-chart-1" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-muted">
              <Layers className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight text-balance">{round.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                {formatDate(round.date)}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(round)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(round.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Film Rolls */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Film Rolls ({roundFilmRolls.length})</span>
          </div>
          <div className="space-y-1">
            {roundFilmRolls.map((filmRoll) => (
              <div key={filmRoll.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                <span>{filmRoll.filmName}</span>
                <Badge variant="outline" className="capitalize">
                  {filmRoll.format}
                </Badge>
              </div>
            ))}
            {roundFilmRolls.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No film rolls linked</p>
            )}
          </div>
        </div>

        {/* Recipe */}
        {recipe && (
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Recipe Used</p>
            <p className="text-sm font-medium">{recipe.name}</p>
            <p className="text-xs text-muted-foreground">{recipe.filmType}</p>
          </div>
        )}

        {/* Chemicals Used */}
        {round.chemicalsUsed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Beaker className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Chemicals Used</span>
            </div>
            <div className="space-y-1">
              {round.chemicalsUsed.map(({ chemicalId, amountUsed }) => {
                const chemical = getChemical(chemicalId)
                if (!chemical) return null
                return (
                  <div key={chemicalId} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                    <span>
                      {chemical.name} - {chemical.brand}
                    </span>
                    <span className="text-muted-foreground">{amountUsed}ml</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Development Parameters */}
        {(round.temperature || round.time) && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {round.temperature && (
              <div>
                <p className="text-muted-foreground">Temperature</p>
                <p className="font-medium">{round.temperature}°C</p>
              </div>
            )}
            {round.time && (
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">{Math.floor(round.time / 60)}:{String(round.time % 60).padStart(2, "0")}</p>
              </div>
            )}
          </div>
        )}

        {round.notes && <p className="text-sm text-muted-foreground border-t pt-3">{round.notes}</p>}
      </CardContent>
    </Card>
  )
}
