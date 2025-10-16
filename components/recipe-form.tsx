"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Recipe } from "@/lib/types"

interface RecipeFormProps {
  recipe?: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (recipe: Omit<Recipe, "id"> | Recipe) => void
}

export function RecipeForm({ recipe, open, onOpenChange, onSave }: RecipeFormProps) {
  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      name: "",
      filmType: "",
      developer: "",
      dilution: "",
      temperature: 20,
      time: 0,
      agitation: "",
      notes: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (recipe) {
      onSave({ ...recipe, ...formData } as Recipe)
    } else {
      onSave(formData as Omit<Recipe, "id">)
    }
    onOpenChange(false)
  }

  const handleTimeChange = (field: "minutes" | "seconds", value: string) => {
    const numValue = Number(value) || 0
    const currentTime = formData.time || 0
    const currentMinutes = Math.floor(currentTime / 60)
    const currentSeconds = currentTime % 60

    if (field === "minutes") {
      setFormData({ ...formData, time: numValue * 60 + currentSeconds })
    } else {
      setFormData({ ...formData, time: currentMinutes * 60 + numValue })
    }
  }

  const minutes = Math.floor((formData.time || 0) / 60)
  const seconds = (formData.time || 0) % 60

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
          <DialogDescription>
            {recipe ? "Update recipe information" : "Create a new development recipe"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Name *</Label>
            <Input
              id="name"
              placeholder="e.g., HP5+ in D76"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filmType">Film Type *</Label>
            <Input
              id="filmType"
              placeholder="e.g., Ilford HP5+ 400"
              value={formData.filmType}
              onChange={(e) => setFormData({ ...formData, filmType: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">Developer *</Label>
              <Input
                id="developer"
                placeholder="e.g., Kodak D76"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dilution">Dilution *</Label>
              <Input
                id="dilution"
                placeholder="e.g., 1+1, Stock"
                value={formData.dilution}
                onChange={(e) => setFormData({ ...formData, dilution: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C) *</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Development Time *</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minutes}
                    onChange={(e) => handleTimeChange("minutes", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="Sec"
                    value={seconds}
                    onChange={(e) => handleTimeChange("seconds", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agitation">Agitation Pattern *</Label>
            <Input
              id="agitation"
              placeholder="e.g., 10s initial, then 3 inversions every 30s"
              value={formData.agitation}
              onChange={(e) => setFormData({ ...formData, agitation: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes, push/pull info, results..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{recipe ? "Update" : "Add"} Recipe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
