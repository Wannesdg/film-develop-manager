import { saveChemicals, saveRecipes, saveFilmRolls } from "./storage"
import type { Chemical, Recipe, FilmRoll } from "./types"

export async function importData(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    // Validate data structure
    if (!data || typeof data !== "object") {
      return { success: false, message: "Invalid file format" }
    }

    // Import all data if it's a full backup
    if (data.chemicals && Array.isArray(data.chemicals)) {
      saveChemicals(data.chemicals as Chemical[])
    }

    if (data.recipes && Array.isArray(data.recipes)) {
      saveRecipes(data.recipes as Recipe[])
    }

    if (data.filmRolls && Array.isArray(data.filmRolls)) {
      saveFilmRolls(data.filmRolls as FilmRoll[])
    }

    return { success: true, message: "Data imported successfully!" }
  } catch (error) {
    console.error("Import error:", error)
    return { success: false, message: "Failed to import data. Please check the file format." }
  }
}
