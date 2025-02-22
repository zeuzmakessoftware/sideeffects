"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DrugInfoCard } from "@/components/drug-info-card"
import { searchDrugInfo } from "@/lib/actions"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await searchDrugInfo(query)
      setResult(data)
    } catch (error) {
      console.error("Error fetching drug information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your medication-related question... 
Example: What are the common side effects of Wegovy when taken on an empty stomach?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" className="w-full" disabled={isLoading || !query.trim()}>
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Medical Database
            </>
          )}
        </Button>
      </form>
      {result && <DrugInfoCard data={result} query={query} />}
    </div>
  )
}

