"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Film, Calendar, Star } from "lucide-react"
import type { FilmRoll } from "@/lib/types"

interface FilmRollCardProps {
  filmRoll: FilmRoll
  recipeName?: string
  onEdit: (filmRoll: FilmRoll) => void
  onDelete: (id: string) => void
}

export function FilmRollCard({ filmRoll, recipeName, onEdit, onDelete }: FilmRollCardProps) {
  const isDeveloped = !!filmRoll.developedDate

  const formatColors = {
    "35mm": "bg-chart-1",
    "120": "bg-chart-2",
    "4x5": "bg-chart-3",
    other: "bg-chart-4",
  }

  return (
    <Card className={`relative overflow-hidden ${isDeveloped ? "border-primary/50" : ""}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${formatColors[filmRoll.format]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-muted">
              <Film className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight text-balance">{filmRoll.filmName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{filmRoll.filmType}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(filmRoll)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(filmRoll.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="capitalize">
            {filmRoll.format}
          </Badge>
          <Badge variant="outline">ISO {filmRoll.iso}</Badge>
          <Badge variant="outline">{filmRoll.frames} frames</Badge>
          {isDeveloped ? (
            <Badge className="bg-primary">Developed</Badge>
          ) : (
            <Badge variant="secondary">Not Developed</Badge>
          )}
        </div>

        {filmRoll.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < filmRoll.rating! ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm">
          {filmRoll.shotDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Shot:</span>
              <span className="font-medium">{new Date(filmRoll.shotDate).toLocaleDateString()}</span>
            </div>
          )}
          {filmRoll.developedDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Developed:</span>
              <span className="font-medium">{new Date(filmRoll.developedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {recipeName && (
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Recipe Used</p>
            <p className="text-sm font-medium">{recipeName}</p>
          </div>
        )}

        {filmRoll.notes && <p className="text-sm text-muted-foreground border-t pt-3">{filmRoll.notes}</p>}
      </CardContent>
    </Card>
  )
}
