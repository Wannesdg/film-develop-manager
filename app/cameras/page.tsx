"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { CameraCard } from "@/components/camera-card"
import { CameraForm } from "@/components/camera-form"
import { getCameras, addCamera, updateCamera, deleteCamera, getFilmRolls } from "@/lib/storage"
import type { Camera } from "@/lib/types"
import { toast } from "sonner"

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCamera, setEditingCamera] = useState<Camera | undefined>()

  useEffect(() => {
    setCameras(getCameras())
  }, [])

  useEffect(() => {
    let filtered = cameras

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.model.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (formatFilter !== "all") {
      filtered = filtered.filter((c) => c.format === formatFilter)
    }

    setFilteredCameras(filtered)
  }, [cameras, searchQuery, formatFilter])

  // Get roll counts per camera
  const getRollCount = (cameraId: string) => {
    const filmRolls = getFilmRolls()
    return filmRolls.filter((roll) => roll.cameraId === cameraId).length
  }

  const handleSave = (cameraData: Omit<Camera, "id"> | Camera) => {
    if ("id" in cameraData) {
      updateCamera(cameraData.id, cameraData)
      toast.success("Camera updated!")
    } else {
      addCamera(cameraData)
      toast.success("Camera added!")
    }
    setCameras(getCameras())
    setEditingCamera(undefined)
  }

  const handleEdit = (camera: Camera) => {
    setEditingCamera(camera)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this camera? Film rolls using this camera will not be deleted.")) {
      deleteCamera(id)
      setCameras(getCameras())
      toast.success("Camera deleted")
    }
  }

  const handleAddNew = () => {
    setEditingCamera(undefined)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Cameras</h1>
              <p className="text-muted-foreground mt-2">Manage your camera collection</p>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Camera
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="35mm">35mm</SelectItem>
                <SelectItem value="120">120 (Medium Format)</SelectItem>
                <SelectItem value="4x5">4x5 (Large Format)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredCameras.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {cameras.length === 0
                  ? "No cameras yet. Add your first camera to get started!"
                  : "No cameras match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCameras.map((camera) => (
                <CameraCard
                  key={camera.id}
                  camera={camera}
                  rollCount={getRollCount(camera.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CameraForm camera={editingCamera} open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSave} />
    </div>
  )
}
