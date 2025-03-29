import Image from "next/image"
import {
  Trophy,
  Star,
  Clock,
  Flame,
  Shield,
  Zap,
  Award,
  Sparkles,
  BarChart3,
  BookOpen,
  Swords,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  // Sample user data
  const user = {
    name: "Archmage Lumina",
    title: "Master of Arcane Arts",
    level: 42,
    experience: 7850,
    nextLevelExp: 8500,
    joinDate: "March 15, 2023",
    avatar: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=1200",
    stats: {
      wins: 187,
      losses: 43,
      draws: 12,
      winRate: 81,
      totalMatches: 242,
      longestWinStreak: 14,
      currentWinStreak: 5,
    },
    achievements: [
      {
        id: 1,
        name: "First Victory",
        description: "Win your first duel",
        icon: Trophy,
        completed: true,
        date: "Mar 16, 2023",
      },
      {
        id: 2,
        name: "Collector",
        description: "Collect 10 different wands",
        icon: Wand2,
        completed: true,
        date: "Apr 2, 2023",
      },
      {
        id: 3,
        name: "Undefeated",
        description: "Win 10 duels in a row",
        icon: Star,
        completed: true,
        date: "May 10, 2023",
      },
      { id: 4, name: "Archmage", description: "Reach level 40", icon: Sparkles, completed: true, date: "Jul 22, 2023" },
      {
        id: 5,
        name: "Legendary",
        description: "Collect a legendary wand",
        icon: Award,
        completed: true,
        date: "Aug 5, 2023",
      },
      { id: 6, name: "Grand Master", description: "Win 500 duels", icon: Trophy, completed: false, progress: 37 },
    ],
    recentMatches: [
      { id: 1, opponent: "Sorcerer Malachai", result: "win", date: "2 hours ago" },
      { id: 2, opponent: "Enchantress Elara", result: "win", date: "5 hours ago" },
      { id: 3, opponent: "Warlock Thorne", result: "win", date: "Yesterday" },
      { id: 4, opponent: "Mystic Orion", result: "loss", date: "2 days ago" },
      { id: 5, opponent: "Illusionist Zephyr", result: "win", date: "3 days ago" },
    ],
    favoriteSpells: [
      { name: "Stupefy", uses: 342, winRate: 78 },
      { name: "Protego", uses: 289, winRate: 92 },
      { name: "Incendio", uses: 201, winRate: 75 },
      { name: "Expelliarmus", uses: 187, winRate: 81 },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16">
      {/* Profile Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image src={user.banner || "/placeholder.svg"} alt="Profile Banner" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent"></div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 overflow-hidden">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="font-serif text-3xl md:text-4xl">{user.name}</h1>
            <p className="text-purple-400 mb-1">{user.title}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge variant="outline" className="bg-purple-900/20 border-purple-500/30 text-purple-300">
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="bg-blue-900/20 border-blue-500/30 text-blue-300">
                <Trophy className="h-3 w-3 mr-1" />
                {user.stats.wins} Wins
              </Badge>
              <Badge variant="outline" className="bg-indigo-900/20 border-indigo-500/30 text-indigo-300">
                <Clock className="h-3 w-3 mr-1" />
                Joined {user.joinDate}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-transparent border-purple-500/30 hover:bg-purple-900/20 hover:border-purple-400"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Spellbook
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Swords className="h-4 w-4 mr-2" />
              Duel
            </Button>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mt-6 mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span>Experience</span>
            <span>
              {user.experience} / {user.nextLevelExp}
            </span>
          </div>
          <Progress
            value={(user.experience / user.nextLevelExp) * 100}
            className="h-2 bg-gray-800"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            {user.nextLevelExp - user.experience} XP until Level {user.level + 1}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="stats" className="data-[state=active]:bg-gray-800">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-800">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-800">
              Battle History
            </TabsTrigger>
            <TabsTrigger value="spells" className="data-[state=active]:bg-gray-800">
              Favorite Spells
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                    Win Rate
                  </CardTitle>
                  <CardDescription>Your dueling performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-yellow-400">{user.stats.winRate}%</div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - user.stats.winRate / 100)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mt-2">
                    <div>
                      <p className="text-sm text-gray-400">Wins</p>
                      <p className="text-lg font-medium text-green-400">{user.stats.wins}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Losses</p>
                      <p className="text-lg font-medium text-red-400">{user.stats.losses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Draws</p>
                      <p className="text-lg font-medium text-blue-400">{user.stats.draws}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-orange-400" />
                    Win Streak
                  </CardTitle>
                  <CardDescription>Your consecutive victories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="text-5xl font-bold text-orange-400 mb-2">{user.stats.currentWinStreak}</div>
                    <p className="text-sm text-gray-400">Current Streak</p>
                    <div className="w-full h-0.5 bg-gray-800 my-4"></div>
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                      <span className="text-sm text-gray-400">Best Streak:</span>
                      <span className="text-lg font-medium ml-2">{user.stats.longestWinStreak}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    Total Matches
                  </CardTitle>
                  <CardDescription>Your dueling experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="text-5xl font-bold text-blue-400 mb-2">{user.stats.totalMatches}</div>
                    <p className="text-sm text-gray-400">Duels Completed</p>
                    <div className="w-full h-0.5 bg-gray-800 my-4"></div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-sm text-gray-400">Member for:</span>
                      <span className="text-lg font-medium ml-2">289 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 flex items-center gap-4 ${
                    achievement.completed ? "border-yellow-500/30 bg-yellow-900/10" : "border-gray-700 bg-gray-900/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.completed ? "bg-yellow-900/30 text-yellow-400" : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    <achievement.icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{achievement.name}</h3>
                      {achievement.completed && (
                        <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Completed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{achievement.description}</p>

                    {achievement.completed ? (
                      <p className="text-xs text-yellow-400 mt-1">Achieved on {achievement.date}</p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress
                          value={achievement.progress}
                          className="h-1.5 bg-gray-800"
                          indicatorClassName="bg-yellow-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Battle History Tab */}
          <TabsContent value="history" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Recent Matches</h3>

              <div className="space-y-2">
                {user.recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`border rounded-lg p-3 flex items-center ${
                      match.result === "win" ? "border-green-500/30 bg-green-900/10" : "border-red-500/30 bg-red-900/10"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        match.result === "win" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {match.result === "win" ? <Trophy className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">vs. {match.opponent}</span>
                          <Badge
                            className={`ml-2 ${
                              match.result === "win"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            {match.result === "win" ? "Victory" : "Defeat"}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-400">{match.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  View All Matches
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Favorite Spells Tab */}
          <TabsContent value="spells" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Most Used Spells</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.favoriteSpells.map((spell, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 bg-gray-900/50 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-900/30 text-indigo-400">
                      {index === 0 && <Zap className="h-5 w-5" />}
                      {index === 1 && <Shield className="h-5 w-5" />}
                      {index === 2 && <Flame className="h-5 w-5" />}
                      {index === 3 && <Sparkles className="h-5 w-5" />}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{spell.name}</h4>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Used {spell.uses} times</span>
                        <span>Win rate: {spell.winRate}%</span>
                      </div>
                      <Progress
                        value={spell.winRate}
                        className="h-1.5 bg-gray-800 mt-2"
                        indicatorClassName="bg-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

