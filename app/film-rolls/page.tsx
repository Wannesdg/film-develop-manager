"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { FilmRollCard } from "@/components/film-roll-card"
import { FilmRollForm } from "@/components/film-roll-form"
import { DevelopFilmDialog } from "@/components/develop-film-dialog"
import { getFilmRolls, addFilmRoll, updateFilmRoll, deleteFilmRoll, getRecipes, getCameras } from "@/lib/storage"
import type { FilmRoll, Recipe, Camera } from "@/lib/types"
import { toast } from "sonner"

export default function FilmRollsPage() {
  const [filmRolls, setFilmRolls] = useState<FilmRoll[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [filteredFilmRolls, setFilteredFilmRolls] = useState<FilmRoll[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFilmRoll, setEditingFilmRoll] = useState<FilmRoll | undefined>()
  const [isDevelopDialogOpen, setIsDevelopDialogOpen] = useState(false)
  const [developingFilmRoll, setDevelopingFilmRoll] = useState<FilmRoll | undefined>()

  useEffect(() => {
    setFilmRolls(getFilmRolls())
    setRecipes(getRecipes())
    setCameras(getCameras())
  }, [])

  useEffect(() => {
    let filtered = filmRolls

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.filmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.filmType.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter === "developed") {
      filtered = filtered.filter((f) => f.developedDate)
    } else if (statusFilter === "undeveloped") {
      filtered = filtered.filter((f) => !f.developedDate)
    }

    if (formatFilter !== "all") {
      filtered = filtered.filter((f) => f.format === formatFilter)
    }

    setFilteredFilmRolls(filtered)
  }, [filmRolls, searchQuery, statusFilter, formatFilter])

  const handleSave = (filmRollData: Omit<FilmRoll, "id"> | FilmRoll) => {
    if ("id" in filmRollData) {
      updateFilmRoll(filmRollData.id, filmRollData)
    } else {
      addFilmRoll(filmRollData)
    }
    setFilmRolls(getFilmRolls())
    setEditingFilmRoll(undefined)
  }

  const handleEdit = (filmRoll: FilmRoll) => {
    setEditingFilmRoll(filmRoll)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this film roll?")) {
      deleteFilmRoll(id)
      setFilmRolls(getFilmRolls())
    }
  }

  const handleAddNew = () => {
    setEditingFilmRoll(undefined)
    setIsFormOpen(true)
  }

  const getRecipeName = (recipeId?: string) => {
    if (!recipeId) return undefined
    return recipes.find((r) => r.id === recipeId)?.name
  }

  const getCameraName = (cameraId?: string) => {
    if (!cameraId) return undefined
    return cameras.find((c) => c.id === cameraId)?.name
  }

  const handleDevelop = (filmRoll: FilmRoll) => {
    setDevelopingFilmRoll(filmRoll)
    setIsDevelopDialogOpen(true)
  }

  const handleDevelopComplete = (developmentData: {
    developedDate: string
    recipeId?: string
    chemicalsUsed?: string[]
    rating?: number
    notes?: string
  }) => {
    if (!developingFilmRoll) return

    // Update the film roll with development data
    updateFilmRoll(developingFilmRoll.id, {
      ...developmentData,
      // Append development notes to existing notes if present
      notes: developmentData.notes
        ? developingFilmRoll.notes
          ? `${developingFilmRoll.notes}\n\nDevelopment: ${developmentData.notes}`
          : developmentData.notes
        : developingFilmRoll.notes,
    })

    // Refresh film rolls
    setFilmRolls(getFilmRolls())

    // Show success message
    toast.success("Film roll marked as developed!", {
      description: `${developingFilmRoll.filmName} has been marked as developed`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Film Rolls</h1>
              <p className="text-muted-foreground mt-2">Track your film rolls and development history</p>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Film Roll
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search film rolls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="developed">Developed</SelectItem>
                <SelectItem value="undeveloped">Not Developed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="35mm">35mm</SelectItem>
                <SelectItem value="120">120</SelectItem>
                <SelectItem value="4x5">4x5</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredFilmRolls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {filmRolls.length === 0
                  ? "No film rolls yet. Add your first film roll to get started!"
                  : "No film rolls match your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFilmRolls.map((filmRoll) => (
                <FilmRollCard
                  key={filmRoll.id}
                  filmRoll={filmRoll}
                  recipeName={getRecipeName(filmRoll.recipeId)}
                  cameraName={getCameraName(filmRoll.cameraId)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDevelop={handleDevelop}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilmRollForm filmRoll={editingFilmRoll} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
      <DevelopFilmDialog
        filmRoll={developingFilmRoll}
        open={isDevelopDialogOpen}
        onOpenChange={setIsDevelopDialogOpen}
        onDevelop={handleDevelopComplete}
      />
    </div>
  )
}
