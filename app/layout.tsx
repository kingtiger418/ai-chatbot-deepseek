import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.className, "antialiased dark")}>
        <div className="bg-[#0D0D0D] min-h-screen text-white relative min-w-0 overflow-hidden">
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

          <Toaster position="top-center" richColors />
          <Navbar />
          {children}
        </div>
      </body>
    </html >
  );
}
