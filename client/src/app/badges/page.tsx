"use client"

import { useState } from "react"
import { Trophy, Star, Shield, Zap, Flame, Sparkles, Wand2, Cat, Scroll, Award, Crown, BookOpen } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function BadgesPage() {
  // Sample badges data
  const badges = [
    {
      id: 1,
      name: "Elder Wand Master",
      description: "Win 10 duels with the Elderwood Wand",
      icon: Wand2,
      color: "purple",
      completed: true,
      date: "Aug 15, 2023",
      rarity: "Rare",
      progress: 100,
      reward: "Unlock the Elderwood Wand's hidden power",
    },
    {
      id: 2,
      name: "Patronus Protector",
      description: "Summon your Patronus 50 times",
      icon: Shield,
      color: "blue",
      completed: true,
      date: "Jul 22, 2023",
      rarity: "Uncommon",
      progress: 100,
      reward: "+10% Patronus effectiveness",
    },
    {
      id: 3,
      name: "Phoenix Companion",
      description: "Win a duel using the Phoenix companion's ability",
      icon: Flame,
      color: "orange",
      completed: true,
      date: "Sep 3, 2023",
      rarity: "Uncommon",
      progress: 100,
      reward: "Phoenix companion cooldown reduced by 1 round",
    },
    {
      id: 4,
      name: "Triwizard Champion",
      description: "Win 3 duels in a row",
      icon: Trophy,
      color: "yellow",
      completed: true,
      date: "Aug 30, 2023",
      rarity: "Common",
      progress: 100,
      reward: "Triwizard Champion title",
    },
    {
      id: 5,
      name: "Spellweaver",
      description: "Cast 100 spells",
      icon: Sparkles,
      color: "indigo",
      completed: true,
      date: "Jul 10, 2023",
      rarity: "Common",
      progress: 100,
      reward: "10% mana regeneration boost",
    },
    {
      id: 6,
      name: "Familiar Bond",
      description: "Use companion abilities 25 times",
      icon: Cat,
      color: "green",
      completed: false,
      progress: 68,
      rarity: "Uncommon",
      reward: "Unlock a special companion interaction",
    },
    {
      id: 7,
      name: "Arcane Scholar",
      description: "Collect 20 different spells",
      icon: BookOpen,
      color: "blue",
      completed: false,
      progress: 75,
      rarity: "Uncommon",
      reward: "Unlock an additional spell slot",
    },
    {
      id: 8,
      name: "Dueling Prodigy",
      description: "Win 50 duels",
      icon: Zap,
      color: "yellow",
      completed: false,
      progress: 82,
      rarity: "Rare",
      reward: "Exclusive dueling arena background",
    },
    {
      id: 9,
      name: "Legendary Collection",
      description: "Collect 5 legendary items",
      icon: Star,
      color: "purple",
      completed: false,
      progress: 40,
      rarity: "Epic",
      reward: "Increased chance to find legendary items",
    },
    {
      id: 10,
      name: "Archmage",
      description: "Reach level 50",
      icon: Crown,
      color: "gold",
      completed: false,
      progress: 84,
      rarity: "Epic",
      reward: "Archmage title and special wand effect",
    },
    {
      id: 11,
      name: "Spell Inventor",
      description: "Create a custom spell combination",
      icon: Scroll,
      color: "teal",
      completed: false,
      progress: 0,
      rarity: "Legendary",
      reward: "Name and save a custom spell combination",
    },
    {
      id: 12,
      name: "Grand Champion",
      description: "Win a seasonal tournament",
      icon: Award,
      color: "gold",
      completed: false,
      progress: 0,
      rarity: "Legendary",
      reward: "Exclusive legendary wand and title",
    },
  ]

  // State for badge details modal
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  // Function to get color classes based on badge color
  const getColorClasses = (color: string, element: "bg" | "border" | "text") => {
    const colorMap: Record<string, Record<string, string>> = {
      purple: {
        bg: "bg-purple-900/30",
        border: "border-purple-500/30",
        text: "text-purple-400",
      },
      blue: {
        bg: "bg-blue-900/30",
        border: "border-blue-500/30",
        text: "text-blue-400",
      },
      indigo: {
        bg: "bg-indigo-900/30",
        border: "border-indigo-500/30",
        text: "text-indigo-400",
      },
      green: {
        bg: "bg-green-900/30",
        border: "border-green-500/30",
        text: "text-green-400",
      },
      yellow: {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
      },
      orange: {
        bg: "bg-orange-900/30",
        border: "border-orange-500/30",
        text: "text-orange-400",
      },
      red: {
        bg: "bg-red-900/30",
        border: "border-red-500/30",
        text: "text-red-400",
      },
      teal: {
        bg: "bg-teal-900/30",
        border: "border-teal-500/30",
        text: "text-teal-400",
      },
      gold: {
        bg: "bg-amber-900/30",
        border: "border-amber-500/30",
        text: "text-amber-400",
      },
    }

    return colorMap[color]?.[element] || colorMap.purple[element]
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 relative overflow-hidden">
      {/* Background magical symbols */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/5 w-32 h-32 border border-purple-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-16 border border-blue-500 rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-64 border border-indigo-500 rotate-12"></div>
        <div className="absolute top-2/3 right-1/5 w-40 h-40 border border-violet-500 rounded-lg rotate-12"></div>
      </div>

      <header className="container mx-auto pt-8 pb-4 px-4 z-10 relative">
        <h1 className="font-serif text-3xl md:text-5xl text-center mb-2">The Hall of Achievements</h1>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Showcase your magical prowess through badges earned on your journey through the wizarding world.
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16 z-10 relative">
        {/* Badge Statistics */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {badges.filter((b) => b.completed).length}/{badges.length}
              </div>
              <p className="text-gray-400">Badges Earned</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {badges.filter((b) => b.rarity === "Legendary" && b.completed).length}/
                {badges.filter((b) => b.rarity === "Legendary").length}
              </div>
              <p className="text-gray-400">Legendary Badges</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {Math.round(badges.reduce((acc, badge) => acc + badge.progress, 0) / badges.length)}%
              </div>
              <p className="text-gray-400">Overall Completion</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {badges.filter((b) => b.progress > 0 && b.progress < 100).length}
              </div>
              <p className="text-gray-400">Badges In Progress</p>
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                      badge.completed ? getColorClasses(badge.color, "border") : "border-gray-800"
                    } ${badge.completed ? getColorClasses(badge.color, "bg") : "bg-gray-900/50"}`}
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        badge.completed ? getColorClasses(badge.color, "bg") : "bg-gray-800"
                      }`}
                    >
                      <badge.icon
                        className={`h-8 w-8 ${
                          badge.completed ? getColorClasses(badge.color, "text") : "text-gray-500"
                        }`}
                      />
                    </div>

                    <h3
                      className={`text-sm font-medium text-center ${badge.completed ? "text-white" : "text-gray-400"}`}
                    >
                      {badge.name}
                    </h3>

                    {!badge.completed && badge.progress > 0 && (
                      <div className="w-full mt-2">
                        <Progress
                          value={badge.progress}
                          className="h-1 bg-gray-800"
                          indicatorClassName={`bg-${badge.color}-600`}
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">{badge.progress}%</p>
                      </div>
                    )}

                    {badge.completed && (
                      <Badge className={`mt-2 ${getColorClasses(badge.color, "bg")} border-0`}>Completed</Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border border-gray-800 p-3">
                  <p className="font-medium mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-300">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Badge Details Dialog */}
        <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
          <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl flex items-center">
                {selectedBadge?.icon && (
                  <selectedBadge.icon
                    className={`mr-2 h-6 w-6 ${getColorClasses(selectedBadge?.color || "purple", "text")}`}
                  />
                )}
                {selectedBadge?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400">{selectedBadge?.rarity} Achievement</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center mb-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${getColorClasses(
                  selectedBadge?.color || "purple",
                  "bg",
                )}`}
              >
                {selectedBadge?.icon && (
                  <selectedBadge.icon
                    className={`h-12 w-12 ${getColorClasses(selectedBadge?.color || "purple", "text")}`}
                  />
                )}
              </div>

              <Badge
                className={`${
                  selectedBadge?.rarity === "Legendary"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : selectedBadge?.rarity === "Epic"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      : selectedBadge?.rarity === "Rare"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "bg-green-500/20 text-green-300 border-green-500/30"
                }`}
              >
                {selectedBadge?.rarity}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-gray-300">{selectedBadge?.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Reward</h4>
                <p className="text-gray-300">{selectedBadge?.reward}</p>
              </div>

              {selectedBadge?.completed ? (
                <div>
                  <h4 className="text-sm font-medium mb-1">Achieved</h4>
                  <p className="text-gray-300">{selectedBadge?.date}</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-medium mb-1">Progress</h4>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Completion</span>
                    <span>{selectedBadge?.progress}%</span>
                  </div>
                  <Progress
                    value={selectedBadge?.progress}
                    className="h-2 bg-gray-800"
                    indicatorClassName={`bg-${selectedBadge?.color}-600`}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button className="bg-gray-800 hover:bg-gray-700 text-white">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Add subtle pulse animation to badges
            const badges = document.querySelectorAll('.grid > div');
            badges.forEach(badge => {
              setInterval(() => {
                if (Math.random() > 0.7) {
                  badge.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                  ], {
                    duration: 1500,
                    iterations: 1
                  });
                }
              }, Math.random() * 5000 + 3000);
            });
          });
        `,
        }}
      />
    </div>
  )
}

