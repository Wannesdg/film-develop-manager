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
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { DevelopmentRound, FilmRoll, Recipe, Chemical } from "@/lib/types"
import { getFilmRolls, getRecipes, getChemicals } from "@/lib/storage"

interface DevelopmentRoundFormProps {
  round?: DevelopmentRound
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (round: Omit<DevelopmentRound, "id"> | DevelopmentRound) => void
}

export function DevelopmentRoundForm({ round, open, onOpenChange, onSave }: DevelopmentRoundFormProps) {
  const [filmRolls, setFilmRolls] = useState<FilmRoll[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chemicals, setChemicals] = useState<Chemical[]>([])

  const [formData, setFormData] = useState<Partial<DevelopmentRound>>(
    round || {
      name: "",
      date: new Date().toISOString().split("T")[0],
      filmRollIds: [],
      chemicalsUsed: [],
      temperature: undefined,
      time: undefined,
      notes: "",
    },
  )

  const [selectedChemical, setSelectedChemical] = useState("")
  const [chemicalAmount, setChemicalAmount] = useState(0)

  useEffect(() => {
    setFilmRolls(getFilmRolls())
    setRecipes(getRecipes())
    setChemicals(getChemicals())
  }, [])

  useEffect(() => {
    if (round) {
      setFormData(round)
    } else {
      setFormData({
        name: "",
        date: new Date().toISOString().split("T")[0],
        filmRollIds: [],
        chemicalsUsed: [],
        temperature: undefined,
        time: undefined,
        notes: "",
      })
    }
  }, [round, open])

  const handleFilmRollToggle = (filmRollId: string) => {
    setFormData((prev) => ({
      ...prev,
      filmRollIds: prev.filmRollIds?.includes(filmRollId)
        ? prev.filmRollIds.filter((id) => id !== filmRollId)
        : [...(prev.filmRollIds || []), filmRollId],
    }))
  }

  const handleAddChemical = () => {
    if (!selectedChemical || chemicalAmount <= 0) return

    setFormData((prev) => ({
      ...prev,
      chemicalsUsed: [
        ...(prev.chemicalsUsed || []),
        { chemicalId: selectedChemical, amountUsed: chemicalAmount },
      ],
    }))

    setSelectedChemical("")
    setChemicalAmount(0)
  }

  const handleRemoveChemical = (chemicalId: string) => {
    setFormData((prev) => ({
      ...prev,
      chemicalsUsed: prev.chemicalsUsed?.filter((c) => c.chemicalId !== chemicalId) || [],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (round) {
      onSave({ ...round, ...formData } as DevelopmentRound)
    } else {
      onSave(formData as Omit<DevelopmentRound, "id">)
    }
    onOpenChange(false)
  }

  // Get undeveloped film rolls
  const undevelopedFilmRolls = filmRolls.filter((f) => !f.developedDate)

  // Get chemical details
  const getChemical = (chemicalId: string) => chemicals.find((c) => c.id === chemicalId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{round ? "Edit Development Round" : "Create Development Round"}</DialogTitle>
          <DialogDescription>
            {round ? "Update development round information" : "Record a new development session"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Round Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Weekend Development #12"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Film Rolls Selection */}
          <div className="space-y-2">
            <Label>Film Rolls to Develop *</Label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {undevelopedFilmRolls.length > 0 ? (
                undevelopedFilmRolls.map((filmRoll) => (
                  <label key={filmRoll.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.filmRollIds?.includes(filmRoll.id) || false}
                      onChange={() => handleFilmRollToggle(filmRoll.id)}
                      className="rounded"
                    />
                    <span className="flex-1">
                      {filmRoll.filmName} - {filmRoll.filmType}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {filmRoll.format}
                    </Badge>
                  </label>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No undeveloped film rolls available</p>
              )}
            </div>
          </div>

          {/* Recipe Selection */}
          {recipes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="recipeId">Recipe Used</Label>
              <Select
                value={formData.recipeId}
                onValueChange={(value) => setFormData({ ...formData, recipeId: value })}
              >
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

          {/* Chemicals Used */}
          <div className="space-y-2">
            <Label>Chemicals Used</Label>

            {/* Add Chemical */}
            <div className="flex gap-2">
              <Select value={selectedChemical} onValueChange={setSelectedChemical}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select chemical..." />
                </SelectTrigger>
                <SelectContent>
                  {chemicals.map((chemical) => (
                    <SelectItem key={chemical.id} value={chemical.id}>
                      {chemical.name} - {chemical.brand} ({chemical.capacity - chemical.used}ml available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                placeholder="Amount (ml)"
                value={chemicalAmount || ""}
                onChange={(e) => setChemicalAmount(Number(e.target.value))}
                className="w-32"
              />
              <Button type="button" onClick={handleAddChemical} size="icon" disabled={!selectedChemical || chemicalAmount <= 0}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Chemicals List */}
            {formData.chemicalsUsed && formData.chemicalsUsed.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2">
                {formData.chemicalsUsed.map(({ chemicalId, amountUsed }) => {
                  const chemical = getChemical(chemicalId)
                  if (!chemical) return null
                  return (
                    <div key={chemicalId} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">
                        {chemical.name} - {chemical.brand}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{amountUsed}ml</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveChemical(chemicalId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Development Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 20"
                value={formData.temperature || ""}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (minutes)</Label>
              <Input
                id="time"
                type="number"
                min="0"
                placeholder="e.g., 8"
                value={formData.time ? Math.floor(formData.time / 60) : ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value ? Number(e.target.value) * 60 : undefined })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Agitation patterns, observations, issues..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={(formData.filmRollIds?.length || 0) === 0}>
              {round ? "Update" : "Create"} Round
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
