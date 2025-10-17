import type { Chemical, Recipe, FilmRoll, DevelopmentRound } from "./types"

const STORAGE_KEYS = {
  CHEMICALS: "film-tracker-chemicals",
  RECIPES: "film-tracker-recipes",
  FILM_ROLLS: "film-tracker-film-rolls",
  DEVELOPMENT_ROUNDS: "film-tracker-development-rounds",
}

// Chemicals
export function getChemicals(): Chemical[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CHEMICALS)
  return data ? JSON.parse(data) : []
}

export function saveChemicals(chemicals: Chemical[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CHEMICALS, JSON.stringify(chemicals))
}

export function addChemical(chemical: Omit<Chemical, "id">): Chemical {
  const chemicals = getChemicals()
  const newChemical = { ...chemical, id: crypto.randomUUID() }
  chemicals.push(newChemical)
  saveChemicals(chemicals)
  return newChemical
}

export function updateChemical(id: string, updates: Partial<Chemical>): void {
  const chemicals = getChemicals()
  const index = chemicals.findIndex((c) => c.id === id)
  if (index !== -1) {
    chemicals[index] = { ...chemicals[index], ...updates }
    saveChemicals(chemicals)
  }
}

export function deleteChemical(id: string): void {
  const chemicals = getChemicals().filter((c) => c.id !== id)
  saveChemicals(chemicals)
}

// Recipes
export function getRecipes(): Recipe[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.RECIPES)
  return data ? JSON.parse(data) : []
}

export function saveRecipes(recipes: Recipe[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes))
}

export function addRecipe(recipe: Omit<Recipe, "id">): Recipe {
  const recipes = getRecipes()
  const newRecipe = { ...recipe, id: crypto.randomUUID() }
  recipes.push(newRecipe)
  saveRecipes(recipes)
  return newRecipe
}

export function updateRecipe(id: string, updates: Partial<Recipe>): void {
  const recipes = getRecipes()
  const index = recipes.findIndex((r) => r.id === id)
  if (index !== -1) {
    recipes[index] = { ...recipes[index], ...updates }
    saveRecipes(recipes)
  }
}

export function deleteRecipe(id: string): void {
  const recipes = getRecipes().filter((r) => r.id !== id)
  saveRecipes(recipes)
}

// Film Rolls
export function getFilmRolls(): FilmRoll[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.FILM_ROLLS)
  return data ? JSON.parse(data) : []
}

export function saveFilmRolls(filmRolls: FilmRoll[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.FILM_ROLLS, JSON.stringify(filmRolls))
}

export function addFilmRoll(filmRoll: Omit<FilmRoll, "id">): FilmRoll {
  const filmRolls = getFilmRolls()
  const newFilmRoll = { ...filmRoll, id: crypto.randomUUID() }
  filmRolls.push(newFilmRoll)
  saveFilmRolls(filmRolls)
  return newFilmRoll
}

export function updateFilmRoll(id: string, updates: Partial<FilmRoll>): void {
  const filmRolls = getFilmRolls()
  const index = filmRolls.findIndex((f) => f.id === id)
  if (index !== -1) {
    filmRolls[index] = { ...filmRolls[index], ...updates }
    saveFilmRolls(filmRolls)
  }
}

export function deleteFilmRoll(id: string): void {
  const filmRolls = getFilmRolls().filter((f) => f.id !== id)
  saveFilmRolls(filmRolls)
}

// Development Rounds
export function getDevelopmentRounds(): DevelopmentRound[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.DEVELOPMENT_ROUNDS)
  return data ? JSON.parse(data) : []
}

export function saveDevelopmentRounds(rounds: DevelopmentRound[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.DEVELOPMENT_ROUNDS, JSON.stringify(rounds))
}

export function addDevelopmentRound(round: Omit<DevelopmentRound, "id">): DevelopmentRound {
  const rounds = getDevelopmentRounds()
  const newRound = { ...round, id: crypto.randomUUID() }
  rounds.push(newRound)
  saveDevelopmentRounds(rounds)
  return newRound
}

export function updateDevelopmentRound(id: string, updates: Partial<DevelopmentRound>): void {
  const rounds = getDevelopmentRounds()
  const index = rounds.findIndex((r) => r.id === id)
  if (index !== -1) {
    rounds[index] = { ...rounds[index], ...updates }
    saveDevelopmentRounds(rounds)
  }
}

export function deleteDevelopmentRound(id: string): void {
  const rounds = getDevelopmentRounds().filter((r) => r.id !== id)
  saveDevelopmentRounds(rounds)
}
