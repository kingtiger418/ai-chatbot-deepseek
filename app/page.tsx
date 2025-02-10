"use client";

import { Menu, Download } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
      {/* Background Grid */}
      <div className="flex flex-row gap-20 flex-wrap opacity-10 absolute">
        {Array.from({ length: 3000 }).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white rounded-full" />
        ))}
      </div>

      {/* Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[#C1FF00] opacity-[0.1] blur-[130px] animate-glow-1" />
        <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-[0.1] blur-[100px] animate-glow-2" />
        <div className="absolute w-[450px] h-[450px] bg-[#C1FF00] opacity-[0.05] blur-[120px] animate-glow-3" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/OmaxAI.svg"
            alt="OmaxAI"
            width={170}
            height={40}
          />
        </div>

        {/* <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <button className="bg-[#C1FF00] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#d4ff33] transition-colors">
            Login
          </button>
        </div> */}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-40 pb-12">
        <h1 className="text-6xl md:text-7xl font-bold text-center max-w-5xl mx-auto leading-tight mb-16">
          Shaping an intelligent future with innovation.
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Start Now Card */}
          <div
            className="group relative rounded-2xl cursor-pointer"
            onClick={() => router.push("/chat")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#3498db] to-[#FFD700] rounded-2xl animate-gradient opacity-100" />
            <div className="relative bg-[#1A1A1A] m-[1px] p-8 rounded-2xl h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#3498db] to-[#FFD700] opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
              <div className="relative">
                <h2 className="text-[#C1FF00] text-3xl font-bold mb-4">Start now</h2>
                <p className="text-gray-400 mb-2">Free access to OmaxAI-BOM Terminal.</p>
                <p className="text-gray-400">Experience the intelligence in action.</p>
              </div>
            </div>
          </div>

          {/* Download App Card */}
          <div className="group relative rounded-2xl cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3498db] via-[#FFD700] to-[#3498db] rounded-2xl animate-gradient opacity-100" />
            <div className="relative bg-[#1A1A1A] m-[1px] p-8 rounded-2xl h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3498db] via-[#FFD700] to-[#3498db] opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
              <div className="relative">
                <h2 className="text-[#C1FF00] text-3xl font-bold mb-4">Download App</h2>
                <p className="text-gray-400 mb-2">Unlock AI&apos;s potential today.</p>
                <p className="text-gray-400">Embrace smarter solutions instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}