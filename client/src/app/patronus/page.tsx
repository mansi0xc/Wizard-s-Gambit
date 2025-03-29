"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { patronuses } from "@/lib/data"
import { Home, RefreshCw } from "lucide-react"

export default function PatronusPage() {
  const [patronus, setPatronus] = useState(patronuses[0])
  const [isRevealed, setIsRevealed] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)

  useEffect(() => {
    // Randomly select a patronus
    const randomIndex = Math.floor(Math.random() * patronuses.length)
    setPatronus(patronuses[randomIndex])

    // Create magical particles
    const createParticle = () => {
      if (!isRevealed) return

      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-blue-300/40 pointer-events-none"

      // Random position around the patronus
      const angle = Math.random() * Math.PI * 2
      const distance = 50 + Math.random() * 100
      const top = 50 + Math.sin(angle) * distance
      const left = 50 + Math.cos(angle) * distance

      particle.style.top = `${top}%`
      particle.style.left = `${left}%`
      particle.style.filter = "blur(1px)"
      particle.style.opacity = "0"
      particle.style.transform = "scale(0)"
      particle.style.transition = `all ${1 + Math.random() * 2}s ease-out`

      document.getElementById("patronus-container")?.appendChild(particle)

      // Animate towards the patronus
      setTimeout(() => {
        particle.style.opacity = (Math.random() * 0.7 + 0.3).toString()
        particle.style.transform = "scale(1) translate(-50%, -50%)"
        particle.style.top = "50%"
        particle.style.left = "50%"
      }, 10)

      // Remove
      setTimeout(
        () => {
          if (particle.parentNode) {
            particle.style.opacity = "0"
            setTimeout(() => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle)
              }
            }, 500)
          }
        },
        1000 + Math.random() * 1000,
      )
    }

    // Reveal animation timing
    const timer = setTimeout(() => {
      setIsRevealed(true)

      // Play sound effect if not already played
      if (!audioPlayed) {
        const audio = new Audio("/sounds/reveal.mp3")
        audio.volume = 0.4
        audio.play().catch((e) => console.log("Audio play failed:", e))
        setAudioPlayed(true)
      }

      // Start creating particles
      const particleInterval = setInterval(createParticle, 100)
      setTimeout(() => clearInterval(particleInterval), 3000)
    }, 1500)

    return () => clearTimeout(timer)
  }, [audioPlayed, isRevealed])

  const handleTryAgain = () => {
    window.location.href = "/quiz"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-blue-950 to-black p-4 overflow-hidden">
      {/* Magical background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.15),transparent_70%)]"></div>
      <div className="fixed inset-0 bg-[url('/images/patronus-grid.png')] bg-cover opacity-[0.03] mix-blend-screen"></div>

      {/* Floating magical elements */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-pulse-glow"></div>
      <div className="fixed bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-400/5 blur-3xl animate-pulse-slow"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Magical particles container */}
        <div id="patronus-container" className="absolute inset-0 overflow-hidden pointer-events-none z-20"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative backdrop-blur-sm p-8 rounded-lg magical-border"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-blue-950/40 rounded-lg border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] z-0"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 text-blue-100 magical-text text-center">Your Patronus</h1>

            <p className="text-blue-300/80 mb-10 text-center">The magical guardian that resides within your soul</p>

            <div className="relative mb-10">
              {/* Glow effect behind the patronus */}
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl animate-pulse-glow"></div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isRevealed
                    ? {
                        opacity: 1,
                        scale: 1,
                        filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))",
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                className="relative flex justify-center"
              >
                <Image
                  src="/images/wolf-patronus.png"
                  alt={patronus.name}
                  width={220}
                  height={220}
                  className={`${isRevealed ? "patronus-reveal" : "opacity-0"}`}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-blue-100 magical-text text-center">{patronus.name}</h2>

              <p className="text-blue-200/90 mb-6 text-center">{patronus.description}</p>

              <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-500/30 mb-8 magical-border">
                <h3 className="text-sm font-semibold text-blue-300 mb-1 text-center">Special Ability</h3>
                <p className="text-blue-100 text-center">{patronus.ability}</p>
              </div>

              <div className="flex justify-center space-x-6">
                <Link href="/">
                  <button
                    className="flex items-center justify-center gap-2 py-3 px-5 bg-blue-900/50 hover:bg-blue-800/70 
                             text-blue-100 rounded-lg border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] 
                             transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </button>
                </Link>

                <button
                  onClick={handleTryAgain}
                  className="flex items-center justify-center gap-2 py-3 px-5 bg-blue-700/50 hover:bg-blue-600/70 
                           text-blue-100 rounded-lg border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] 
                           transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}