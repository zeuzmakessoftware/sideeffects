"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DrugInfoCard } from "@/components/drug-info-card"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/swag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: query }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      let cleanedReport =
        typeof data.report === "string"
          ? data.report.replace(/```json|```/g, "").trim()
          : data.report

      try {
        cleanedReport = JSON.parse(cleanedReport)
      } catch (error) {
        console.warn("Report is not a valid JSON string:", cleanedReport)
      }
      console.log(cleanedReport)

      setResult(cleanedReport)
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
          disabled={isLoading}
        />
        <Button type="submit" className="w-full" disabled={isLoading || !query.trim()}>
          {isLoading ? "Searching..." : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Medical Database
            </>
          )}
        </Button>
      </form>

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="w-48 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {result && <DrugInfoCard data={result} query={query} />}
    </div>
  )
}
