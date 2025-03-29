import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wand2, Sparkles, Cat, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DeckPage() {
  // Sample data for selected items
  const selectedWand = {
    id: 1,
    name: "Elder Wand",
    description: "The most powerful wand ever made. Said to be unbeatable in a duel.",
    rarity: "Legendary",
    image: "/placeholder.svg?height=200&width=50",
    stats: {
      power: 95,
      control: 85,
      speed: 75,
    },
  }

  const selectedPatronus = {
    id: 1,
    name: "Phoenix",
    description: "Rare and powerful. Represents rebirth and healing.",
    image: "/placeholder.svg?height=150&width=150",
    ability: "Rebirth: Once per duel, restore 30% of your health when below 20%.",
  }

  const selectedCompanion = {
    id: 1,
    name: "Owl",
    description: "Wise and swift. Grants insight into opponent's next move.",
    image: "/placeholder.svg?height=120&width=120",
    ability: "Foresight: Once per duel, reveal your opponent's next spell.",
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 relative overflow-hidden">
      {/* Background magical symbols */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/5 text-9xl">✦</div>
        <div className="absolute top-1/3 right-1/4 text-8xl">⚝</div>
        <div className="absolute bottom-1/4 left-1/3 text-9xl">⚜</div>
        <div className="absolute top-2/3 right-1/5 text-8xl">⚕</div>
      </div>

      <header className="container mx-auto pt-8 pb-4 px-4 z-10 relative">
        <h1 className="font-serif text-3xl md:text-4xl text-center mb-2">The Spellbook Sanctum</h1>
        <p className="text-center text-gray-400 mb-8">Customize your magical arsenal for the duel</p>
      </header>

      <main className="container mx-auto px-4 pb-16 z-10 relative max-w-4xl">
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wand Section */}
            <div className="flex flex-col items-center border border-purple-900/30 rounded-lg p-4 bg-black/20 relative group">
              <button className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="h-4 w-4 text-purple-400" />
              </button>

              <Wand2 className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="font-serif text-lg mb-4">Primary Wand</h3>

              <div className="w-full flex flex-col items-center">
                <Image
                  src={selectedWand.image || "/placeholder.svg"}
                  alt={selectedWand.name}
                  width={40}
                  height={160}
                  className="object-contain mb-3"
                />
                <p className="font-medium text-center">{selectedWand.name}</p>
                <p className="text-xs text-yellow-400 mb-3">{selectedWand.rarity}</p>

                <div className="w-full space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Power</span>
                    <span>{selectedWand.stats.power}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: `${selectedWand.stats.power}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Control</span>
                    <span>{selectedWand.stats.control}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${selectedWand.stats.control}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Speed</span>
                    <span>{selectedWand.stats.speed}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${selectedWand.stats.speed}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patronus Section */}
            <div className="flex flex-col items-center border border-blue-900/30 rounded-lg p-4 bg-black/20 relative group">
              <button className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="h-4 w-4 text-blue-400" />
              </button>

              <Sparkles className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="font-serif text-lg mb-4">Patronus</h3>

              <div className="w-full flex flex-col items-center">
                <div className="relative w-32 h-32 mb-3">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-full"></div>
                  <Image
                    src={selectedPatronus.image || "/placeholder.svg"}
                    alt={selectedPatronus.name}
                    width={150}
                    height={150}
                    className="object-contain opacity-70"
                  />
                </div>

                <p className="font-medium text-center">{selectedPatronus.name}</p>
                <p className="text-xs text-gray-400 mb-3">Spiritual Guardian</p>

                <div className="w-full mt-2 p-3 bg-blue-900/10 border border-blue-900/20 rounded text-xs">
                  <p className="font-medium text-blue-300 mb-1">Special Ability:</p>
                  <p className="text-gray-300">{selectedPatronus.ability}</p>
                </div>
              </div>
            </div>

            {/* Companion Section */}
            <div className="flex flex-col items-center border border-indigo-900/30 rounded-lg p-4 bg-black/20 relative group">
              <button className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="h-4 w-4 text-indigo-400" />
              </button>

              <Cat className="h-6 w-6 text-indigo-400 mb-2" />
              <h3 className="font-serif text-lg mb-4">Companion</h3>

              <div className="w-full flex flex-col items-center">
                <Image
                  src={selectedCompanion.image || "/placeholder.svg"}
                  alt={selectedCompanion.name}
                  width={100}
                  height={100}
                  className="object-contain mb-3"
                />

                <p className="font-medium text-center">{selectedCompanion.name}</p>
                <p className="text-xs text-gray-400 mb-3">Magical Familiar</p>

                <div className="w-full mt-2 p-3 bg-indigo-900/10 border border-indigo-900/20 rounded text-xs">
                  <p className="font-medium text-indigo-300 mb-1">Special Ability:</p>
                  <p className="text-gray-300">{selectedCompanion.ability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting lines between items */}
          <div className="relative mt-6 mb-8 h-4 hidden md:block">
            <div className="absolute left-1/6 right-1/6 top-1/2 h-0.5 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-indigo-500/30"></div>
            <div className="absolute left-1/6 w-0.5 h-4 bg-purple-500/30"></div>
            <div className="absolute left-1/2 w-0.5 h-4 bg-blue-500/30 -translate-x-1/2"></div>
            <div className="absolute right-1/6 w-0.5 h-4 bg-indigo-500/30"></div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="bg-transparent border border-purple-500 text-white hover:bg-purple-900/20 hover:border-purple-400 transition-all duration-500 group px-6 py-6 text-lg relative overflow-hidden"
            >
              <Link href="/battle">
                <span className="relative z-10">Ready to Duel</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 duration-500"></span>
                <ArrowRight className="ml-2 inline-block h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="spells" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="spells" className="data-[state=active]:bg-gray-800">
              Spells
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="data-[state=active]:bg-gray-800">
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-gray-800">
              Strategies
            </TabsTrigger>
          </TabsList>
          <TabsContent value="spells" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-800 bg-black/20 rounded-lg p-3 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-sm mb-1">
                    {["Stupefy", "Expelliarmus", "Protego", "Incendio", "Glacius", "Ventus"][i]}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {["Stunning", "Disarming", "Shield", "Fire", "Ice", "Wind"][i]} Spell
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="artifacts" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-800 bg-black/20 rounded-lg p-3 hover:border-blue-500/30 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-sm mb-1">
                    {["Time-Turner", "Invisibility Cloak", "Resurrection Stone"][i]}
                  </h4>
                  <p className="text-xs text-gray-400">{["Temporal", "Concealment", "Spiritual"][i]} Artifact</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="strategies" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-800 bg-black/20 rounded-lg p-3 hover:border-indigo-500/30 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-sm mb-1">{["Defensive Stance", "Aggressive Casting"][i]}</h4>
                  <p className="text-xs text-gray-400">
                    {["Increases defense, reduces damage taken", "Increases spell power, reduces defense"][i]}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Add subtle pulse animation to items
            const items = document.querySelectorAll('.grid > div');
            items.forEach(item => {
              item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02)';
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

