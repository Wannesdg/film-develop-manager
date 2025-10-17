"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { DevelopmentRoundCard } from "@/components/development-round-card"
import { DevelopmentRoundForm } from "@/components/development-round-form"
import {
  getDevelopmentRounds,
  addDevelopmentRound,
  updateDevelopmentRound,
  deleteDevelopmentRound,
  getFilmRolls,
  getRecipes,
  getChemicals,
  updateFilmRoll,
  updateChemical,
} from "@/lib/storage"
import type { DevelopmentRound, FilmRoll, Recipe, Chemical } from "@/lib/types"
import { toast } from "sonner"

export default function DevelopmentRoundsPage() {
  const [rounds, setRounds] = useState<DevelopmentRound[]>([])
  const [filmRolls, setFilmRolls] = useState<FilmRoll[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const [filteredRounds, setFilteredRounds] = useState<DevelopmentRound[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRound, setEditingRound] = useState<DevelopmentRound | undefined>()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setRounds(getDevelopmentRounds())
    setFilmRolls(getFilmRolls())
    setRecipes(getRecipes())
    setChemicals(getChemicals())
  }

  useEffect(() => {
    let filtered = rounds

    if (searchQuery) {
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort by date descending (most recent first)
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredRounds(filtered)
  }, [rounds, searchQuery])

  const handleSave = (roundData: Omit<DevelopmentRound, "id"> | DevelopmentRound) => {
    if ("id" in roundData) {
      // Editing existing round
      updateDevelopmentRound(roundData.id, roundData)
      toast.success("Development round updated!")
    } else {
      // Creating new round
      const newRound = addDevelopmentRound(roundData)

      // Mark film rolls as developed
      roundData.filmRollIds.forEach((filmRollId) => {
        updateFilmRoll(filmRollId, {
          developedDate: roundData.date,
          recipeId: roundData.recipeId,
          chemicalsUsed: roundData.chemicalsUsed.map((c) => c.chemicalId),
          developmentRoundId: newRound.id,
        })
      })

      // Update chemical inventory
      roundData.chemicalsUsed.forEach(({ chemicalId, amountUsed }) => {
        const chemical = chemicals.find((c) => c.id === chemicalId)
        if (chemical) {
          updateChemical(chemicalId, {
            used: chemical.used + amountUsed,
          })
        }
      })

      toast.success("Development round created!", {
        description: `${roundData.filmRollIds.length} film roll(s) marked as developed`,
      })
    }

    loadData()
    setEditingRound(undefined)
  }

  const handleEdit = (round: DevelopmentRound) => {
    setEditingRound(round)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this development round? Film rolls will remain marked as developed.")) {
      deleteDevelopmentRound(id)
      loadData()
      toast.success("Development round deleted")
    }
  }

  const handleAddNew = () => {
    setEditingRound(undefined)
    setIsFormOpen(true)
  }

  const getRecipe = (recipeId?: string) => {
    if (!recipeId) return undefined
    return recipes.find((r) => r.id === recipeId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Development Rounds</h1>
              <p className="text-muted-foreground mt-2">Track your development sessions</p>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Round
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search development rounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredRounds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {rounds.length === 0
                  ? "No development rounds yet. Create your first development session to get started!"
                  : "No development rounds match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRounds.map((round) => (
                <DevelopmentRoundCard
                  key={round.id}
                  round={round}
                  filmRolls={filmRolls}
                  recipe={getRecipe(round.recipeId)}
                  chemicals={chemicals}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DevelopmentRoundForm round={editingRound} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
    </div>
  )
}
