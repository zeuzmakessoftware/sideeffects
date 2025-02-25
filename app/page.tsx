"use client"

import { SearchForm } from "@/components/search-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavedQueries } from "@/components/saved-queries"
import { UserPrescriptions } from "@/components/UserPrescriptions"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="w-64 h-64 bg-purple-500 rounded-full absolute top-10 left-10 z-[-10] blur-[18em] opacity-50"></div>
      <div className="w-72 h-72 bg-blue-500 rounded-full absolute top-1/2 left-1/3 z-[-10] blur-[8em] opacity-50"></div>
      <div className="w-56 h-56 bg-pink-500 rounded-full absolute bottom-10 right-10 z-[-10] blur-[15em] opacity-50"></div>
      <div className="w-64 h-64 bg-pink-500 rounded-full absolute top-1/3 right-1/4 z-[-10] blur-[14em] opacity-50"></div>
      <div className="space-y-6">
        <div className="px-6 space-y-2">
          <h1 className="text-5xl font-bold mt-8 font-light">SideEffect.MED</h1>
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

