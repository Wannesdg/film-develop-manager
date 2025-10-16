"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { ChemicalCard } from "@/components/chemical-card"
import { ChemicalForm } from "@/components/chemical-form"
import { getChemicals, addChemical, updateChemical, deleteChemical } from "@/lib/storage"
import type { Chemical } from "@/lib/types"

export default function ChemicalsPage() {
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingChemical, setEditingChemical] = useState<Chemical | undefined>()

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

    setFilteredChemicals(filtered)
  }, [chemicals, searchQuery, typeFilter])

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
                <ChemicalCard key={chemical.id} chemical={chemical} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ChemicalForm chemical={editingChemical} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
    </div>
  )
}
