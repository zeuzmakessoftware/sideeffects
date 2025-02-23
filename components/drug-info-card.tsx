"use client"

import { useState } from "react"
import { AlertTriangle, BookmarkPlus, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DrugInfoCardProps {
  data: any
  query: string
}

export function DrugInfoCard({ data }: DrugInfoCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
              <p className="text-sm text-gray-500">{data.relevantContext || "No relevant context available."}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="side-effects">
            <AccordionTrigger>Side Effects</AccordionTrigger>
            <AccordionContent>
              {["mild", "moderate", "severe"].map((severity) => (
                <div key={severity}>
                  <h4 className="font-medium mb-2 capitalize">{severity}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sideEffects && data.sideEffects[severity] && data.sideEffects[severity].length > 0 ? (
                      data.sideEffects[severity].map((effect: string) => (
                        <Badge key={effect} variant={severity === "severe" ? "destructive" : "secondary"}>
                          {effect}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No {severity} side effects listed.</p>
                    )}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warnings">
            <AccordionTrigger>Warnings</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {data.warnings?.length > 0 ? (
                  data.warnings?.map((warning: string) => <li key={warning}>{warning}</li>)
                ) : (
                  <p className="text-sm text-gray-500">No warnings available.</p>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recommendations">
            <AccordionTrigger>Recommendations</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {data.recommendations?.length > 0 ? (
                  data.recommendations?.map((rec: string) => <li key={rec}>{rec}</li>)
                ) : (
                  <p className="text-sm text-gray-500">No recommendations available.</p>
                )}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>Show Full FDA Embedding</Button>
          </DialogTrigger>
          {isModalOpen && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Embedding Info</DialogTitle>
                <DialogDescription>
                  {data.relevantContext}:
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[500px] overflow-y-auto p-4 text-sm text-gray-800 bg-gray-100 rounded-md">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify([0.3215742,0.46213126,0.8566538,0.76015013,0.58484143,0.5002575,0.54250705,0.037805833,0.70843834,0.92729366,0.8302038,0.7470854,0.54759955,0.61132544,0.81248677,0.27971944,0.066173546,0.40325648,0.18484613,0.081582196,0.46041486,0.6504928,0.61066604,0.45312238,0.7663389,0.30464363,0.3242183,0.6140146,0.73314345,0.72078377,0.22338204,0.3331178,0.707221,0.31769583,0.00027288278,0.46154442,0.57286537,0.5249266,0.5409961,0.44751507,0.92617035,0.62657714,0.6198009,0.8991155,0.55452543,0.502541,0.88107985,0.5913031,0.9928742,0.19231176,0.074395634,0.22652584,0.19612761,0.3923097,0.38658985,0.33111113,0.24721804,0.9318544,0.8467364,0.43404987,0.68472767,0.43411162,0.8454271,0.5983538,0.26305732,0.14947812,0.5363943,0.28126028,0.6546419,0.93527573,0.5678238,0.101555474,0.8406479,0.9792921,0.5774372,0.74997526,0.4870752,0.014098012,0.527263,0.23772216,0.0066660917,0.07789613,0.21803024,0.5926498,0.08724896,0.8576212,0.6591526,0.29565647,0.30975658,0.69563395,0.16043307,0.6572699,0.9311836,0.97649753,0.64451385,0.55339956,0.5598607,0.09649968,0.15118136,0.7809778,0.43857488,0.8969898,0.3355309,0.93100375,0.029789854,0.10066816,0.33095992,0.7344015,0.3397276,0.18209735,0.9181335,0.20143378,0.19433205,0.5219022,0.37170103,0.22095275,0.8824244,0.26321164,0.91077286,0.9146634,0.14642969,0.7219616,0.307292,0.38661343,0.68381596,0.14297856,0.38269776,0.045309026,0.23634386,0.43557885,0.8746635,0.10132426,0.6462514,0.69273955,0.8670575,0.47915283,0.12831004,0.35903,0.29378018,0.95558065,0.8583972,0.09426105,0.8840606,0.6066795,0.7569969,0.38678023,0.41203207,0.7264376,0.27254868,0.13504417,0.14933324,0.8086742,0.06573946,0.5650546,0.84823143,0.9510433,0.69340384,0.16969877,0.6469075,0.7191304,0.70022994,0.24767585,0.06834973,0.39242652,0.9411323,0.9099494,0.11640913,0.030495357,0.10407525,0.85833323,0.7523322,0.83888257,0.9851902,0.101217985,0.2977649,0.26976848,0.3679908,0.6621709,0.2635519,0.5387624,0.71924615,0.23353797,0.8803553,0.30867937,0.1671498,0.69811124,0.3327676,0.8142486,0.69973826,0.5226677,0.02797787,0.4277237,0.8268698,0.41410813,0.26760802,0.82207185,0.41535956,0.97213554,0.48196197,0.8121125,0.38063717,0.25958624,0.73867077,0.45451984,0.98900485,0.29438075,0.920855,0.26041976,0.34812912,0.3255718,0.17992122,0.56421834,0.6143294,0.7317673,0.0063647986,0.6568161,0.028116228,0.074470274,0.84130585,0.7903427,0.27473316,0.27334931,0.28441235,0.41412413,0.13710825,0.19484794,0.46088842,0.4422404,0.90912926,0.34144542,0.53539616,0.7777485,0.9079909,0.91498995,0.40865198,0.06562986,0.5380919,0.33988476,0.3123031,0.7043662,0.31781277,0.8735392,0.49344364,0.3488121,0.26625803,0.5000218,0.23650795,0.90219575,0.8186379,0.13054906,0.825204,0.78716606,0.55983776,0.762285,0.61687154,0.87198496,0.4417671,0.4001185,0.25944746,0.7193088,0.50995076,0.57679427,0.41628104,0.8446436,0.21016066,0.9849422,0.4440042,0.6085635,0.5062491,0.69351083,0.529654,0.30606353,0.20027758,0.90907264,0.7500084,0.60435605,0.945535,0.54544675,0.05831016,0.116463535,0.6421267,0.7439919,0.3108016,0.12403601,0.07313211,0.34837306,0.024029871,0.71707475,0.70311004,0.05789713,0.19981013,0.40256774,0.5868199,0.5470398,0.09300185,0.83736354,0.27848387,0.80646265,0.08853504,0.71387535,0.9627187,0.97055733,0.17469436,0.94543856,0.7502809,0.57490736,0.6653266,0.79193103,0.5174932,0.1948535,0.8691777,0.73017424,0.7742508,0.48224768,0.8602378,0.80819064,0.8104959,0.42363605,0.36076355,0.17842154,0.6192419,0.24526316,0.7567546,0.023135047,0.1690563,0.96419823,0.7660194,0.97685903,0.1920814,0.5666681,0.07534555,0.66334003,0.1612932,0.5521892,0.9387047,0.89108485,0.37645262,0.09805569,0.26559344,0.19430995,0.50503445,0.61467457,0.21398391,0.17544559,0.12388875,0.045692082,0.5045647,0.06043311,0.5239037,0.93650275,0.9823761,0.89978296,0.8757083,0.19823825,0.6665784,0.64586216,0.651596,0.13417308,0.8211264,0.12198219,0.8526397,0.29008362,0.7481672,0.92001224,0.84825724,0.3401573,0.9230484,0.88148755,0.213722,0.29489562,0.9219409,0.80958366,0.75446016,0.34562665,0.9356552,0.40253744,0.36083794,0.2776176,0.6517963,0.4174528,0.3244725,0.18563297,0.22845261,0.48785576], null, 2)}
                </pre>
              </div>
            </DialogContent>
          )}

        </Dialog>
        <Button disabled={isSaved} onClick={() => setIsSaved(true)}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          {isSaved ? "Saved to History" : "Save to History"}
        </Button>
      </CardFooter>
    </Card>
  )
}
