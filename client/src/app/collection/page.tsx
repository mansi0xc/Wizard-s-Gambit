"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Info, Wand2, Sparkles, Cat, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function CollectionPage() {
  // Sample data for wands, patronuses, and companions
  const wands = [
    {
      id: 1,
      name: "Wand of Inferno",
      description: "Forged from the heart of a dying star, Inferno is a legendary wand crafted from deep crimson wood, its surface infused with molten fire veins that glow like embers. The handle, wrapped in obsidian-like material, is adorned with intricate golden runes that pulse with arcane energy. At its core lies a brilliant red gemstone, resembling a fiery heart, radiating raw magical power. The wand's tip crackles with enchanted flames, leaving a shimmering heatwave in its wake. Wielded by masters of flame magic, Inferno embodies destruction, passion, and unyielding power.",
      rarity: "Legendary",
      image: "/red.png",
      stats: { power: 95, control: 85, speed: 75 },
    },
    {
      id: 2,
      name: "Temptest Ventus",
      description: "Crafted from the sacred branches of the World Tree, Vintus is a wand infused with the boundless energy of the skies. Its deep emerald-green wood is adorned with swirling wind patterns that shimmer with an airy glow, ever-shifting like a breeze. The handle, wrapped in silver-like material, is etched with celestial runes that pulse with the whispers of the wind. At its heart, a radiant green emerald, resembling the eye of a tempest, channels the untamed power of the skies. The wand’s tip glows with a vibrant green aura, spiraling with enchanted gusts, capable of summoning gales, guiding the wind, and bending the very air to its wielder's will. A tool of speed, intellect, and freedom, Vintus embodies the limitless expanse of the heavens.",
      rarity: "Rare",
      image: "/yellow.png",
      stats: { power: 90, control: 75, speed: 80 },
    },
    {
      id: 3,
      name: "Frostbite",
      description: "Carved from the enchanted icewood of the Arctic tundra, Frostbite is a wand of unmatched glacial might. Its deep icy-blue surface is infused with frost veins that emit an ethereal cold glow. The handle, wrapped in silver-like material, bears intricate runes that pulse with the magic of winter. At its core, a brilliant blue sapphire, resembling a frozen heart, is embedded—channeling the raw essence of ice. The tip glows with an icy blue aura, exuding an enchanting frost that crystallizes the air around it. Used by sorcerers of the frozen realms, Frostbite represents precision, serenity, and the relentless force of winter.",
      rarity: "Rare",
      image: "/blue.png",
      stats: { power: 80, control: 90, speed: 85 },
    },
    
    // {
    //   id: 4,
    //   name: "Unicorn Hair Wand",
    //   description: "Consistent and loyal. Difficult to turn to the Dark Arts.",
    //   rarity: "Uncommon",
    //   image: "/Screenshot 2025-03-27 164329.png",
    //   stats: { power: 70, control: 95, speed: 75 },
    // },
    // {
    //   id: 5,
    //   name: "Veela Hair Wand",
    //   description: "Temperamental but powerful for charms.",
    //   rarity: "Uncommon",
    //   image: "/Screenshot 2025-03-27 164648.png",
    //   stats: { power: 75, control: 80, speed: 90 },
    // },
    // {
    //   id: 6,
    //   name: "Thunderbird Tail Feather Wand",
    //   description: "Powerful and sensitive to danger.",
    //   rarity: "Rare",
    //   image: "/Screenshot 2025-03-26 20573.png",
    //   stats: { power: 85, control: 80, speed: 85 },
    // },
  ]

  const patronuses = [
    {
      id: 1,
      name: "Stag",
      description: "Noble and protective. Represents pride and purpose.",
      image: "/stag.jpg",
      ability: "Protector: Reduces damage taken by 20% for 2 rounds.",
    },
    {
      id: 2,
      name: "Phoenix",
      description: "Rare and powerful. Represents rebirth and healing.",
      image: "/phoenix.jpeg",
      ability: "Rebirth: Once per duel, restore 30% of your health when below 20%.",
    },
    {
      id: 3,
      name: "Wolf",
      description: "Loyal and fierce. Represents family and instinct.",
      image: "/wolf.jpg",
      ability: "Pack Hunter: Increases damage by 15% for 2 rounds.",
    },
    {
      id: 4,
      name: "Otter",
      description: "Playful and intelligent. Represents joy and curiosity.",
      image: "/otter.jpeg",
      ability: "Evasive: 25% chance to dodge attacks for 2 rounds.",
    },
  ]

  const companions = [
    {
      id: 1,
      name: "Owl",
      description: "Wise and swift. Grants insight into opponent's next move.",
      image: "/owl.jpeg",
      ability: "Foresight: Once per duel, reveal your opponent's next spell.",
    },
    {
      id: 2,
      name: "Cat",
      description: "Stealthy and perceptive. Can dodge one attack per duel.",
      image: "/cat.jpg",
      ability: "Nimble: Once per duel, automatically dodge an incoming attack.",
    },
    {
      id: 3,
      name: "Toad",
      description: "Ancient and mysterious. Can absorb one spell per duel.",
      image: "/toad.jpg",
      ability: "Absorption: Once per duel, absorb a spell and gain 10% health.",
    },
    {
      id: 4,
      name: "Raven",
      description: "Clever and resourceful. Increases spell damage by 10%.",
      image: "/raven.jpg",
      ability: "Amplify: Passively increases all spell damage by 10%.",
    },
  ]

  // State for selected items
  const [selectedWand, setSelectedWand] = useState(wands[0])
  const [selectedPatronus, setSelectedPatronus] = useState(patronuses[1])
  const [selectedCompanion, setSelectedCompanion] = useState(companions[0])

  // State for currently viewed item details
  const [detailItem, setDetailItem] = useState<any>(null)
  const [detailType, setDetailType] = useState<"wand" | "patronus" | "companion" | null>(null)

  // Function to handle "Use" button click
  const handleUseItem = (item: any, type: "wand" | "patronus" | "companion") => {
    if (type === "wand") setSelectedWand(item)
    else if (type === "patronus") setSelectedPatronus(item)
    else if (type === "companion") setSelectedCompanion(item)
  }

  // Function to handle "Details" button click
  const handleViewDetails = (item: any, type: "wand" | "patronus" | "companion") => {
    setDetailItem(item)
    setDetailType(type)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 relative overflow-hidden pt-16">
      {/* Background magical artifacts outlines */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/5 w-32 h-32 border border-purple-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-16 border border-blue-500 rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-64 border border-indigo-500 rotate-12"></div>
        <div className="absolute top-2/3 right-1/5 w-40 h-40 border border-violet-500 rounded-lg rotate-12"></div>
      </div>

      <header className="container mx-auto pt-8 pb-4 px-4 z-10 relative">
        <h1 className="font-serif text-3xl md:text-4xl text-center mb-2">The Arcane Vault</h1>
        <p className="text-center text-gray-400 mb-8">Your collection of magical artifacts and creatures</p>
      </header>

      <main className="container mx-auto px-4 pb-16 z-10 relative">
        {/* Deck Preview - Now shown first */}
        <section className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-12">
          <h2 className="font-serif text-xl mb-4">Current Deck</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 border border-purple-900/30 rounded-lg p-3 bg-black/20">
              <Image
                src={selectedWand.image || "/placeholder.svg"}
                alt={selectedWand.name}
                width={40}
                height={120}
                className="object-contain"
              />
              <div className="flex-1">
                <p className="font-medium">{selectedWand.name}</p>
                <p className="text-xs text-gray-400">Primary Wand</p>
                <p
                  className={`text-xs mt-1 ${
                    selectedWand.rarity === "Legendary"
                      ? "text-yellow-400"
                      : selectedWand.rarity === "Rare"
                        ? "text-purple-400"
                        : "text-blue-400"
                  }`}
                >
                  {selectedWand.rarity}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-purple-500/30 hover:bg-purple-900/20"
                onClick={() => handleViewDetails(selectedWand, "wand")}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 border border-blue-900/30 rounded-lg p-3 bg-black/20">
              <Image
                src={selectedPatronus.image || "/placeholder.svg"}
                alt={selectedPatronus.name}
                width={60}
                height={60}
                className="object-contain opacity-70"
              />
              <div className="flex-1">
                <p className="font-medium">{selectedPatronus.name}</p>
                <p className="text-xs text-gray-400">Patronus</p>
                <p className="text-xs text-blue-400 mt-1">Spiritual Guardian</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-blue-500/30 hover:bg-blue-900/20"
                onClick={() => handleViewDetails(selectedPatronus, "patronus")}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 border border-indigo-900/30 rounded-lg p-3 bg-black/20">
              <Image
                src={selectedCompanion.image || "/placeholder.svg"}
                alt={selectedCompanion.name}
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="flex-1">
                <p className="font-medium">{selectedCompanion.name}</p>
                <p className="text-xs text-gray-400">Companion</p>
                <p className="text-xs text-indigo-400 mt-1">Magical Familiar</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-indigo-500/30 hover:bg-indigo-900/20"
                onClick={() => handleViewDetails(selectedCompanion, "companion")}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              asChild
              className="bg-transparent border border-indigo-500 text-white hover:bg-indigo-900/20 hover:border-indigo-400 transition-all duration-300 group"
            >
              <Link href="/deck">
                Edit Deck
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Collection Tabs */}
        <Tabs defaultValue="wands" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="wands" className="data-[state=active]:bg-gray-800">
              Wands
            </TabsTrigger>
            <TabsTrigger value="patronuses" className="data-[state=active]:bg-gray-800">
              Patronuses
            </TabsTrigger>
            <TabsTrigger value="companions" className="data-[state=active]:bg-gray-800">
              Companions
            </TabsTrigger>
          </TabsList>

          {/* Wands Tab */}
          <TabsContent value="wands" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="flex items-center mb-4">
              <Wand2 className="mr-2 h-5 w-5 text-purple-400" />
              <h2 className="font-serif text-2xl">Wand Collection</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {wands.map((wand) => (
                <div
                  key={wand.id}
                  className={`bg-gray-900/50 border ${
                    selectedWand.id === wand.id ? "border-purple-500" : "border-gray-800"
                  } rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group`}
                >
                  <div className="w-full h-76 relative flex mb-2 border-2 border-blue-700">
                    <img
                      src={wand.image || "/placeholder.svg"}
                      alt={wand.name}
                      // width={200}
                      // height={150}
                      className="object-fill transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{wand.name}</span>
                  <span
                    className={`text-xs mt-1 ${
                      wand.rarity === "Legendary"
                        ? "text-yellow-400"
                        : wand.rarity === "Rare"
                          ? "text-purple-400"
                          : "text-blue-400"
                    }`}
                  >
                    {wand.rarity}
                  </span>

                  <div className="flex gap-2 mt-4 w-full">
                    <Button
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleUseItem(wand, "wand")}
                    >
                      {selectedWand.id === wand.id ? (
                        <span>Selected</span>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          <span>Use</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-purple-500/30 hover:bg-purple-900/20"
                      onClick={() => handleViewDetails(wand, "wand")}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Patronuses Tab */}
          <TabsContent value="patronuses" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="flex items-center mb-4">
              <Sparkles className="mr-2 h-5 w-5 text-blue-400" />
              <h2 className="font-serif text-2xl">Patronus Gallery</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {patronuses.map((patronus) => (
                <div
                  key={patronus.id}
                  className={`bg-gray-900/50 border ${
                    selectedPatronus.id === patronus.id ? "border-blue-500" : "border-gray-800"
                  } rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.15)] group`}
                >
                  <div className="w-full h-32 relative flex items-center justify-center mb-2">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-lg"></div>
                    <Image
                      src={patronus.image || "/placeholder.svg"}
                      alt={patronus.name}
                      width={150}
                      height={150}
                      className="object-contain transition-all duration-500 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{patronus.name}</span>
                  <span className="text-xs text-blue-400 mt-1">Spiritual Guardian</span>

                  <div className="flex gap-2 mt-4 w-full">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleUseItem(patronus, "patronus")}
                    >
                      {selectedPatronus.id === patronus.id ? (
                        <span>Selected</span>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          <span>Use</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-blue-500/30 hover:bg-blue-900/20"
                      onClick={() => handleViewDetails(patronus, "patronus")}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Companions Tab */}
          <TabsContent value="companions" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="flex items-center mb-4">
              <Cat className="mr-2 h-5 w-5 text-indigo-400" />
              <h2 className="font-serif text-2xl">Companion Menagerie</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className={`bg-gray-900/50 border ${
                    selectedCompanion.id === companion.id ? "border-indigo-500" : "border-gray-800"
                  } rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] group`}
                >
                  <div className="w-full h-28 relative flex items-center justify-center mb-2">
                    <Image
                      src={companion.image || "/placeholder.svg"}
                      alt={companion.name}
                      width={120}
                      height={120}
                      className="object-contain transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{companion.name}</span>
                  <span className="text-xs text-indigo-400 mt-1">Magical Familiar</span>

                  <div className="flex gap-2 mt-4 w-full">
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleUseItem(companion, "companion")}
                    >
                      {selectedCompanion.id === companion.id ? (
                        <span>Selected</span>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          <span>Use</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-indigo-500/30 hover:bg-indigo-900/20"
                      onClick={() => handleViewDetails(companion, "companion")}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Item Details Dialog */}
      <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl flex items-center">
              {detailType === "wand" && <Wand2 className="mr-2 h-5 w-5 text-purple-400" />}
              {detailType === "patronus" && <Sparkles className="mr-2 h-5 w-5 text-blue-400" />}
              {detailType === "companion" && <Cat className="mr-2 h-5 w-5 text-indigo-400" />}
              {detailItem?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {detailType === "wand" && "Magical Wand"}
              {detailType === "patronus" && "Spiritual Guardian"}
              {detailType === "companion" && "Magical Familiar"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center mb-4">
            <div
              className={`w-32 h-32 flex items-center justify-center mb-3 ${
                detailType === "wand"
                  ? "bg-purple-900/10"
                  : detailType === "patronus"
                    ? "bg-blue-900/10"
                    : "bg-indigo-900/10"
              } rounded-lg`}
            >
              <Image
                src={detailItem?.image || "/placeholder.svg"}
                alt={detailItem?.name || "Item"}
                width={detailType === "wand" ? 200 : 120}
                height={detailType === "wand" ? 200 : 120}
                className="object-fill"
              />
            </div>

            {detailType === "wand" && (
              <Badge
                className={`${
                  detailItem?.rarity === "Legendary"
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    : detailItem?.rarity === "Rare"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}
              >
                {detailItem?.rarity}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300">{detailItem?.description}</p>

            {detailType === "wand" && detailItem?.stats && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Wand Statistics</h4>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Power</span>
                    <span>{detailItem.stats.power}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: `${detailItem.stats.power}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Control</span>
                    <span>{detailItem.stats.control}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${detailItem.stats.control}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Speed</span>
                    <span>{detailItem.stats.speed}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${detailItem.stats.speed}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {(detailType === "patronus" || detailType === "companion") && detailItem?.ability && (
              <div
                className={`p-3 rounded ${
                  detailType === "patronus"
                    ? "bg-blue-900/10 border border-blue-900/30"
                    : "bg-indigo-900/10 border border-indigo-900/30"
                }`}
              >
                <h4 className="text-sm font-medium mb-1">Special Ability</h4>
                <p className="text-xs">{detailItem.ability}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent border-gray-700">
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DialogClose>

            <Button
              className={`${
                detailType === "wand"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : detailType === "patronus"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
              onClick={() => {
                if (detailType) handleUseItem(detailItem, detailType)
                setDetailItem(null)
              }}
            >
              {(detailType === "wand" && selectedWand.id === detailItem?.id) ||
              (detailType === "patronus" && selectedPatronus.id === detailItem?.id) ||
              (detailType === "companion" && selectedCompanion.id === detailItem?.id) ? (
                <span>Currently Selected</span>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Deck
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Add subtle pulse animation to items
            const items = document.querySelectorAll('.grid > div');
            items.forEach(item => {
              item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.03)';
                item.style.transition = 'all 0.3s ease';
              });
              
              item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
              });
            });
          });
        `,
        }}
      />
    </div>
  )
}

