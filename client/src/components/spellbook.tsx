"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Snowflake, Wind, Zap, Shield } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function Spellbook() {
  const [selectedSpell, setSelectedSpell] = useState("incendio")

  // Spell data
  const spells = {
    incendio: {
      name: "Incendio",
      description: "A fire-making spell that conjures flames from the tip of your wand.",
      icon: Flame,
      color: "red",
      manaCost: 15,
      cooldown: 1,
      damage: 15,
      effects: ["Deals fire damage", "Has a 10% chance to apply a burn effect"],
      counters: ["Glacius (weak)", "Aguamenti (strong)"],
      history:
        "First documented in the 15th century, Incendio was originally used by wizards to light hearths during harsh winters.",
      stats: {
        power: 80,
        accuracy: 90,
        speed: 70,
      },
    },
    glacius: {
      name: "Glacius",
      description: "A freezing charm that creates ice and lowers the temperature of the target.",
      icon: Snowflake,
      color: "blue",
      manaCost: 15,
      cooldown: 1,
      damage: 12,
      effects: ["Deals ice damage", "Has a 15% chance to slow opponent's next spell"],
      counters: ["Incendio (weak)", "Ventus (strong)"],
      history:
        "Developed in Nordic magical communities, Glacius was essential for preserving food before modern magical preservation methods.",
      stats: {
        power: 70,
        accuracy: 95,
        speed: 75,
      },
    },
    ventus: {
      name: "Ventus",
      description: "A spell that creates a strong gust of wind from the tip of your wand.",
      icon: Wind,
      color: "emerald",
      manaCost: 15,
      cooldown: 1,
      damage: 10,
      effects: ["Deals wind damage", "Has a 20% chance to push back opponent, delaying their next attack"],
      counters: ["Protego (weak)", "Incendio (strong)"],
      history:
        "Ventus was popularized by seafaring wizards who used it to propel their ships when natural winds were unfavorable.",
      stats: {
        power: 65,
        accuracy: 85,
        speed: 90,
      },
    },
    stupefy: {
      name: "Stupefy",
      description: "A stunning spell that renders the target unconscious or immobile.",
      icon: Zap,
      color: "yellow",
      manaCost: 15,
      cooldown: 2,
      damage: 18,
      effects: ["Deals direct damage", "Has a 25% chance to stun opponent for 1 round"],
      counters: ["Protego (strong)", "Rennervate (strong)"],
      history:
        "A staple in dueling since the 17th century, Stupefy is taught to all students as a basic defensive spell.",
      stats: {
        power: 85,
        accuracy: 80,
        speed: 65,
      },
    },
    protego: {
      name: "Protego",
      description: "A shield charm that protects the caster from incoming spells and physical entities.",
      icon: Shield,
      color: "purple",
      manaCost: 15,
      cooldown: 2,
      damage: 0,
      effects: ["Creates a shield that absorbs damage for 2 rounds", "Reflects 20% of damage back to attacker"],
      counters: ["None (but shield can be broken by powerful spells)"],
      history:
        "Protego was invented in the Middle Ages during a time of intense magical conflict, becoming essential for wizard self-defense.",
      stats: {
        power: 0,
        defense: 90,
        duration: 85,
      },
    },
  }

  // Get color classes based on spell color
  const getColorClasses = (color: string, element: "bg" | "border" | "text") => {
    const colorMap: Record<string, Record<string, string>> = {
      red: {
        bg: "bg-red-900/30",
        border: "border-red-500/30",
        text: "text-red-400",
      },
      blue: {
        bg: "bg-blue-900/30",
        border: "border-blue-500/30",
        text: "text-blue-400",
      },
      emerald: {
        bg: "bg-emerald-900/30",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
      },
      yellow: {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
      },
      purple: {
        bg: "bg-purple-900/30",
        border: "border-purple-500/30",
        text: "text-purple-400",
      },
    }

    return colorMap[color]?.[element] || colorMap.purple[element]
  }

  // Get the selected spell
  const spell = spells[selectedSpell as keyof typeof spells]
  const SpellIcon = spell.icon

  return (
    <div className="p-4">
      <h2 className="font-serif text-2xl text-center mb-6">Spellbook</h2>

      <Tabs defaultValue="incendio" value={selectedSpell} onValueChange={setSelectedSpell} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-800">
          <TabsTrigger value="incendio" className="data-[state=active]:bg-red-900/30 flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-400" />
            <span className="hidden sm:inline">Incendio</span>
          </TabsTrigger>
          <TabsTrigger value="glacius" className="data-[state=active]:bg-blue-900/30 flex items-center gap-2">
            <Snowflake className="h-4 w-4 text-blue-400" />
            <span className="hidden sm:inline">Glacius</span>
          </TabsTrigger>
          <TabsTrigger value="ventus" className="data-[state=active]:bg-emerald-900/30 flex items-center gap-2">
            <Wind className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Ventus</span>
          </TabsTrigger>
          <TabsTrigger value="stupefy" className="data-[state=active]:bg-yellow-900/30 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="hidden sm:inline">Stupefy</span>
          </TabsTrigger>
          <TabsTrigger value="protego" className="data-[state=active]:bg-purple-900/30 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-400" />
            <span className="hidden sm:inline">Protego</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(spells).map(([key, spellData]) => (
          <TabsContent
            key={key}
            value={key}
            className={`border ${getColorClasses(spellData.color, "border")} ${getColorClasses(spellData.color, "bg")} rounded-b-lg p-4 mt-0`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Spell Overview */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${getColorClasses(spellData.color, "bg")} border ${getColorClasses(spellData.color, "border")}`}
                >
                  <spellData.icon className={`h-10 w-10 ${getColorClasses(spellData.color, "text")}`} />
                </div>

                <h3 className="font-serif text-xl mb-1">{spellData.name}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge className={`${getColorClasses(spellData.color, "bg")} border-0`}>
                    {spellData.manaCost} Mana
                  </Badge>
                  <Badge className="bg-gray-800 border-0">
                    {spellData.cooldown} Round{spellData.cooldown > 1 ? "s" : ""} Cooldown
                  </Badge>
                </div>

                <p className="text-sm text-gray-300 text-center mb-4">{spellData.description}</p>

                {/* Spell Stats */}
                <div className="w-full space-y-2">
                  {"power" in spellData.stats && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Power</span>
                        <span>{spellData.stats.power}%</span>
                      </div>
                      <Progress
                        value={spellData.stats.power}
                        className="h-1.5 bg-gray-800"
                        indicatorClassName={`bg-${spellData.color}-600`}
                      />
                    </div>
                  )}

                  {spellData.stats.accuracy && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span>{spellData.stats.accuracy}%</span>
                      </div>
                      <Progress
                        value={spellData.stats.accuracy}
                        className="h-1.5 bg-gray-800"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                  )}

                  {spellData.stats.speed && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Speed</span>
                        <span>{spellData.stats.speed}%</span>
                      </div>
                      <Progress
                        value={spellData.stats.speed}
                        className="h-1.5 bg-gray-800"
                        indicatorClassName="bg-green-600"
                      />
                    </div>
                  )}

                  {spellData.stats.defense && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Defense</span>
                        <span>{spellData.stats.defense}%</span>
                      </div>
                      <Progress
                        value={spellData.stats.defense}
                        className="h-1.5 bg-gray-800"
                        indicatorClassName="bg-purple-600"
                      />
                    </div>
                  )}

                  {spellData.stats.duration && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Duration</span>
                        <span>{spellData.stats.duration}%</span>
                      </div>
                      <Progress
                        value={spellData.stats.duration}
                        className="h-1.5 bg-gray-800"
                        indicatorClassName="bg-amber-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Spell Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Effects</h4>
                  <ul className="space-y-1">
                    {spellData.effects.map((effect, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className={`${getColorClasses(spellData.color, "text")} mr-2`}>•</span>
                        <span className="text-gray-300">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Counters & Weaknesses</h4>
                  <ul className="space-y-1">
                    {spellData.counters.map((counter, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="text-gray-300">{counter}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Magical History</h4>
                  <p className="text-xs text-gray-300">{spellData.history}</p>
                </div>

                <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Casting Tips</h4>
                  <p className="text-xs text-gray-300">
                    {spellData.name === "Incendio" &&
                      "Focus on feelings of warmth and energy. The wand movement should be sharp and decisive, ending with a forward thrust."}
                    {spellData.name === "Glacius" &&
                      "Visualize the coldest winter night. The wand movement should be fluid and graceful, ending with a gentle wave."}
                    {spellData.name === "Ventus" &&
                      "Think of rushing air and freedom. The wand movement should be sweeping and circular, ending with a flick."}
                    {spellData.name === "Stupefy" &&
                      "Channel your determination and focus. The wand movement should be precise and direct, ending with a quick jab."}
                    {spellData.name === "Protego" &&
                      "Concentrate on creating a barrier between yourself and harm. The wand movement should be a swift upward arc, forming an invisible shield."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Best Against</h4>
                    <p className="text-xs text-gray-300">
                      {spellData.name === "Incendio" &&
                        "Ice-based creatures, plant-based entities, and wooden barriers."}
                      {spellData.name === "Glacius" &&
                        "Fire-based creatures, water elementals, and opponents using heat-based spells."}
                      {spellData.name === "Ventus" &&
                        "Flying creatures, smoke-based entities, and lightweight opponents."}
                      {spellData.name === "Stupefy" &&
                        "Physical attackers, non-shielded opponents, and creatures sensitive to light."}
                      {spellData.name === "Protego" &&
                        "Direct spell attacks, physical projectiles, and creatures that rely on direct contact."}
                    </p>
                  </div>

                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Combo Potential</h4>
                    <p className="text-xs text-gray-300">
                      {spellData.name === "Incendio" &&
                        "Cast after Ventus for an amplified flame attack. Combine with Aguamenti for a steam screen."}
                      {spellData.name === "Glacius" &&
                        "Cast after Aguamenti to freeze the target. Follow with Stupefy for increased stun chance."}
                      {spellData.name === "Ventus" &&
                        "Use before Incendio to create a fire tornado. Cast after Glacius for a blizzard effect."}
                      {spellData.name === "Stupefy" &&
                        "Cast after any elemental spell for increased damage. Follow with Incarcerous for capture."}
                      {spellData.name === "Protego" &&
                        "Cast before any counter-spell to safely reflect attacks. Use before Episkey to heal while protected."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

