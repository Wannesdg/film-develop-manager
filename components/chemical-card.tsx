"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2, Beaker, FlaskConical } from "lucide-react"
import type { Chemical } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ChemicalCardProps {
  chemical: Chemical
  onEdit: (chemical: Chemical) => void
  onDelete: (id: string) => void
  onMix?: (chemical: Chemical) => void
}

export function ChemicalCard({ chemical, onEdit, onDelete, onMix }: ChemicalCardProps) {
  const remainingPercentage = ((chemical.capacity - chemical.used) / chemical.capacity) * 100
  const isLow = remainingPercentage < 25
  const isMixed = chemical.state === "mixed"
  const isConcentrate = !chemical.state || chemical.state === "concentrate"

  const now = new Date()
  // For mixed solutions, check working expiry date; for concentrates, check regular expiry date
  const expiryDate = isMixed && chemical.workingExpiryDate
    ? new Date(chemical.workingExpiryDate)
    : chemical.expiryDate
    ? new Date(chemical.expiryDate)
    : null
  const isExpired = expiryDate && expiryDate < now
  const isExpiringSoon = expiryDate && !isExpired && expiryDate < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const typeColors = {
    developer: "bg-chart-1",
    "stop-bath": "bg-chart-2",
    fixer: "bg-chart-3",
    other: "bg-chart-4",
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${typeColors[chemical.type]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-muted">
              <Beaker className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight text-balance">{chemical.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{chemical.brand}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(chemical)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(chemical.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="capitalize">
            {chemical.type.replace("-", " ")}
          </Badge>
          <Badge variant={isMixed ? "default" : "outline"} className="capitalize">
            {chemical.state || "concentrate"}
          </Badge>
          {chemical.dilution && <Badge variant="outline">{chemical.dilution}</Badge>}
          {isLow && <Badge variant="destructive">Low Stock</Badge>}
          {isExpired && <Badge variant="destructive">Expired</Badge>}
          {isExpiringSoon && <Badge variant="destructive">Expiring Soon</Badge>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium">
              {chemical.capacity - chemical.used}ml / {chemical.capacity}ml
            </span>
          </div>
          <Progress value={remainingPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {isMixed && chemical.mixedDate ? (
            <div>
              <p className="text-muted-foreground">Mixed</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(chemical.mixedDate)}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">Purchased</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(chemical.purchaseDate)}
              </p>
            </div>
          )}
          {isMixed && chemical.workingExpiryDate ? (
            <div>
              <p className="text-muted-foreground">Working Expiry</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(chemical.workingExpiryDate)}
              </p>
            </div>
          ) : chemical.expiryDate ? (
            <div>
              <p className="text-muted-foreground">Expires</p>
              <p className="font-medium" suppressHydrationWarning>
                {formatDate(chemical.expiryDate)}
              </p>
            </div>
          ) : null}
        </div>

        {isConcentrate && onMix && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onMix(chemical)}
          >
            <FlaskConical className="h-4 w-4 mr-2" />
            Mix Solution
          </Button>
        )}

        {chemical.notes && <p className="text-sm text-muted-foreground border-t pt-3">{chemical.notes}</p>}
      </CardContent>
    </Card>
  )
}
