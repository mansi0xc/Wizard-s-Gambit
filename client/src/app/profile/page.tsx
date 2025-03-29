"use client";
import { useAccount, useReadContract } from 'wagmi';
import { abi, contract_address } from '@/abi/player';
import Image from "next/image";
import {
  Trophy, Star, Clock, Flame, Shield, Zap, Award, 
  Sparkles, BarChart3, BookOpen, Swords, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PlayerStats {
  health: number;
  mana: number;
  defense: number;
  wandType: string;
  patronus: string;
}

export default function ProfilePage() {
  const { address } = useAccount();

  // Contract reads
  const { data: balance, isLoading: loadingBalance } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address }
  });

  const { data: tokenId, isLoading: loadingTokenId } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'tokenOfOwnerByIndex',
    args: [address!, BigInt(0)],
    query: { enabled: !!address && (balance ?? BigInt(0)) > BigInt(0) }
  });

  const { data: onchainStats, isLoading: loadingStats } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'playerStats',
    args: [tokenId!],
    query: {
      enabled: !!tokenId,
      select: (data): PlayerStats => ({
        health: Number(data[0]),
        mana: Number(data[1]),
        defense: Number(data[2]),
        wandType: data[3],
        patronus: data[4]
      })
    }
  });

  // Combined data
  const user = {
    name: "Archmage Lumina",
    title: "Master of Arcane Arts",
    level: 42,
    experience: 7850,
    nextLevelExp: 8500,
    joinDate: "March 15, 2023",
    avatar: "/wizard-avatar.png",
    banner: "/magic-banner.jpg",
    stats: {
      ...(onchainStats || { health: 100, mana: 100, defense: 50, wandType: 'Unknown', patronus: 'None' }),
      wins: 187,
      losses: 43,
      draws: 12,
      winRate: 81,
      totalMatches: 242,
      longestWinStreak: 14,
      currentWinStreak: 5,
    },
    achievements: [
      { id: 1, name: "First Victory", description: "Win your first duel", icon: Trophy, completed: true, date: "Mar 16, 2023" },
      { id: 2, name: "Collector", description: "Collect 10 different wands", icon: Wand2, completed: true, date: "Apr 2, 2023" },
      { id: 3, name: "Undefeated", description: "Win 10 duels in a row", icon: Star, completed: true, date: "May 10, 2023" },
      { id: 4, name: "Archmage", description: "Reach level 40", icon: Sparkles, completed: true, date: "Jul 22, 2023" },
      { id: 5, name: "Legendary", description: "Collect a legendary wand", icon: Award, completed: true, date: "Aug 5, 2023" },
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
    ]
  };

  // Loading state
  if (!address) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 text-center p-8">
      Connect your wallet to view your magical profile
    </div>
  );

  if (loadingBalance || loadingTokenId || loadingStats) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 p-8">
      <div className="container mx-auto space-y-8">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!balance || balance === BigInt(0)) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16 text-center p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl mb-4">No Avatar Found</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Forge Your Avatar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 pt-16">
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image src={user.banner} alt="Banner" fill className="object-cover opacity-50" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 overflow-hidden">
            <Image src={user.avatar} alt={user.name} width={128} height={128} className="object-cover" />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="font-serif text-3xl md:text-4xl">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge variant="outline" className="bg-purple-900/20 border-purple-500/30 text-purple-300">
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="bg-indigo-900/20 border-indigo-500/30 text-indigo-300">
                <Wand2 className="h-3 w-3 mr-1" />{user.stats.wandType}
              </Badge>
              <Badge variant="outline" className="bg-blue-900/20 border-blue-500/30 text-blue-300">
                <Sparkles className="h-3 w-3 mr-1" />{user.stats.patronus}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent border-purple-500/30 hover:bg-purple-900/20">
              <BookOpen className="h-4 w-4 mr-2" />Spellbook
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Swords className="h-4 w-4 mr-2" />Duel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Sparkles className="h-5 w-5" />Mana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400">{user.stats.mana} MP</div>
              <Progress value={user.stats.mana} className="mt-2 bg-gray-800 h-2" indicatorClassName="bg-purple-500" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Flame className="h-5 w-5" />Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-400">{user.stats.health} HP</div>
              <Progress value={user.stats.health} className="mt-2 bg-gray-800 h-2" indicatorClassName="bg-red-500" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Shield className="h-5 w-5" />Defense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-400">{user.stats.defense} DEF</div>
              <Progress value={user.stats.defense} className="mt-2 bg-gray-800 h-2" indicatorClassName="bg-blue-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stats" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="spells">Spells</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            {/* Add stats content here */}
          </TabsContent>

          <TabsContent value="achievements" className="border border-gray-800 bg-gray-900/30 rounded-b-lg p-4 mt-0">
            {user.achievements.map((achievement) => (
              <div key={achievement.id} className="border rounded-lg p-4 flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.completed ? 'bg-yellow-900/30' : 'bg-gray-800'}`}>
                  <achievement.icon className={`h-6 w-6 ${achievement.completed ? 'text-yellow-400' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{achievement.name}</h3>
                    {achievement.completed && (
                      <Badge className="ml-2 bg-yellow-500/20 text-yellow-300">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}