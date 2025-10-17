export interface Chemical {
  id: string
  name: string
  type: "developer" | "stop-bath" | "fixer" | "other"
  brand: string
  capacity: number // in ml
  used: number // in ml
  dilution?: string
  notes?: string
  purchaseDate: string
  expiryDate?: string
  cost?: number
  // Chemical state management
  state?: "concentrate" | "mixed" // defaults to "concentrate" if not specified
  parentChemicalId?: string // if mixed, link to the concentrate source
  mixedDate?: string // when the working solution was mixed
  workingExpiryDate?: string // expiry for mixed working solutions
}

export interface Recipe {
  id: string
  name: string
  filmType: string
  developer: string
  dilution: string
  temperature: number
  time: number // in seconds
  agitation: string
  notes?: string
}

export interface FilmRoll {
  id: string
  filmName: string
  filmType: string
  iso: number
  format: "35mm" | "120" | "4x5" | "other"
  frames: number
  shotDate?: string
  developedDate?: string
  recipeId?: string
  chemicalsUsed?: string[]
  notes?: string
  rating?: number
}
