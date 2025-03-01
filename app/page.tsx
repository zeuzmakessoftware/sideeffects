"use client"

import { Camera, CircleUser, FileVolume, History, Search } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-8xl min-h-screen flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <CircleUser size={40} strokeWidth={1} />
        <h2 className="text-2xl text-center">Your drug information,<br/> your way</h2>
        <History size={40} strokeWidth={1} />
      </div>
      
      <div className="flex flex-col items-center justify-center w-full mx-auto flex-1 mb-8">
        <h2 className="text-2xl text-center mb-4">What drug do you have a question about?</h2>
        <textarea
          className="w-10/12 h-20 border-2 p-4 rounded-[20px] border-blue-950 text-2xl resize-none"
        />
        <div className="flex items-center justify-between mt-4 gap-[3vw]">
        <Camera size={50} strokeWidth={1} />
        <FileVolume size={50} strokeWidth={1} />
        <Search size={50} strokeWidth={1} />
        </div>
      </div>
    </main>
  )
}
