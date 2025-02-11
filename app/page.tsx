"use client";

import { Menu, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-40 pb-12">
        <h1 className="text-6xl md:text-7xl font-bold text-center max-w-5xl mx-auto leading-tight mb-16 mt-20">
          Shaping an intelligent future with innovation.
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Start Now Card */}
          <div
            className="group relative rounded-2xl cursor-pointer absolute inset-0 p-8 box-animated-border bg-[#1A1A1A]"
            onClick={() => router.push("/chat")}
          >
            <div className="relative">
              <h2 className="text-[#C1FF00] text-3xl font-bold mb-4">Start now</h2>
              <p className="text-gray-400 mb-2">Free access to OmaxAI-BOM Terminal.</p>
              <p className="text-gray-400">Experience the intelligence in action.</p>
            </div>
          </div>

          {/* Download App Card */}
          <div
            className="group relative rounded-2xl cursor-pointer absolute inset-0 p-8 box-animated-border bg-[#1A1A1A]"
            onClick={() => router.push("/chat")}
          >
            <div className="relative">
              <h2 className="text-[#C1FF00] text-3xl font-bold mb-4">Download App</h2>
              <p className="text-gray-400 mb-2">Unlock AI&apos;s potential today.</p>
              <p className="text-gray-400">Embrace smarter solutions instantly.</p>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}