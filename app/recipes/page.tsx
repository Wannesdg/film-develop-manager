"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeForm } from "@/components/recipe-form"
import { getRecipes, addRecipe, updateRecipe, deleteRecipe } from "@/lib/storage"
import type { Recipe } from "@/lib/types"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>()

  useEffect(() => {
    setRecipes(getRecipes())
  }, [])

  useEffect(() => {
    let filtered = recipes

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.filmType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.developer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredRecipes(filtered)
  }, [recipes, searchQuery])

  const handleSave = (recipeData: Omit<Recipe, "id"> | Recipe) => {
    if ("id" in recipeData) {
      updateRecipe(recipeData.id, recipeData)
    } else {
      addRecipe(recipeData)
    }
    setRecipes(getRecipes())
    setEditingRecipe(undefined)
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(id)
      setRecipes(getRecipes())
    }
  }

  const handleAddNew = () => {
    setEditingRecipe(undefined)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Recipes</h1>
              <p className="text-muted-foreground mt-2">Your collection of development recipes</p>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Recipe
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes by name, film type, or developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {recipes.length === 0
                  ? "No recipes yet. Add your first recipe to get started!"
                  : "No recipes match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      <RecipeForm recipe={editingRecipe} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
    </div>
  )
}
