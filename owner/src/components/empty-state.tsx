import { Building2 } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Building2 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold">No Venue Selected</h2>
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        Select a venue from the sidebar to view its details, or add a new venue to get started.
      </p>
    </div>
  )
}
