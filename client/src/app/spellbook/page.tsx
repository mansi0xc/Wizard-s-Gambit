"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Snowflake, Wind, Zap, Shield, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SpellbookPage() {
  const [selectedCategory, setSelectedCategory] = useState("fire")

  // Spell data by category
  const spellCategories = {
    fire: [
      {
        name: "Incendio",
        description: "A fire-making spell that conjures flames from the tip of your wand.",
        icon: Flame,
        color: "red",
        manaCost: 15,
        cooldown: 1,
        damage: 15,
        effects: ["Deals fire damage", "Has a 10% chance to apply a burn effect"],
        stats: { power: 80, accuracy: 90, speed: 70 },
      },
      {
        name: "Flagrante",
        description: "Causes objects to emit searing heat when touched by unauthorized persons.",
        icon: Flame,
        color: "red",
        manaCost: 20,
        cooldown: 2,
        damage: 18,
        effects: ["Creates a heat trap", "Deals damage over time"],
        stats: { power: 75, accuracy: 85, speed: 65 },
      },
      {
        name: "Fiendfyre",
        description: "Summons cursed fire of tremendous heat and ferocity that can destroy nearly anything.",
        icon: Flame,
        color: "red",
        manaCost: 40,
        cooldown: 4,
        damage: 35,
        effects: ["Massive area damage", "Difficult to control", "Destroys magical protections"],
        stats: { power: 95, accuracy: 60, speed: 80 },
      },
    ],
    ice: [
      {
        name: "Glacius",
        description: "A freezing charm that creates ice and lowers the temperature of the target.",
        icon: Snowflake,
        color: "blue",
        manaCost: 15,
        cooldown: 1,
        damage: 12,
        effects: ["Deals ice damage", "Has a 15% chance to slow opponent's next spell"],
        stats: { power: 70, accuracy: 95, speed: 75 },
      },
      {
        name: "Freezing Charm",
        description: "Immobilizes creatures by encasing them in a block of ice.",
        icon: Snowflake,
        color: "blue",
        manaCost: 25,
        cooldown: 3,
        damage: 10,
        effects: ["Immobilizes target for 2 rounds", "Creates ice barriers"],
        stats: { power: 65, accuracy: 90, speed: 60 },
      },
      {
        name: "Glacial Tempest",
        description: "Summons a swirling blizzard that damages and slows all enemies in an area.",
        icon: Snowflake,
        color: "blue",
        manaCost: 35,
        cooldown: 4,
        damage: 25,
        effects: ["Area effect damage", "Reduces opponent accuracy", "Creates difficult terrain"],
        stats: { power: 85, accuracy: 80, speed: 65 },
      },
    ],
    lightning: [
      {
        name: "Stupefy",
        description: "A stunning spell that renders the target unconscious or immobile.",
        icon: Zap,
        color: "yellow",
        manaCost: 15,
        cooldown: 2,
        damage: 18,
        effects: ["Deals direct damage", "Has a 25% chance to stun opponent for 1 round"],
        stats: { power: 85, accuracy: 80, speed: 65 },
      },
      {
        name: "Fulmen",
        description: "Conjures a bolt of lightning that strikes with incredible speed and power.",
        icon: Zap,
        color: "yellow",
        manaCost: 30,
        cooldown: 3,
        damage: 30,
        effects: ["High damage to single target", "Can chain to nearby targets"],
        stats: { power: 90, accuracy: 75, speed: 95 },
      },
      {
        name: "Tempestas",
        description: "Summons a localized lightning storm that strikes multiple targets.",
        icon: Zap,
        color: "yellow",
        manaCost: 40,
        cooldown: 5,
        damage: 40,
        effects: ["Area effect damage", "Disrupts magical shields", "Chance to stun all targets"],
        stats: { power: 95, accuracy: 70, speed: 85 },
      },
    ],
    wind: [
      {
        name: "Ventus",
        description: "A spell that creates a strong gust of wind from the tip of your wand.",
        icon: Wind,
        color: "emerald",
        manaCost: 15,
        cooldown: 1,
        damage: 10,
        effects: ["Deals wind damage", "Has a 20% chance to push back opponent, delaying their next attack"],
        stats: { power: 65, accuracy: 85, speed: 90 },
      },
      {
        name: "Aero Momentum",
        description: "Creates a swirling vortex that increases the caster's movement and attack speed.",
        icon: Wind,
        color: "emerald",
        manaCost: 25,
        cooldown: 3,
        damage: 5,
        effects: ["Increases caster speed by 30%", "Improves dodge chance", "Slight knockback effect"],
        stats: { power: 50, accuracy: 95, speed: 100 },
      },
      {
        name: "Tempest Fury",
        description: "Conjures a devastating tornado that tears through the battlefield.",
        icon: Wind,
        color: "emerald",
        manaCost: 35,
        cooldown: 4,
        damage: 30,
        effects: ["Massive area damage", "Pulls targets toward center", "Disrupts projectiles"],
        stats: { power: 85, accuracy: 75, speed: 90 },
      },
    ],
    protection: [
      {
        name: "Protego",
        description: "A shield charm that protects the caster from incoming spells and physical entities.",
        icon: Shield,
        color: "purple",
        manaCost: 15,
        cooldown: 2,
        damage: 0,
        effects: ["Creates a shield that absorbs damage for 2 rounds", "Reflects 20% of damage back to attacker"],
        stats: { power: 0, defense: 90, duration: 85 },
      },
      {
        name: "Fianto Duri",
        description: "Strengthens other protective spells and enchantments, creating a more powerful barrier.",
        icon: Shield,
        color: "purple",
        manaCost: 25,
        cooldown: 3,
        damage: 0,
        effects: ["Enhances existing shields by 50%", "Extends shield duration", "Adds minor reflection damage"],
        stats: { power: 0, defense: 95, duration: 90 },
      },
      {
        name: "Salvio Hexia",
        description: "A powerful protection spell that specifically repels hexes and dark magic.",
        icon: Shield,
        color: "purple",
        manaCost: 30,
        cooldown: 4,
        damage: 0,
        effects: ["Blocks dark magic completely", "Reduces all other damage by 50%", "Purges negative effects"],
        stats: { power: 0, defense: 85, duration: 75 },
      },
    ],
  }

  // Get color classes based on spell color
  const getColorClasses = (color: string, element: "bg" | "border" | "text" | "gradient") => {
    const colorMap: Record<string, Record<string, string>> = {
      red: {
        bg: "bg-red-900/30",
        border: "border-red-500/30",
        text: "text-red-400",
        gradient: "from-red-600 to-orange-600",
      },
      blue: {
        bg: "bg-blue-900/30",
        border: "border-blue-500/30",
        text: "text-blue-400",
        gradient: "from-blue-600 to-cyan-600",
      },
      emerald: {
        bg: "bg-emerald-900/30",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        gradient: "from-emerald-600 to-teal-600",
      },
      yellow: {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
        gradient: "from-yellow-600 to-amber-600",
      },
      purple: {
        bg: "bg-purple-900/30",
        border: "border-purple-500/30",
        text: "text-purple-400",
        gradient: "from-purple-600 to-indigo-600",
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

      {/* Animated magical particles */}
      <div className="absolute inset-0 z-0">
        <div id="particles-container" className="w-full h-full" />
      </div>

      <header className="container mx-auto pt-8 pb-4 px-4 z-10 relative">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="h-8 w-8 text-purple-400 mr-3" />
          <h1 className="font-serif text-3xl md:text-5xl text-center">The Grand Spellbook</h1>
        </div>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Master the ancient arts of magic through study and practice of these powerful incantations
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16 z-10 relative">
        <Tabs defaultValue="fire" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
            <TabsList className="grid w-full grid-cols-5 bg-gray-900/70 border border-gray-800">
              <TabsTrigger
                value="fire"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-orange-600/30 flex items-center gap-2"
              >
                <Flame className="h-4 w-4 text-red-400" />
                <span className="hidden sm:inline">Fire</span>
              </TabsTrigger>
              <TabsTrigger
                value="ice"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-cyan-600/30 flex items-center gap-2"
              >
                <Snowflake className="h-4 w-4 text-blue-400" />
                <span className="hidden sm:inline">Ice</span>
              </TabsTrigger>
              <TabsTrigger
                value="lightning"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600/30 data-[state=active]:to-amber-600/30 flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="hidden sm:inline">Lightning</span>
              </TabsTrigger>
              <TabsTrigger
                value="wind"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600/30 data-[state=active]:to-teal-600/30 flex items-center gap-2"
              >
                <Wind className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">Wind</span>
              </TabsTrigger>
              <TabsTrigger
                value="protection"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-indigo-600/30 flex items-center gap-2"
              >
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="hidden sm:inline">Protection</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <h2 className="font-serif text-2xl mb-4 flex items-center">
                {selectedCategory === "fire" && <Flame className="h-6 w-6 text-red-400 mr-2" />}
                {selectedCategory === "ice" && <Snowflake className="h-6 w-6 text-blue-400 mr-2" />}
                {selectedCategory === "lightning" && <Zap className="h-6 w-6 text-yellow-400 mr-2" />}
                {selectedCategory === "wind" && <Wind className="h-6 w-6 text-emerald-400 mr-2" />}
                {selectedCategory === "protection" && <Shield className="h-6 w-6 text-purple-400 mr-2" />}
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Spells
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spellCategories[selectedCategory as keyof typeof spellCategories].map((spell, index) => {
                  const SpellIcon = spell.icon
                  return (
                    <Card
                      key={index}
                      className={`bg-gray-900/70 backdrop-blur-sm border ${getColorClasses(spell.color, "border")} hover:shadow-lg hover:shadow-${spell.color}-500/10 transition-all duration-300 group overflow-hidden`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(spell.color, "gradient")} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      ></div>

                      <CardHeader className="relative">
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getColorClasses(spell.color, "bg")} border-0`}>
                            {spell.manaCost} Mana
                          </Badge>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${getColorClasses(spell.color, "bg")} border ${getColorClasses(spell.color, "border")}`}
                        >
                          <SpellIcon className={`h-6 w-6 ${getColorClasses(spell.color, "text")}`} />
                        </div>
                        <CardTitle className="font-serif">{spell.name}</CardTitle>
                        <CardDescription className="text-gray-400">{spell.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">Effects</h4>
                            <ul className="space-y-1">
                              {spell.effects.map((effect, i) => (
                                <li key={i} className="flex items-start text-xs">
                                  <span className={`${getColorClasses(spell.color, "text")} mr-2`}>•</span>
                                  <span className="text-gray-300">{effect}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 pt-2">
                            {spell.stats.power !== undefined && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Power</span>
                                  <span>{spell.stats.power}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div
                                    className={`bg-gradient-to-r ${getColorClasses(spell.color, "gradient")} h-1.5 rounded-full`}
                                    style={{ width: `${spell.stats.power}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {spell.stats.accuracy !== undefined && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Accuracy</span>
                                  <span>{spell.stats.accuracy}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${spell.stats.accuracy}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {spell.stats.speed !== undefined && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Speed</span>
                                  <span>{spell.stats.speed}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${spell.stats.speed}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {spell.stats.defense !== undefined && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Defense</span>
                                  <span>{spell.stats.defense}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div
                                    className="bg-purple-600 h-1.5 rounded-full"
                                    style={{ width: `${spell.stats.defense}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {spell.stats.duration !== undefined && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Duration</span>
                                  <span>{spell.stats.duration}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div
                                    className="bg-amber-600 h-1.5 rounded-full"
                                    style={{ width: `${spell.stats.duration}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t border-gray-800 pt-4">
                        <div className="flex justify-between w-full text-xs">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">Cooldown:</span>
                            <span>
                              {spell.cooldown} {spell.cooldown === 1 ? "round" : "rounds"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">Damage:</span>
                            <span className={spell.damage > 0 ? getColorClasses(spell.color, "text") : "text-gray-400"}>
                              {spell.damage > 0 ? spell.damage : "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="font-serif text-2xl mb-4 flex items-center">
              <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
              Spell Combinations
            </h2>

            <p className="text-gray-300 mb-6">
              Combine different elemental spells to create powerful magical effects. Experiment with these combinations
              in battle to discover new tactical advantages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center -ml-2">
                      <Wind className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="font-medium ml-2">Fire Tornado</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Cast Ventus immediately after Incendio to create a swirling vortex of flame that deals area damage and
                  has a chance to burn multiple targets.
                </p>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                      <Snowflake className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-yellow-900/30 flex items-center justify-center -ml-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="font-medium ml-2">Shocking Frost</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Cast Stupefy on a target affected by Glacius to create a shattering effect that deals bonus damage and
                  has a high chance to stun.
                </p>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center -ml-2">
                      <Flame className="h-4 w-4 text-red-400" />
                    </div>
                  </div>
                  <h3 className="font-medium ml-2">Flame Shield</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Cast Incendio immediately after Protego to create a shield that not only protects but also deals fire
                  damage to attackers who strike it.
                </p>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center">
                      <Wind className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center -ml-2">
                      <Snowflake className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="font-medium ml-2">Blizzard</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Cast Glacius while Ventus is active to create a devastating blizzard that slows all enemies and deals
                  continuous ice damage over time.
                </p>
              </div>
            </div>
          </div>
        </Tabs>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Create floating particles
            const particlesContainer = document.getElementById('particles-container');
            for (let i = 0; i < 50; i++) {
              const particle = document.createElement('div');
              particle.className = 'absolute w-1 h-1 rounded-full bg-purple-500 opacity-0';
              particle.style.left = Math.random() * 100 + '%';
              particle.style.top = Math.random() * 100 + '%';
              
              const size = Math.random() * 3 + 1;
              particle.style.width = size + 'px';
              particle.style.height = size + 'px';
              
              const hue = Math.random() > 0.5 ? 'purple' : 'blue';
              const color = hue === 'purple' ? 'rgb(167, 139, 250)' : 'rgb(129, 140, 248)';
              particle.style.backgroundColor = color;
              
              particlesContainer.appendChild(particle);
              
              animateParticle(particle);
            }
            
            function animateParticle(particle) {
              const duration = Math.random() * 15000 + 10000;
              const xMove = (Math.random() - 0.5) * 100;
              const yMove = (Math.random() - 0.5) * 100;
              
              particle.animate([
                { opacity: 0, transform: 'translate(0, 0)' },
                { opacity: 0.7, transform: 'translate(' + xMove/2 + 'px, ' + yMove/2 + 'px)' },
                { opacity: 0, transform: 'translate(' + xMove + 'px, ' + yMove + 'px)' }
              ], {
                duration: duration,
                iterations: Infinity
              });
            }
            
            // Add hover effects to spell cards
            const spellCards = document.querySelectorAll('.card');
            spellCards.forEach(card => {
              card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s ease';
              });
              
              card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
              });
            });
          });
        `,
        }}
      />
    </div>
  )
}

