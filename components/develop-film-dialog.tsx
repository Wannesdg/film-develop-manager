"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Film, Star } from "lucide-react"
import type { FilmRoll, Recipe, Chemical } from "@/lib/types"
import { getRecipes, getChemicals } from "@/lib/storage"

interface DevelopFilmDialogProps {
  filmRoll?: FilmRoll
  open: boolean
  onOpenChange: (open: boolean) => void
  onDevelop: (developmentData: {
    developedDate: string
    recipeId?: string
    chemicalsUsed?: string[]
    rating?: number
    notes?: string
  }) => void
}

export function DevelopFilmDialog({ filmRoll, open, onOpenChange, onDevelop }: DevelopFilmDialogProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const [developedDate, setDevelopedDate] = useState(new Date().toISOString().split("T")[0])
  const [recipeId, setRecipeId] = useState<string>("")
  const [selectedChemicals, setSelectedChemicals] = useState<string[]>([])
  const [rating, setRating] = useState<number | undefined>()
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setRecipes(getRecipes())
    setChemicals(getChemicals())
  }, [])

  useEffect(() => {
    // Reset form when dialog opens
    if (open && filmRoll) {
      setDevelopedDate(new Date().toISOString().split("T")[0])
      setRecipeId("")
      setSelectedChemicals([])
      setRating(undefined)
      setNotes("")
    }
  }, [open, filmRoll])

  const handleChemicalToggle = (chemicalId: string) => {
    setSelectedChemicals((prev) =>
      prev.includes(chemicalId) ? prev.filter((id) => id !== chemicalId) : [...prev, chemicalId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onDevelop({
      developedDate,
      recipeId: recipeId || undefined,
      chemicalsUsed: selectedChemicals.length > 0 ? selectedChemicals : undefined,
      rating,
      notes: notes || undefined,
    })
    onOpenChange(false)
  }

  if (!filmRoll) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Film Roll as Developed</DialogTitle>
          <DialogDescription>Record the development details for this film roll</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Film Roll Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background">
                  <Film className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{filmRoll.filmName}</h3>
                  <p className="text-sm text-muted-foreground">{filmRoll.filmType}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {filmRoll.format}
                    </Badge>
                    <Badge variant="outline">ISO {filmRoll.iso}</Badge>
                    <Badge variant="outline">{filmRoll.frames} frames</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Details */}
          <div className="space-y-2">
            <Label htmlFor="developedDate">Developed Date *</Label>
            <Input
              id="developedDate"
              type="date"
              value={developedDate}
              onChange={(e) => setDevelopedDate(e.target.value)}
              required
            />
          </div>

          {recipes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="recipeId">Recipe Used</Label>
              <Select value={recipeId} onValueChange={setRecipeId}>
                <SelectTrigger id="recipeId">
                  <SelectValue placeholder="Select a recipe (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} - {recipe.filmType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {chemicals.length > 0 && (
            <div className="space-y-2">
              <Label>Chemicals Used</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {chemicals.map((chemical) => (
                  <label key={chemical.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedChemicals.includes(chemical.id)}
                      onChange={() => handleChemicalToggle(chemical.id)}
                      className="rounded"
                    />
                    <span className="flex-1">
                      {chemical.name} - {chemical.brand}
                    </span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {chemical.type.replace("-", " ")}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      rating && i < rating ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  />
                </button>
              ))}
              {rating && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setRating(undefined)}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="devNotes">Development Notes</Label>
            <Textarea
              id="devNotes"
              placeholder="Temperature variations, agitation patterns, results..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Mark as Developed</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
