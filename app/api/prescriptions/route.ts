import { NextResponse } from "next/server"
import { fetchBearerToken } from "./auth"

const API_URL = "https://api.basic.tech/account/dd6a46ba-4d1e-415a-8c5a-f3f3930d4567/db/drugs"

// GET request to fetch prescriptions
export async function GET() {
  try {
    const token = await fetchBearerToken()

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching prescriptions: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST request to add a new prescription
export async function POST(req: Request) {
  try {
    const token = await fetchBearerToken()
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: { name } }),
    })

    if (!response.ok) {
      throw new Error(`Error adding prescription: ${response.statusText}`)
    }

    const addedDrug = await response.json()
    return NextResponse.json(addedDrug)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// DELETE request to remove a prescription
export async function DELETE(req: Request) {
  try {
    const token = await fetchBearerToken()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error deleting prescription: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
