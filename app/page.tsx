"use client"

import { SearchForm } from "@/components/search-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavedQueries } from "@/components/saved-queries"
import { UserPrescriptions } from "@/components/UserPrescriptions"
import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
      window.location.href = "https://api.basic.tech/auth/authorize?response_type=code&client_id=dd6a46ba-4d1e-415a-8c5a-f3f3930d4567&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F"
    }
    else {
      window.localStorage.setItem("token", code)
    }
  }, [])

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-6">
        <div className="px-6 space-y-2">
          <h1 className="text-3xl font-bold">SideEffect.MED</h1>
        </div>
        <Tabs defaultValue="search" className="space-y-4">
          <TabsList className="flex w-full items-center justify-center">
            <TabsTrigger value="search" className="w-full">Search</TabsTrigger>
            <TabsTrigger value="history" className="w-full">History</TabsTrigger>
            <TabsTrigger value="prescriptions" className="w-full">Prescriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="space-y-4">
            <SearchForm />
          </TabsContent>
          <TabsContent value="history">
            <SavedQueries />
          </TabsContent>
          <TabsContent value="prescriptions">
            <UserPrescriptions />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

