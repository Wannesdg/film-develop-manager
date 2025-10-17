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
import type { Chemical } from "@/lib/types"
import { getChemicals } from "@/lib/storage"

interface ChemicalFormProps {
  chemical?: Chemical
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (chemical: Omit<Chemical, "id"> | Chemical) => void
}

export function ChemicalForm({ chemical, open, onOpenChange, onSave }: ChemicalFormProps) {
  const [formData, setFormData] = useState<Partial<Chemical>>(
    chemical || {
      name: "",
      type: "developer",
      brand: "",
      capacity: 1000,
      used: 0,
      dilution: "",
      notes: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      cost: undefined,
      state: "concentrate", // default to concentrate for new chemicals
    },
  )
  const [concentrateChemicals, setConcentrateChemicals] = useState<Chemical[]>([])

  useEffect(() => {
    // Load available concentrate chemicals for the parent dropdown
    const chemicals = getChemicals()
    const concentrates = chemicals.filter((c) => (c.state || "concentrate") === "concentrate")
    setConcentrateChemicals(concentrates)
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chemical) {
      // Ensure existing chemicals get state if they don't have one
      onSave({ ...chemical, ...formData, state: formData.state || chemical.state || "concentrate" } as Chemical)
    } else {
      // New chemicals default to concentrate
      onSave({ ...formData, state: formData.state || "concentrate" } as Omit<Chemical, "id">)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{chemical ? "Edit Chemical" : "Add New Chemical"}</DialogTitle>
          <DialogDescription>
            {chemical ? "Update chemical information" : "Add a new chemical to your inventory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Chemical["type"] })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="stop-bath">Stop Bath</SelectItem>
                  <SelectItem value="fixer">Fixer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state || "concentrate"}
                onValueChange={(value) => setFormData({ ...formData, state: value as Chemical["state"] })}
                disabled={!!formData.parentChemicalId}
              >
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concentrate">Concentrate</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dilution">Dilution</Label>
              <Input
                id="dilution"
                placeholder="e.g., 1+1, 1+9"
                value={formData.dilution}
                onChange={(e) => setFormData({ ...formData, dilution: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (ml) *</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="used">Used (ml) *</Label>
              <Input
                id="used"
                type="number"
                min="0"
                max={formData.capacity}
                value={formData.used}
                onChange={(e) => setFormData({ ...formData, used: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {formData.state === "mixed" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="parentChemicalId">Source Concentrate</Label>
                <Select
                  value={formData.parentChemicalId || ""}
                  onValueChange={(value) => setFormData({ ...formData, parentChemicalId: value })}
                >
                  <SelectTrigger id="parentChemicalId">
                    <SelectValue placeholder="Select source concentrate..." />
                  </SelectTrigger>
                  <SelectContent>
                    {concentrateChemicals.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mixedDate">Mixed Date *</Label>
                  <Input
                    id="mixedDate"
                    type="date"
                    value={formData.mixedDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, mixedDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingExpiryDate">Working Solution Expiry</Label>
                  <Input
                    id="workingExpiryDate"
                    type="date"
                    value={formData.workingExpiryDate}
                    onChange={(e) => setFormData({ ...formData, workingExpiryDate: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              value={formData.cost || ""}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{chemical ? "Update" : "Add"} Chemical</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
