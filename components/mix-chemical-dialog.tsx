"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Beaker, AlertTriangle } from "lucide-react"
import type { Chemical } from "@/lib/types"

interface MixChemicalDialogProps {
  concentrate?: Chemical
  open: boolean
  onOpenChange: (open: boolean) => void
  onMix: (mixedChemical: Omit<Chemical, "id">, concentrateUsed: number) => void
}

export function MixChemicalDialog({ concentrate, open, onOpenChange, onMix }: MixChemicalDialogProps) {
  const [dilutionParts, setDilutionParts] = useState({ concentrate: 1, water: 9 })
  const [totalVolume, setTotalVolume] = useState(1000)
  const [workingExpiryDays, setWorkingExpiryDays] = useState(1)
  const [notes, setNotes] = useState("")

  const concentrateNeeded = Math.round((totalVolume * dilutionParts.concentrate) / (dilutionParts.concentrate + dilutionParts.water))
  const waterNeeded = totalVolume - concentrateNeeded
  const remainingConcentrate = concentrate ? concentrate.capacity - concentrate.used : 0
  const hasEnoughConcentrate = concentrateNeeded <= remainingConcentrate

  // Calculate working expiry date
  const mixedDate = new Date()
  const workingExpiryDate = new Date(mixedDate)
  workingExpiryDate.setDate(workingExpiryDate.getDate() + workingExpiryDays)

  useEffect(() => {
    // Reset form when dialog opens with new concentrate
    if (open && concentrate) {
      // Try to parse dilution from concentrate (e.g., "1:9" or "1+9")
      let parsedDilution = { concentrate: 1, water: 9 }
      if (concentrate.dilution) {
        const parts = concentrate.dilution.split(/[:+]/).map((p) => parseInt(p.trim()))
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          parsedDilution = { concentrate: parts[0], water: parts[1] }
        }
      }

      setDilutionParts(parsedDilution)
      setTotalVolume(1000)
      setWorkingExpiryDays(1)
      setNotes("")
    }
  }, [open, concentrate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!concentrate || !hasEnoughConcentrate) return

    const mixedChemical: Omit<Chemical, "id"> = {
      name: `${concentrate.name} (Mixed ${dilutionParts.concentrate}:${dilutionParts.water})`,
      type: concentrate.type,
      brand: concentrate.brand,
      capacity: totalVolume,
      used: 0,
      dilution: `${dilutionParts.concentrate}:${dilutionParts.water}`,
      notes: notes || `Mixed from ${concentrate.name}`,
      purchaseDate: mixedDate.toISOString().split("T")[0],
      state: "mixed",
      parentChemicalId: concentrate.id,
      mixedDate: mixedDate.toISOString().split("T")[0],
      workingExpiryDate: workingExpiryDate.toISOString().split("T")[0],
    }

    onMix(mixedChemical, concentrateNeeded)
    onOpenChange(false)
  }

  if (!concentrate) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mix Working Solution</DialogTitle>
          <DialogDescription>
            Create a working solution from concentrate
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Concentrate Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background">
                  <Beaker className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{concentrate.name}</h3>
                  <p className="text-sm text-muted-foreground">{concentrate.brand}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {concentrate.type.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline">
                      {remainingConcentrate}ml available
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dilution Ratio */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Dilution Ratio</Label>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="concentrateParts">Concentrate Parts</Label>
                <Input
                  id="concentrateParts"
                  type="number"
                  min="1"
                  value={dilutionParts.concentrate}
                  onChange={(e) => setDilutionParts({ ...dilutionParts, concentrate: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="text-center text-2xl font-bold text-muted-foreground pb-2">:</div>
              <div className="space-y-2">
                <Label htmlFor="waterParts">Water Parts</Label>
                <Input
                  id="waterParts"
                  type="number"
                  min="0"
                  value={dilutionParts.water}
                  onChange={(e) => setDilutionParts({ ...dilutionParts, water: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Common ratios: 1:1 (stock), 1:4, 1:9, 1:19, 1:49
            </p>
          </div>

          {/* Total Volume */}
          <div className="space-y-2">
            <Label htmlFor="totalVolume">Total Volume to Mix (ml) *</Label>
            <Input
              id="totalVolume"
              type="number"
              min="50"
              step="50"
              value={totalVolume}
              onChange={(e) => setTotalVolume(Number(e.target.value))}
              required
            />
          </div>

          {/* Calculations Display */}
          <Card className={!hasEnoughConcentrate ? "border-destructive" : ""}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Concentrate needed:</span>
                  <span className="font-semibold text-lg">{concentrateNeeded} ml</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Water needed:</span>
                  <span className="font-semibold text-lg">{waterNeeded} ml</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium">Total volume:</span>
                  <span className="font-bold text-xl">{totalVolume} ml</span>
                </div>
                {!hasEnoughConcentrate && (
                  <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Insufficient concentrate!</p>
                      <p>You need {concentrateNeeded}ml but only have {remainingConcentrate}ml available.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Working Solution Expiry */}
          <div className="space-y-2">
            <Label htmlFor="workingExpiryDays">Working Solution Lifespan (days) *</Label>
            <Input
              id="workingExpiryDays"
              type="number"
              min="1"
              max="365"
              value={workingExpiryDays}
              onChange={(e) => setWorkingExpiryDays(Number(e.target.value))}
              required
            />
            <p className="text-sm text-muted-foreground">
              Working solution will expire on: {workingExpiryDate.toLocaleDateString()}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="mixNotes">Notes</Label>
            <Textarea
              id="mixNotes"
              placeholder="Optional notes about this mix..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!hasEnoughConcentrate}>
              Mix Solution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
