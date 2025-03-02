"use client"

import { Camera, CircleUser, FileVolume, History, Search, Send, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" // adjust the import path as necessary

interface BulletPoint {
  key_takeaway: string;
  details: string[];
}

export default function Home() {
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<string[]>([])
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [results, setResults] = useState<any[]>([])  // FDA data results
  const [llmResponse, setLLMResponse] = useState<{
    bullet_points: BulletPoint[];
  } | null>(null)  // LLM API route’s response (JSON format)
  const [isLoading, setIsLoading] = useState(false)    // Loading state
  // activeSection: "llm" or "fda" or null; only one of these sections can be open at a time
  const [activeSection, setActiveSection] = useState<"llm" | "fda" | null>(null)

  useEffect(() => {
    if (typeof query !== "string" || query.trim() === "") {
      setPredictions([])
      return
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
          if (!res.ok) throw new Error("Network response was not ok")
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
      setIsLoading(true)
      try {
        // Fetch the FDA embedding data
        const res = await fetch("http://127.0.0.1:5001/search_embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: query, drugname: selectedDrug, k: 7 })
        })
        if (!res.ok) {
          throw new Error("Network error")
        }
        const data = await res.json()
        setResults(data.results ? data.results : data)

        let cleanedReport = ""
        for (const result of data.results ? data.results : data) {
          cleanedReport += result.label
        }

        const llmRes = await fetch("/api/llm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: query, fda_data: cleanedReport })
        })
        if (!llmRes.ok) {
          throw new Error("LLM API error")
        }
        const llmData = await llmRes.json()
        const parsedLLM = JSON.parse(llmData.report.slice(7, -3))
        console.log(parsedLLM)
        setLLMResponse(parsedLLM)
        // Open LLM response by default when available
        setActiveSection("llm")
      } catch (error) {
        console.error("Error fetching embeddings or LLM response", error)
        setError("Error fetching results from API.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedDrug(suggestion)
    setError("")
    setStep(2)
    setQuery("")
    setPredictions([])
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-8xl h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <CircleUser size={40} strokeWidth={1} />
        <h2 className="text-2xl text-center">
          Your drug information,
          <br /> your way
        </h2>
        <History size={40} strokeWidth={1} />
      </div>

      {/* Central Content */}
      <div className="flex flex-col flex-1 overflow-hidden items-center justify-center">
        <h2 className="text-2xl text-center mb-4">
          {step === 1
            ? "What drug do you have a question about?"
            : <>What information do you want to know about <span className="font-bold">{selectedDrug}</span>?</>}
        </h2>

        <div className="w-10/12">
          <div className="flex items-center border-2 rounded-[20px] border-blue-950 overflow-hidden">
            <textarea
              className="flex-1 h-20 px-3 py-2 text-2xl resize-none focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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

        <div className="flex items-center justify-between mt-4 gap-[3vw]">
          <Camera size={40} strokeWidth={1} />
          <FileVolume size={40} strokeWidth={1} />
          <Search size={40} strokeWidth={1} />
        </div>

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

        {/* Display spinner or results in step 2 */}
        {step === 2 && (
          isLoading ? (
            <div className="w-10/12 mt-4 p-4 border rounded flex justify-center items-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <>
              {llmResponse?.bullet_points && (
                <div className="w-10/12 mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Summary</CardTitle>
                        <button 
                          onClick={() => setActiveSection(activeSection === "llm" ? null : "llm")}
                          className="p-2"
                        >
                          {activeSection === "llm" ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                        </button>
                      </div>
                    </CardHeader>
                    {activeSection === "llm" && (
                      <CardContent className="max-h-[40vh] overflow-y-auto">
                        {llmResponse.bullet_points.map((bullet: BulletPoint, index: number) => (
                          <div key={index} className="mb-4 ml-4">
                            <ul className="list-disc pl-5">
                              <li className="text-2xl font-bold">{bullet.key_takeaway}</li>
                              {bullet.details.map((detail, idx: number) => (
                                <li key={idx} className="text-xl listitem">{detail}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}

              {results.length > 0 && (
                <div className="w-10/12 mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Official FDA Data About {selectedDrug}</CardTitle>
                        <button 
                          onClick={() => setActiveSection(activeSection === "fda" ? null : "fda")}
                          className="p-2"
                        >
                          {activeSection === "fda" ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                        </button>
                      </div>
                    </CardHeader>
                    {activeSection === "fda" && (
                      <CardContent className="max-h-[40vh] overflow-y-auto">
                        <ul>
                          {results.map((result, index) => (
                            <li key={index} className="mb-4 text-xl">
                              {result.label.slice(27, result.label.length - 1)}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}
            </>
          )
        )}    
      </div>
    </main>
  )
}
