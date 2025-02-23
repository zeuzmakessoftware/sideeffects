"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { DrugInfoCard } from "@/components/drug-info-card"

// Mock history data (Replace this with actual data)
const mockHistory = [
  {
    query: "Aspirin",
    data: {
      drugName: "Aspirin",
      relevantContext: "Aspirin is used to reduce pain, fever, or inflammation.",
      sideEffects: {
        mild: ["Nausea", "Dizziness"],
        moderate: ["Stomach pain", "Ringing in ears"],
        severe: ["Severe allergic reactions", "Internal bleeding"],
      },
      warnings: [
        "Do not use if allergic to NSAIDs.",
        "Consult a doctor before use if you have a bleeding disorder."
      ],
      recommendations: [
        "Take with food to reduce stomach upset.",
        "Do not exceed the recommended dose."
      ]
    }
  },
  {
    query: "Ibuprofen",
    data: {
      drugName: "Ibuprofen",
      relevantContext: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain and inflammation.",
      sideEffects: {
        mild: ["Headache", "Drowsiness"],
        moderate: ["Heartburn", "High blood pressure"],
        severe: ["Kidney failure", "Severe stomach bleeding"],
      },
      warnings: [
        "Avoid alcohol while taking this medication.",
        "Not recommended for people with heart disease."
      ],
      recommendations: [
        "Take with water and food.",
        "Avoid prolonged use without medical supervision."
      ]
    }
  }
];

export function SavedQueries() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating data loading delay
    setTimeout(() => {
      setHistory(mockHistory) // Set the mock data
      setIsLoading(false)
    }, 500) // Simulate loading delay
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
