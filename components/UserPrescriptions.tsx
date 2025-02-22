"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

export function UserPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<{ id: string, name: string }[]>([])
  const [newDrug, setNewDrug] = useState("")

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("/api/prescriptions", { 
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`}
         })
        if (!response.ok) throw new Error("Error fetching prescriptions")
        const data = await response.json()
        setPrescriptions(data || [])
      } catch (error) {
        console.error(error)
      }
    }

    fetchPrescriptions()
  }, [])

  const addPrescription = async () => {
    if (newDrug.trim() === "") return

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDrug.trim() }),
      })

      if (!response.ok) throw new Error("Error adding prescription")

      const addedDrug = await response.json()
      setPrescriptions([...prescriptions, { id: addedDrug.id, name: newDrug.trim() }])
      setNewDrug("")
    } catch (error) {
      console.error(error)
    }
  }

  const removePrescription = async (id: string) => {
    try {
      const response = await fetch("/api/prescriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Error deleting prescription")

      setPrescriptions(prescriptions.filter((drug) => drug.id !== id))
    } catch (error) {
      console.error(error)
    }
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
            {prescriptions.map((drug) => (
              <li key={drug.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                {drug.name}
                <Button variant="ghost" size="icon" onClick={() => removePrescription(drug.id)}>
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
