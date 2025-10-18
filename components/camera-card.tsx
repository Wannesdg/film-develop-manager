"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Camera as CameraIcon } from "lucide-react"
import type { Camera } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface CameraCardProps {
  camera: Camera
  rollCount?: number
  onEdit: (camera: Camera) => void
  onDelete: (id: string) => void
}

export function CameraCard({ camera, rollCount = 0, onEdit, onDelete }: CameraCardProps) {
  const formatColors = {
    "35mm": "bg-chart-1",
    "120": "bg-chart-2",
    "4x5": "bg-chart-3",
    "other": "bg-chart-4",
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${formatColors[camera.format]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-muted">
              <CameraIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight text-balance">{camera.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {camera.brand} {camera.model}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(camera)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(camera.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="capitalize">
            {camera.format}
          </Badge>
          {rollCount > 0 && (
            <Badge variant="outline">
              {rollCount} roll{rollCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {camera.purchaseDate && (
            <div>
              <p className="text-muted-foreground">Purchased</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(camera.purchaseDate)}
              </p>
            </div>
          )}
          {camera.serialNumber && (
            <div>
              <p className="text-muted-foreground">Serial Number</p>
              <p className="font-medium font-mono text-xs">{camera.serialNumber}</p>
            </div>
          )}
        </div>

        {camera.notes && <p className="text-sm text-muted-foreground border-t pt-3">{camera.notes}</p>}
      </CardContent>
    </Card>
  )
}
