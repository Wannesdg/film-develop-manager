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
import { Star } from "lucide-react"
import type { FilmRoll, Recipe } from "@/lib/types"
import { getRecipes } from "@/lib/storage"

interface FilmRollFormProps {
  filmRoll?: FilmRoll
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (filmRoll: Omit<FilmRoll, "id"> | FilmRoll) => void
}

export function FilmRollForm({ filmRoll, open, onOpenChange, onSave }: FilmRollFormProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [formData, setFormData] = useState<Partial<FilmRoll>>(
    filmRoll || {
      filmName: "",
      filmType: "",
      iso: 400,
      format: "35mm",
      frames: 36,
      shotDate: "",
      developedDate: "",
      recipeId: "none", // Updated default value to be a non-empty string
      notes: "",
      rating: undefined,
    },
  )

  useEffect(() => {
    setRecipes(getRecipes())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filmRoll) {
      onSave({ ...filmRoll, ...formData } as FilmRoll)
    } else {
      onSave(formData as Omit<FilmRoll, "id">)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{filmRoll ? "Edit Film Roll" : "Add New Film Roll"}</DialogTitle>
          <DialogDescription>{filmRoll ? "Update film roll information" : "Log a new film roll"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filmName">Film Name *</Label>
              <Input
                id="filmName"
                placeholder="e.g., Roll #42"
                value={formData.filmName}
                onChange={(e) => setFormData({ ...formData, filmName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filmType">Film Type *</Label>
              <Input
                id="filmType"
                placeholder="e.g., Ilford HP5+"
                value={formData.filmType}
                onChange={(e) => setFormData({ ...formData, filmType: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iso">ISO *</Label>
              <Input
                id="iso"
                type="number"
                min="1"
                value={formData.iso}
                onChange={(e) => setFormData({ ...formData, iso: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value as FilmRoll["format"] })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="35mm">35mm</SelectItem>
                  <SelectItem value="120">120</SelectItem>
                  <SelectItem value="4x5">4x5</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frames">Frames *</Label>
              <Input
                id="frames"
                type="number"
                min="1"
                value={formData.frames}
                onChange={(e) => setFormData({ ...formData, frames: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shotDate">Shot Date</Label>
              <Input
                id="shotDate"
                type="date"
                value={formData.shotDate}
                onChange={(e) => setFormData({ ...formData, shotDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="developedDate">Developed Date</Label>
              <Input
                id="developedDate"
                type="date"
                value={formData.developedDate}
                onChange={(e) => setFormData({ ...formData, developedDate: e.target.value })}
              />
            </div>
          </div>

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
                  <SelectItem value="none">None</SelectItem> {/* Updated value prop to be a non-empty string */}
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  className="focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      formData.rating && i < formData.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  />
                </button>
              ))}
              {formData.rating && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, rating: undefined })}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Location, subjects, lighting conditions, results..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{filmRoll ? "Update" : "Add"} Film Roll</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
