"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { DrugInfoCard } from "@/components/drug-info-card"
import { getHistory } from "@/lib/actions"

export function SavedQueries() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory()
        setHistory(data)
      } catch (error) {
        console.error("Error loading history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No saved queries yet. Search for medications to save them here.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <DrugInfoCard key={index} data={item.data} query={item.query} />
      ))}
    </div>
  )
}

