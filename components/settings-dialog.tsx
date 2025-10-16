"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Download, Upload, Trash2 } from "lucide-react"
import { exportAllData, exportChemicals, exportRecipes, exportFilmRolls } from "@/lib/export"
import { importData } from "@/lib/import"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const result = await importData(file)
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })

    if (result.success) {
      window.location.reload()
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone!")) {
      localStorage.clear()
      toast({
        title: "Data Cleared",
        description: "All data has been removed.",
      })
      window.location.reload()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your data and preferences</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportAllData}>
                Export All Data
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportChemicals}>
                Export Chemicals Only
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportRecipes}>
                Export Recipes Only
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportFilmRolls}>
                Export Film Rolls Only
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </h3>
            <div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
              <label htmlFor="import-file">
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <span>Choose File to Import</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Import will merge with existing data. Export first to backup.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t">
            <h3 className="font-medium flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </h3>
            <Button variant="destructive" className="w-full" onClick={handleClearData}>
              Clear All Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
