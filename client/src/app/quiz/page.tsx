"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { questions } from "@/lib/data"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  const handleOptionSelect = (optionId: string) => {
    if (isTransitioning) return

    setIsTransitioning(true)

    // Add current answer
    const newAnswers = [...answers, optionId]
    setAnswers(newAnswers)

    // Create a magical flash effect
    const flash = document.createElement("div")
    flash.className = "fixed inset-0 bg-blue-400/20 z-50 pointer-events-none"
    document.body.appendChild(flash)

    setTimeout(() => {
      document.body.removeChild(flash)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Quiz completed, navigate to result
        router.push("/patronus")
      }

      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 500)
  }

  // Magical floating particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-blue-300/30 pointer-events-none"

      // Random position
      const top = Math.random() * 100
      const left = Math.random() * 100

      particle.style.top = `${top}%`
      particle.style.left = `${left}%`
      particle.style.filter = "blur(1px)"
      particle.style.opacity = "0"
      particle.style.transform = "scale(0)"
      particle.style.transition = `all ${2 + Math.random() * 3}s ease-out`

      document.getElementById("particle-container")?.appendChild(particle)

      // Animate
      setTimeout(() => {
        particle.style.opacity = (Math.random() * 0.5 + 0.2).toString()
        particle.style.transform = `scale(${Math.random() * 2 + 1}) translate(${Math.random() * 50 - 25}px, ${-Math.random() * 100}px)`
      }, 10)

      // Remove
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 5000)
    }

    const interval = setInterval(createParticle, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-blue-950 to-black overflow-hidden p-4">
      {/* Magical background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.15),transparent_70%)]"></div>
      <div className="fixed inset-0 bg-[url('/images/patronus-grid.png')] bg-cover opacity-[0.03] mix-blend-screen"></div>

      {/* Floating particles container */}
      <div id="particle-container" className="fixed inset-0 overflow-hidden pointer-events-none z-10"></div>

      {/* Glowing orb */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow"></div>

      <div className="max-w-md w-full relative z-20">
        {/* Progress indicator */}
        <div className="relative mb-8 flex justify-between">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-full mx-0.5 rounded-full transition-all duration-500 ${
                index < currentQuestion
                  ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                  : index === currentQuestion
                    ? "bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                    : "bg-blue-900/50"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative backdrop-blur-sm rounded-lg"
          >
            {/* Question glow effect */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg blur-xl"></div>

            <div className="relative bg-blue-950/40 p-6 rounded-lg border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
              <h2 className="text-2xl font-bold mb-8 text-blue-100 magical-text text-center">
                {questions[currentQuestion].text}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                      backgroundColor: "rgba(30, 64, 175, 0.5)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="p-5 rounded-lg cursor-pointer transition-all duration-300 border 
                              bg-blue-900/30 border-blue-600/30 hover:border-blue-400/50
                              relative overflow-hidden group"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {/* Magical hover effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-700 
                                  translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"
                    ></div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-100 text-lg">{option.text}</span>
                      <div
                        className="w-5 h-5 rounded-full border-2 border-blue-400/70 flex items-center justify-center
                                    group-hover:border-blue-300 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.7)] transition-all duration-300"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-400/0 group-hover:bg-blue-300 group-hover:shadow-[0_0_5px_rgba(59,130,246,1)] transition-all duration-300"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}