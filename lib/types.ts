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
