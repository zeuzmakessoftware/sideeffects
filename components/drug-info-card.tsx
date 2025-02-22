"use client"

import { useState } from "react"
import { AlertTriangle, BookmarkPlus, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface DrugInfoCardProps {
  data: {
    drugName: string
    sideEffects: {
      mild: string[]
      moderate: string[]
      severe: string[]
    }
    warnings: string[]
    recommendations: string[]
  }
  query: string
}

export function DrugInfoCard({ data, query }: DrugInfoCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  /* const handleSave = async () => {
    try {
      await saveToHistory({ query, data })
      setIsSaved(true)
    } catch (error) {
      console.error("Error saving to history:", error)
    }
  } */

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.drugName}</CardTitle>
        <CardDescription>FDA-approved medication information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="relevant-context">
            <AccordionTrigger>Relevant Context</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h2>Content</h2>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="side-effects">
            <AccordionTrigger>Side Effects</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Mild</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sideEffects.mild.map((effect) => (
                      <Badge key={effect} variant="secondary">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Moderate</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sideEffects.moderate.map((effect) => (
                      <Badge key={effect} variant="secondary">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Severe
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sideEffects.severe.map((effect) => (
                      <Badge key={effect} variant="destructive">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warnings">
            <AccordionTrigger>Warnings</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {data.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recommendations">
            <AccordionTrigger>Recommendations</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {data.recommendations.map((rec) => (
                  <li key={rec}>{rec}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
        <Button disabled={isSaved}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          {isSaved ? "Saved to History" : "Save to History"}
        </Button>
      </CardFooter>
    </Card>
  )
}

