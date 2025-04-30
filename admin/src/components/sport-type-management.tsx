"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SportTypeTable } from "@/components/sport-type-table"
import { AddSportTypeForm } from "@/components/add-sport-type-form"
import { EditSportTypeForm } from "@/components/edit-sport-type-form"
import { PlusCircle, Search } from "lucide-react"
import type { SportType } from "@/types/sport-type"

export function SportTypeManagement() {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSportType, setCurrentSportType] = useState<SportType | null>(null)
  const { toast } = useToast()

  const handleAddNew = () => {
    setIsAddingNew(true)
    setIsEditing(false)
  }

  const handleEdit = (sportType: SportType) => {
    setCurrentSportType(sportType)
    setIsEditing(true)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setIsEditing(false)
    setCurrentSportType(null)
  }

  const handleSuccess = (message: string) => {
    toast({
      title: "Thành công",
      description: message,
    })
    setIsAddingNew(false)
    setIsEditing(false)
    setCurrentSportType(null)
  }

  return (
    <div className="space-y-6">
      {!isAddingNew && !isEditing ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm loại thể thao..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNew} className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>
          <SportTypeTable
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onSuccess={(message) => toast({ title: "Thành công", description: message })}
          />
        </>
      ) : isAddingNew ? (
        <AddSportTypeForm onCancel={handleCancel} onSuccess={handleSuccess} />
      ) : (
        <EditSportTypeForm sportType={currentSportType!} onCancel={handleCancel} onSuccess={handleSuccess} />
      )}
    </div>
  )
}
