"use client";
import Image from "next/image";
import Link from 'next/link';
export const Navbar = () => {
  return (
    <div>
      {/* Navigation */}
      <nav className="absolute z-10 px-6 py-6 flex justify-between items-center bg-transparent" >
        <Link className="flex items-center gap-2" href="/">
          <Image
            src="/OmaxAI.svg"
            alt="OmaxAI"
            width={170}
            height={40}
          />
        </Link>

        {/* <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <button className="bg-[#C1FF00] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#d4ff33] transition-colors">
            Login
          </button>
        </div> */}
      </nav >
    </div>
  );
};
