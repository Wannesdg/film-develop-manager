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
import type { Camera } from "@/lib/types"

interface CameraFormProps {
  camera?: Camera
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (camera: Omit<Camera, "id"> | Camera) => void
}

export function CameraForm({ camera, open, onOpenChange, onSave }: CameraFormProps) {
  const [formData, setFormData] = useState<Partial<Camera>>(
    camera || {
      name: "",
      brand: "",
      model: "",
      format: "35mm",
      notes: "",
      purchaseDate: "",
      serialNumber: "",
    },
  )

  useEffect(() => {
    if (camera) {
      setFormData(camera)
    } else {
      setFormData({
        name: "",
        brand: "",
        model: "",
        format: "35mm",
        notes: "",
        purchaseDate: "",
        serialNumber: "",
      })
    }
  }, [camera, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (camera) {
      onSave({ ...camera, ...formData } as Camera)
    } else {
      onSave(formData as Omit<Camera, "id">)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{camera ? "Edit Camera" : "Add New Camera"}</DialogTitle>
          <DialogDescription>
            {camera ? "Update camera information" : "Add a new camera to your collection"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Camera Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Nikon FM2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                placeholder="e.g., Nikon"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g., FM2"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Format *</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => setFormData({ ...formData, format: value as Camera["format"] })}
            >
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="35mm">35mm</SelectItem>
                <SelectItem value="120">120 (Medium Format)</SelectItem>
                <SelectItem value="4x5">4x5 (Large Format)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="e.g., 1234567"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information, quirks, condition..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{camera ? "Update" : "Add"} Camera</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
