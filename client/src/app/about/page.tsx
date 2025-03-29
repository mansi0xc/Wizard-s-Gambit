import Image from "next/image"
import Link from "next/link"
import { Send, Github, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SplashCursor from '@/components/ui/SplashCursor/SplashCursor'


export default function AboutPage() {
  // Sample team data
  const team = [
    {
      name: "Elara Nightshade",
      role: "Lead Game Designer",
      bio: "Master of magical systems and game balance. Previously worked on acclaimed fantasy titles.",
      avatar: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Orion Blackwood",
      role: "Creative Director",
      bio: "Visionary storyteller with a passion for creating immersive magical worlds.",
      avatar: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Lyra Silverstone",
      role: "Art Director",
      bio: "Award-winning artist specializing in magical aesthetics and atmospheric design.",
      avatar: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Thorne Ravenclaw",
      role: "Lead Developer",
      bio: "Technical wizard who brings magical experiences to life through code.",
      avatar: "/placeholder.svg?height=120&width=120",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 relative overflow-hidden">
      <SplashCursor />
      {/* Background magical runes */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/5 text-9xl">ᚠ</div>
        <div className="absolute top-1/3 right-1/4 text-8xl">ᚹ</div>
        <div className="absolute bottom-1/4 left-1/3 text-9xl">ᛗ</div>
        <div className="absolute top-2/3 right-1/5 text-8xl">ᛟ</div>
        <div className="absolute bottom-1/3 left-1/4 text-7xl">ᚦ</div>
      </div>

      <header className="container mx-auto pt-8 pb-4 px-4 z-10 relative">
        <h1 className="font-serif text-3xl md:text-5xl text-center mb-2">The Chronicles of the Arcane</h1>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Discover the magical world behind Wizarding Realms: The Arcane Duel, where ancient spells, mystical creatures,
          and powerful wizards await.
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16 z-10 relative">
        <Tabs defaultValue="lore" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="lore" className="data-[state=active]:bg-gray-800">
              Lore
            </TabsTrigger>
            <TabsTrigger value="gameplay" className="data-[state=active]:bg-gray-800">
              Gameplay
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-gray-800">
              Team
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-gray-800">
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Lore Tab */}
          <TabsContent value="lore" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-6 mt-0">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-purple-300">The World of Arcanum</h2>
                <p className="text-gray-300 leading-relaxed">
                  In a realm hidden from ordinary eyes, magic flows like rivers through ancient lands. The world of
                  Arcanum exists parallel to our own, separated by a veil that only the most gifted can pierce. For
                  centuries, wizards and witches have harnessed the arcane energies that permeate this world, forming
                  societies, schools, and traditions that pass down knowledge from one generation to the next.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  The five great magical academies—Ravenspire, Luminaris, Thornwood, Mistral Heights, and
                  Emberforge—compete for prestige and power, each specializing in different branches of magic. Students
                  pledge allegiance to these academies, mastering their craft under the guidance of archmages who have
                  spent lifetimes perfecting their art.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-blue-300">The Ancient Conflict</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Beneath the scholarly pursuits lies an ancient conflict. The Arcane Wars, fought centuries ago,
                    nearly tore the magical world apart. Though peace now reigns, tensions simmer beneath the surface as
                    wizards vie for powerful artifacts and forgotten knowledge.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    The most coveted treasures are the Primordial Wands—crafted from materials that existed at the dawn
                    of magic itself. These wands choose their wielders, forming bonds that last lifetimes and granting
                    abilities beyond ordinary spellcasting.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-indigo-300">Magical Creatures</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Arcanum teems with magical creatures, from the majestic phoenixes that soar through crimson skies to
                    the mysterious deep-dwelling krakens that guard ancient underwater cities. Some creatures form bonds
                    with wizards, becoming companions that aid them in their magical pursuits.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    The most sacred bond is that between a wizard and their Patronus—a spiritual guardian that reflects
                    their inner self. These ethereal beings manifest in times of need, protecting their wizards from
                    dark forces and lending their unique abilities in magical duels.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-xl text-purple-300">The Arcane Duels</h3>
                <p className="text-gray-300 leading-relaxed">
                  The tradition of Arcane Dueling emerged as a civilized alternative to magical warfare. These formal
                  contests of skill and strategy allow wizards to prove their mastery without bloodshed. The Grand
                  Tournament, held once every seven years, draws the most talented duelists from across Arcanum,
                  offering glory, recognition, and access to rare magical knowledge.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  As a rising star in the world of Arcane Dueling, you must master your wand, bond with your Patronus,
                  choose a loyal companion, and develop strategies that will lead you to victory. The path is fraught
                  with challenges, but for those with the skill and determination, legends await to be written.
                </p>
              </div>

              <div className="relative h-40 overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=300&width=1000"
                  alt="Magical Landscape"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-serif text-2xl text-white">
                    "Magic is not just power—it is responsibility, legacy, and art."
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Gameplay Tab */}
          <TabsContent value="gameplay" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-6 mt-0">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-purple-300">Core Gameplay</h2>
                <p className="text-gray-300 leading-relaxed">
                  Wizarding Realms: The Arcane Duel is a strategic deck-building game where players collect magical
                  artifacts, bond with creatures, and master spells to defeat opponents in magical duels. The game
                  combines elements of strategy, collection, and skill-based combat in a richly detailed magical world.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-purple-500/30 hover:bg-purple-900/10 transition-colors">
                  <h3 className="font-serif text-xl text-purple-300 mb-3">Deck Building</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Choose your primary wand from your collection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Select a Patronus with unique defensive abilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Pick a magical companion to aid you in battle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Assemble a spellbook of offensive and defensive spells</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-blue-500/30 hover:bg-blue-900/10 transition-colors">
                  <h3 className="font-serif text-xl text-blue-300 mb-3">Dueling System</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Turn-based combat with strategic spell casting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Manage mana resources for powerful spells</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Counter opponent spells with the right defenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Activate Patronus and companion abilities at critical moments</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-indigo-500/30 hover:bg-indigo-900/10 transition-colors">
                  <h3 className="font-serif text-xl text-indigo-300 mb-3">Progression</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span>Gain experience and level up your wizard</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span>Unlock new wands, Patronuses, and companions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span>Learn powerful spells as you advance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span>Earn badges and achievements for special feats</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-purple-300">Game Modes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <h3 className="font-serif text-xl text-yellow-300 mb-2">Story Campaign</h3>
                    <p className="text-gray-300">
                      Follow your journey from a novice wizard to a master duelist. Explore the magical world, meet
                      legendary characters, and uncover ancient secrets through a series of increasingly challenging
                      duels and quests.
                    </p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <h3 className="font-serif text-xl text-green-300 mb-2">Tournament Mode</h3>
                    <p className="text-gray-300">
                      Test your skills against other players in competitive tournaments. Climb the ranks, earn exclusive
                      rewards, and prove yourself as the ultimate Arcane Duelist in seasonal competitions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-40 overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-serif text-2xl text-white text-center">
                    "Strategy. Collection. Mastery.
                    <br />
                    Your magical journey awaits."
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-6 mt-0">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-purple-300 text-center">The Wizards Behind the Magic</h2>
                <p className="text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">
                  Meet the talented team of designers, artists, developers, and storytellers who have brought the
                  magical world of Wizarding Realms to life.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 hover:border-purple-500/30 hover:bg-purple-900/10 transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-colors">
                        <div className="w-full h-full relative">
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/30 group-hover:opacity-70 opacity-50 transition-opacity"></div>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl text-white mb-1">{member.name}</h3>
                      <p className="text-purple-300 text-sm mb-3">{member.role}</p>
                      <p className="text-gray-400 text-sm text-center">{member.bio}</p>

                      <div className="flex mt-4 space-x-3">
                        <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                          <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                          <Github className="h-4 w-4" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mt-8">
                <h3 className="font-serif text-xl text-purple-300 mb-4 text-center">Join Our Magical Team</h3>
                <p className="text-gray-300 text-center mb-6">
                  We're always looking for talented individuals who are passionate about creating magical experiences.
                  If you believe you have what it takes to join our coven of creators, we'd love to hear from you.
                </p>
                <div className="flex justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    View Open Positions
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-6 mt-0">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-purple-300 text-center">Contact the Council of Mages</h2>
                <p className="text-gray-300 leading-relaxed text-center">
                  Have questions, suggestions, or feedback about Wizarding Realms? Our council of mages is ready to
                  assist you on your magical journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-sm text-gray-400">support@wizardingrealms.com</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-3">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-medium mb-1">Twitter</h3>
                  <p className="text-sm text-gray-400">@WizardingRealms</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center mb-3">
                    <Github className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="font-medium mb-1">Discord</h3>
                  <p className="text-sm text-gray-400">discord.gg/wizardingrealms</p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="font-serif text-xl text-purple-300 mb-4">Send a Magical Message</h3>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What is your message about?"
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts, questions, or feedback..."
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 min-h-[150px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Connecting lines between sections */}
        <div className="relative h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 my-12 max-w-4xl mx-auto"></div>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-purple-300 mb-4">Begin Your Magical Journey</h2>
          <p className="text-gray-300 mb-6">
            The world of Arcanum awaits, filled with wonders to discover, spells to master, and duels to win. Are you
            ready to claim your place among the legendary wizards?
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
            <Link href="/">Enter the Realm</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

