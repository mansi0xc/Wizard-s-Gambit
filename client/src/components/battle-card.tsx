"use client"

import type React from "react"

import { useState } from "react"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type SpellLevel = 1 | 2 | 3
type Element = "inferno" | "glacius" | "ventus"

interface BattleCardProps {
  element: Element
  name: string
  description: string
  icon: React.ReactNode
  color: string
  onCast: (level: SpellLevel, useDefense: boolean) => void
  canUseDefense: boolean
}

export function BattleCard({ element, name, description, icon, color, onCast, canUseDefense }: BattleCardProps) {
  const [selectedLevel, setSelectedLevel] = useState<SpellLevel>(1)
  const [useDefense, setUseDefense] = useState(false)

  const getColorClasses = (color: string, element: "bg" | "border" | "text" | "hover") => {
    const colorMap: Record<string, Record<string, string>> = {
      red: {
        bg: "bg-red-900/30",
        border: "border-red-500/30",
        text: "text-red-400",
        hover: "hover:bg-red-900/50 hover:border-red-500/50",
      },
      blue: {
        bg: "bg-blue-900/30",
        border: "border-blue-500/30",
        text: "text-blue-400",
        hover: "hover:bg-blue-900/50 hover:border-blue-500/50",
      },
      green: {
        bg: "bg-green-900/30",
        border: "border-green-500/30",
        text: "text-green-400",
        hover: "hover:bg-green-900/50 hover:border-green-500/50",
      },
      purple: {
        bg: "bg-purple-900/30",
        border: "border-purple-500/30",
        text: "text-purple-400",
        hover: "hover:bg-purple-900/50 hover:border-purple-500/50",
      },
    }

    return colorMap[color]?.[element] || colorMap.purple[element]
  }

  const handleCast = () => {
    onCast(selectedLevel, useDefense)
    setSelectedLevel(1)
    setUseDefense(false)
  }

  const getLevelDamage = (level: SpellLevel): number => {
    return level === 1 ? 20 : level === 2 ? 25 : 30
  }

  return (
    <div
      className={`${getColorClasses(color, "bg")} border ${getColorClasses(color, "border")} rounded-lg p-3 ${getColorClasses(color, "hover")} transition-all duration-300`}
    >
      <div className="flex items-center mb-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(color, "bg")} border ${getColorClasses(color, "border")} mr-2`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-sm">{name}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              size="sm"
              variant="outline"
              className={`w-7 h-7 p-0 ${selectedLevel === level ? `${getColorClasses(color, "bg")} ${getColorClasses(color, "border")}` : "bg-gray-900/50 border-gray-700"}`}
              onClick={() => setSelectedLevel(level as SpellLevel)}
            >
              {level}
            </Button>
          ))}
        </div>
        <Badge className="bg-gray-800 border-0">{getLevelDamage(selectedLevel)} DMG</Badge>
      </div>

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="outline"
          className={`${useDefense ? "bg-blue-900/30 border-blue-500/30" : "bg-gray-900/50 border-gray-700"} flex items-center gap-1`}
          onClick={() => setUseDefense(!useDefense)}
          disabled={!canUseDefense}
        >
          <Shield className="h-3 w-3" />
          <span className="text-xs">Defense</span>
        </Button>

        <Button size="sm" className={`bg-${color}-600 hover:bg-${color}-700`} onClick={handleCast}>
          Cast
        </Button>
      </div>
    </div>
  )
}

