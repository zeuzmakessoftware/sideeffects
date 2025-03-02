"use client"

import { Camera, CircleUser, FileVolume, History, Search, Send } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<string[]>([])
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof query !== "string" || query.trim() === "") {
      setPredictions([]);
      return;
    }    

    const timeoutId = setTimeout(() => {
      fetch("http://127.0.0.1:5001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ drug: query })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok")
          }
          return res.json()
        })
        .then((data) => {
          setPredictions(data || [])
        })
        .catch((error) => {
          console.error("Error fetching predictions:", error)
          setPredictions([])
        })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [query, step])

  const handleSend = async () => {
    setError("")

    if (query.trim() === "") {
      setError("Please enter a query.")
      return
    }

    if (step === 1) {
      try {
        const res = await fetch("http://127.0.0.1:5001/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ drug: query })
        })

        if (!res.ok) {
          throw new Error("Network error")
        }

        const data = await res.json()

        if (!data || data.length === 0) {
          setError("No results found for your search.")
          return
        }

        setSelectedDrug(data[0])
        setStep(2)
        setQuery("")
      } catch (error) {
        console.error("Error in search", error)
        setError("Error fetching results.")
      }
    } else if (step === 2) {
      console.log(`Info query for ${selectedDrug}: ${query}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedDrug(suggestion)
    setStep(2)
    setQuery("")
    setPredictions([])
  }  

  return (
    <main className="container mx-auto p-4 max-w-8xl min-h-screen flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <CircleUser size={40} strokeWidth={1} />
        <h2 className="text-2xl text-center">
          Your drug information,
          <br /> your way
        </h2>
        <History size={40} strokeWidth={1} />
      </div>

      <div className="flex flex-col items-center justify-center w-full mx-auto flex-1 mb-8">
        <h2 className="text-2xl text-center mb-4">
          {step === 1
            ? "What drug do you have a question about?"
            : <>What information do you want to know about <span className="font-bold">{selectedDrug}</span>?</>}
        </h2>
        {/* Integrated input with the send icon as part of the same group */}
        <div className="w-10/12 mt-4">
          <div className="flex items-center border-2 rounded-[20px] border-blue-950 overflow-hidden">
            <textarea
              className="flex-1 h-20 p-4 text-2xl resize-none focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={step === 1 ? "Enter drug name..." : "Enter your question..."}
            />
            <button
              onClick={handleSend}
              className="p-2 h-20 w-16 bg-black hover:bg-neutral-700 flex items-center justify-center"
            >
              <Send size={24} strokeWidth={1} color="white" />
            </button>
          </div>
        </div>
        {error && (
          <div className="w-10/12 mt-2 text-red-500">
            {error}
          </div>
        )}
        {/* Only show predictions in step 1 */}
        {step === 1 && predictions.length > 0 && (
          <div className="w-10/12 mt-4 p-4 border rounded">
            <div className="flex flex-col">
              {predictions.map((prediction, index) => (
                <button
                  key={index}
                  className="px-4 py-4 bg-neutral-100 text-black rounded hover:bg-neutral-200 text-xl"
                  onClick={() => handleSuggestionClick(prediction)}
                >
                  {String(prediction).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-4 gap-[3vw]">
          <Camera size={50} strokeWidth={1} />
          <FileVolume size={50} strokeWidth={1} />
          <Search size={50} strokeWidth={1} />
        </div>
      </div>
    </main>
  )
}
