"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { ChemicalCard } from "@/components/chemical-card"
import { ChemicalForm } from "@/components/chemical-form"
import { MixChemicalDialog } from "@/components/mix-chemical-dialog"
import { getChemicals, addChemical, updateChemical, deleteChemical } from "@/lib/storage"
import type { Chemical } from "@/lib/types"
import { toast } from "sonner"

export default function ChemicalsPage() {
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingChemical, setEditingChemical] = useState<Chemical | undefined>()
  const [isMixDialogOpen, setIsMixDialogOpen] = useState(false)
  const [mixingChemical, setMixingChemical] = useState<Chemical | undefined>()

  useEffect(() => {
    setChemicals(getChemicals())
  }, [])

  useEffect(() => {
    let filtered = chemicals

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((c) => c.type === typeFilter)
    }

    if (stateFilter !== "all") {
      filtered = filtered.filter((c) => (c.state || "concentrate") === stateFilter)
    }

    setFilteredChemicals(filtered)
  }, [chemicals, searchQuery, typeFilter, stateFilter])

  const handleSave = (chemicalData: Omit<Chemical, "id"> | Chemical) => {
    if ("id" in chemicalData) {
      updateChemical(chemicalData.id, chemicalData)
    } else {
      addChemical(chemicalData)
    }
    setChemicals(getChemicals())
    setEditingChemical(undefined)
  }

  const handleEdit = (chemical: Chemical) => {
    setEditingChemical(chemical)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this chemical?")) {
      deleteChemical(id)
      setChemicals(getChemicals())
    }
  }

  const handleAddNew = () => {
    setEditingChemical(undefined)
    setIsFormOpen(true)
  }

  const handleMix = (chemical: Chemical) => {
    setMixingChemical(chemical)
    setIsMixDialogOpen(true)
  }

  const handleMixComplete = (mixedChemical: Omit<Chemical, "id">, concentrateUsed: number) => {
    // Create the new mixed chemical
    addChemical(mixedChemical)

    // Deduct the used amount from the concentrate
    if (mixingChemical) {
      updateChemical(mixingChemical.id, {
        used: mixingChemical.used + concentrateUsed,
      })
    }

    // Refresh the chemicals list
    setChemicals(getChemicals())

    // Show success message
    toast.success("Working solution mixed successfully!", {
      description: `Created ${mixedChemical.capacity}ml of ${mixedChemical.name}`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Chemicals</h1>
              <p className="text-muted-foreground mt-2">Manage your darkroom chemistry inventory</p>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Chemical
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chemicals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="stop-bath">Stop Bath</SelectItem>
                <SelectItem value="fixer">Fixer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="concentrate">Concentrate</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredChemicals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {chemicals.length === 0
                  ? "No chemicals yet. Add your first chemical to get started!"
                  : "No chemicals match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChemicals.map((chemical) => (
                <ChemicalCard
                  key={chemical.id}
                  chemical={chemical}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMix={handleMix}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ChemicalForm chemical={editingChemical} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
      <MixChemicalDialog
        concentrate={mixingChemical}
        open={isMixDialogOpen}
        onOpenChange={setIsMixDialogOpen}
        onMix={handleMixComplete}
      />
    </div>
  )
}
