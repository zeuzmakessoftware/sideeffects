"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

export function UserPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<string[]>([])
  const [newDrug, setNewDrug] = useState("")

  // Load prescriptions from localStorage on mount
  useEffect(() => {
    try {
      const storedPrescriptions = localStorage.getItem("prescriptions")
      if (storedPrescriptions) {
        setPrescriptions(JSON.parse(storedPrescriptions))
      }
    } catch (error) {
      console.error("Failed to load prescriptions:", error)
    }
  }, [])

  // Save prescriptions to localStorage whenever they change
  useEffect(() => {
    if (prescriptions.length > 0) {
      localStorage.setItem("prescriptions", JSON.stringify(prescriptions))
    } else {
      localStorage.removeItem("prescriptions") // Cleanup when empty
    }
  }, [prescriptions])

  const addPrescription = () => {
    const trimmedDrug = newDrug.trim()
    if (trimmedDrug !== "" && !prescriptions.includes(trimmedDrug)) {
      setPrescriptions((prev) => [...prev, trimmedDrug])
      setNewDrug("")
    }
  }

  const removePrescription = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter drug name..."
              value={newDrug}
              onChange={(e) => setNewDrug(e.target.value)}
            />
            <Button onClick={addPrescription} disabled={!newDrug.trim()}>Add</Button>
          </div>
          <ul className="space-y-2">
            {prescriptions.map((drug, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                {drug}
                <Button variant="ghost" size="icon" onClick={() => removePrescription(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">Manage your prescribed medications.</p>
      </CardFooter>
    </Card>
  )
}
