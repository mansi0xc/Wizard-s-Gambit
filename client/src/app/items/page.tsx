"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { writeContract, waitForTransactionReceipt } from "@wagmi/core"
import { GameItemsAddress, GameItemsABI } from "../abi/GameItems"
import { config } from "../wagmi"
import { Loader2, FlameIcon as Fire, Wand, Sparkles, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"


const baseurl = "https://scarlet-urgent-pig-985.mypinata.cloud/ipfs/"


const gameAssets = {
  // Element Cards (Fungible)
  elementCards: {
    // INFERNO_CARD: { id: 1001, uri: `${baseurl}bafkreibsx7ei4ylmelaa3ul7wt7jwcs6j6fuydwkpf5zcicinnooekziby` },
    INFERNO_CARD: { id: 1001, uri: `${baseurl}bafkreiafo4nxgvlsa3jxkwzkhygmwlq4kugv3sk5ulddq6rvevngtz3eba` },
    FROST_CARD: { id: 1002, uri: `${baseurl}bafkreiafo4nxgvlsa3jxkwzkhygmwlq4kugv3sk5ulddq6rvevngtz3eba` },
    TEMPEST_CARD: { id: 1003, uri: `${baseurl}bafkreicavagxqlqnchqdemey3imvurdjvkecjxtsf35tqzuxyo3dt3rnea` },
  },

  // Wands (Non-fungible)
  wands: {
    infernoWands: [
      { id: 101, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
      { id: 102, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
      { id: 103, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
    ],
    frostWands: [
      { id: 201, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
      { id: 202, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
      { id: 203, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
    ],
    tempestWands: [
      { id: 301, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
      { id: 302, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
      { id: 303, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
    ],
  },

  // Spells (Non-fungible)
  spells: {
    infernoSpells: [
      { id: 401, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
      { id: 402, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
      { id: 403, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
    ],
    glaciusSpells: [
      { id: 501, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
      { id: 502, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
      { id: 503, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
    ],
    tempestSpells: [
      { id: 601, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
      { id: 602, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
      { id: 603, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
    ],
  },

  // Patronus (Non-fungible)
  patronus: {
    STAG: { id: 701, uri: `${baseurl}bafkreifgviem2tgso7sww276463lmsrzjxxzhsx2vvfrkzo37htfbya2ty` },
    PHOENIX: { id: 702, uri: `${baseurl}bafkreibe6gepb6wvijm7ljbaegl4pugwczffjjbmyalnkjwaw5pr4zudiy` },
    OTTER: { id: 703, uri: `${baseurl}bafkreidv2b53srhsuodnwd3ihgtnko73mry6uda6gqbfrrxtptyrw3dyqe` },
    WOLF: { id: 704, uri: `${baseurl}bafkreigok5kcnqglbwurm3svfzc5pp2cdfx5v6yq3n5wqxa4wdbotfdwly` },
  },

  // Professor Shards (Fungible)
  professorShards: {
    SNAPE_SHARD: { id: 9001, uri: `${baseurl}bafkreic7mvfvheedhg5k7j2s7rmxnouertik4bgdwq7tteaynje4ct7ul4` },
    DUMBLEDORE_SHARD: { id: 9002, uri: `${baseurl}bafkreifvj5lhengf2pxdx3ddjhtccqwmi5lehgfufwh72e5ti24bwo7kq4` },
    VOLDEMORT_SHARD: { id: 9003, uri: `${baseurl}bafkreicxu3vcjktmqq5pul4ytss3lbtpygee7tmki4rnskwezbvgecvkgy` },
  },

  // Professor SFTs (Non-fungible)
  professors: {
    SNAPE: { id: 9100, uri: `${baseurl}bafkreihw3k7q2xzjn7bggsmthn7owc5axsk3ujpqqaruxcpjm3mflrm3x4` },
    DUMBLEDORE: { id: 9200, uri: `${baseurl}bafkreifnb3s6tekhzutv6ia3o34hvdcitckmpyjd3btruh4bqkkr5kt5q4` },
    VOLDEMORT: { id: 9300, uri: `${baseurl}bafkreicpkp5jhmojjlglvvvbe3k3d2qmm5hcfezwzygkznouypaue5i65m` },
  },
}

// Type for metadata
interface ItemMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

export default function BuyItemsPage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(true)
  const [metadataCache, setMetadataCache] = useState<Record<string, ItemMetadata>>({})
  const [activeTab, setActiveTab] = useState("elementCards")
  const [processingItem, setProcessingItem] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllMetadata = async () => {
      setLoading(true)
      const cache: Record<string, ItemMetadata> = {}

      // Helper function to fetch and cache metadata for a single item
      const fetchAndCacheItem = async (uri: string) => {
        try {
          if (!cache[uri]) {
            const metadata = await fetchMetadata(uri)
            cache[uri] = metadata
          }
        } catch (error) {
          console.error(`Error fetching metadata for ${uri}:`, error)
        }
      }

      // Fetch metadata for all items
      const fetchPromises = []

      // Element Cards
      for (const key in gameAssets.elementCards) {
        fetchPromises.push(fetchAndCacheItem(gameAssets.elementCards[key as keyof typeof gameAssets.elementCards].uri))
      }

      // Wands
      for (const wandType in gameAssets.wands) {
        const wandArray = gameAssets.wands[wandType as keyof typeof gameAssets.wands]
        for (const wand of wandArray) {
          fetchPromises.push(fetchAndCacheItem(wand.uri))
        }
      }

      // Spells
      for (const spellType in gameAssets.spells) {
        const spellArray = gameAssets.spells[spellType as keyof typeof gameAssets.spells]
        for (const spell of spellArray) {
          fetchPromises.push(fetchAndCacheItem(spell.uri))
        }
      }

      // Patronus
      for (const key in gameAssets.patronus) {
        fetchPromises.push(fetchAndCacheItem(gameAssets.patronus[key as keyof typeof gameAssets.patronus].uri))
      } 

      // Professor Shards
      for (const key in gameAssets.professorShards) {
        fetchPromises.push(
          fetchAndCacheItem(gameAssets.professorShards[key as keyof typeof gameAssets.professorShards].uri),
        )
      }

      // Professors
      for (const key in gameAssets.professors) {
        fetchPromises.push(fetchAndCacheItem(gameAssets.professors[key as keyof typeof gameAssets.professors].uri))
      }

      await Promise.all(fetchPromises)
      setMetadataCache(cache)
      setLoading(false)
    }

    fetchAllMetadata()
  }, [])

  const fetchMetadata = async (uri: string) => {
    try {
      const response = await fetch(uri)
      if (!response.ok) {
        throw new Error("Failed to fetch metadata.")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching metadata:", error)
      throw new Error("Failed to fetch metadata.")
    }
  }

  async function handlemintElementCard(id: number, amount: number, uri: string) {
    try {
      setProcessingItem(`elementCard-${id}`)


      uri = uri.replace(baseurl,"ipfs://")
      console.log(uri)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintElementCard",
        args: [id, amount, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Element Card #${id}`)
    } catch (error) {
      console.error("Error minting element card:", error)
      alert("Failed to mint Element Card. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }
  async function handleUpgradeSpell(oldid: number, newid: number, cardid:number, wandid: number, uri: string) {
    try {
      setProcessingItem(`spell-${oldid}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "upgradeSpell",
        args: [oldid, newid, cardid, wandid, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully upgraded Spell #${oldid}`)
    } catch (error) {
      console.error("Error upgrading spell:", error)
      alert("Failed to upgrade Spell. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlemintWand(wandid: number, amount: number, uri: string) {
    try {
      setProcessingItem(`wand-${wandid}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintWand",
        args: [wandid, amount, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Wand #${wandid}`)
    } catch (error) {
      console.error("Error minting wand:", error)
      alert("Failed to mint Wand. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlemintBasicSpell(spellid: number, elementCard: number, uri: string) {
    try {
      setProcessingItem(`spell-${spellid}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintBasicSpell",
        args: [spellid, elementCard, 1, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Spell #${spellid}`)
    } catch (error) {
      console.error("Error minting spell:", error)
      alert("Failed to mint Spell. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlemintPatronus(id: number, uri: string) {
    try {
      setProcessingItem(`patronus-${id}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintPatronus",
        args: [id, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Patronus #${id}`)
    } catch (error) {
      console.error("Error minting patronus:", error)
      alert("Failed to mint Patronus. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlemintProfessorShard(shardid: number, amount: number, professorid: number, uri: string) {
    try {
      setProcessingItem(`professorShard-${shardid}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintProfessorShard",
        args: [shardid, amount, professorid, uri],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Professor Shard #${shardid}`)
    } catch (error) {
      console.error("Error minting professor shard:", error)
      alert("Failed to mint Professor Shard. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  async function handlemintProfessor(shardid: number, professorid: number) {
    try {
      setProcessingItem(`professor-${professorid}`)
      const result = await writeContract(config, {
        abi: GameItemsABI,
        address: GameItemsAddress,
        functionName: "mintProfessor",
        args: [shardid, professorid],
      })
      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted Professor #${professorid}`)
    } catch (error) {
      console.error("Error minting professor:", error)
      alert("Failed to mint Professor. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading game assets...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg mb-4">Please connect your wallet to purchase game items</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Magical Items Shop</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="elementCards" className="flex items-center gap-2">
            <Fire className="h-4 w-4" />
            <span className="hidden md:inline">Element Cards</span>
          </TabsTrigger>
          <TabsTrigger value="wands" className="flex items-center gap-2">
            <Wand className="h-4 w-4" />
            <span className="hidden md:inline">Wands</span>
          </TabsTrigger>
          <TabsTrigger value="spells" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:inline">Spells</span>
          </TabsTrigger>
          <TabsTrigger value="patronus" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Patronus</span>
          </TabsTrigger>
          <TabsTrigger value="professorShards" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:inline">Shards</span>
          </TabsTrigger>
          <TabsTrigger value="professors" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Professors</span>
          </TabsTrigger>
        </TabsList>

        {/* Element Cards */}
        <TabsContent value="elementCards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.elementCards).map(([key, card]) => {
              const metadata = metadataCache[card.uri]
              return (
                <Card key={`element-${card.id}`} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    {metadata?.image && (
                      <img
                        src={metadata.image || "/placeholder.svg"}
                        alt={metadata.name || key}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-2 right-2 bg-amber-500">Fungible</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{metadata?.name || key}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{metadata?.description || "A magical element card"}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handlemintElementCard(card.id, 1, card.uri)}
                      disabled={processingItem === `elementCard-${card.id}`}
                    >
                      {processingItem === `elementCard-${card.id}` ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Wands */}
        <TabsContent value="wands">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.wands).map(([wandType, wands]) => {
              return wands.map((wand, index) => {
                const metadata = metadataCache[wand.uri]
                const wandTypeName = wandType.replace("Wands", "")
                return (
                  <Card key={`wand-${wand.id}`} className="overflow-hidden flex flex-col">
                    <div className="relative aspect-square overflow-hidden">
                      {metadata?.image && (
                        <img
                          src={metadata.image || "/placeholder.svg"}
                          alt={metadata.name || `${wandTypeName} Wand ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
                      {wandType === "infernoWands" && (
                        <Badge className="absolute top-2 left-2 bg-red-500">Inferno</Badge>
                      )}
                      {wandType === "frostWands" && <Badge className="absolute top-2 left-2 bg-blue-500">Frost</Badge>}
                      {wandType === "tempestWands" && (
                        <Badge className="absolute top-2 left-2 bg-green-500">Tempest</Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{metadata?.name || `${wandTypeName} Wand ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        {metadata?.description || `A powerful ${wandTypeName} wand`}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handlemintWand(wand.id, 1, wand.uri)}
                        disabled={processingItem === `wand-${wand.id}`}
                      >
                        {processingItem === `wand-${wand.id}` ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Buy"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            })}
          </div>
        </TabsContent>

        {/* Spells */}
        <TabsContent value="spells">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.spells).map(([spellType, spells]) => {
              let elementCardId = 0
              if (spellType === "infernoSpells") elementCardId = 1001
              else if (spellType === "glaciusSpells") elementCardId = 1002
              else if (spellType === "tempestSpells") elementCardId = 1003

              return spells.map((spell, index) => {
                const metadata = metadataCache[spell.uri]
                const spellTypeName = spellType.replace("Spells", "")
                return (
                  <Card key={`spell-${spell.id}`} className="overflow-hidden flex flex-col">
                    <div className="relative aspect-square overflow-hidden">
                      {metadata?.image && (
                        <img
                          src={metadata.image || "/placeholder.svg"}
                          alt={metadata.name || `${spellTypeName} Spell ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
                      {spellType === "infernoSpells" && (
                        <Badge className="absolute top-2 left-2 bg-red-500">Inferno</Badge>
                      )}
                      {spellType === "glaciusSpells" && (
                        <Badge className="absolute top-2 left-2 bg-blue-500">Glacius</Badge>
                      )}
                      {spellType === "tempestSpells" && (
                        <Badge className="absolute top-2 left-2 bg-green-500">Tempest</Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{metadata?.name || `${spellTypeName} Spell ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        {metadata?.description || `A powerful ${spellTypeName} spell`}
                      </p>
                      <p className="text-xs mt-2 text-muted-foreground">Requires corresponding element card</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handlemintBasicSpell(spell.id, elementCardId, spell.uri)}
                        disabled={processingItem === `spell-${spell.id}`}
                      >
                        {processingItem === `spell-${spell.id}` ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Buy"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            })}
          </div>
        </TabsContent>

        {/* Patronus */}
        <TabsContent value="patronus">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.patronus).map(([key, patronus]) => {
              const metadata = metadataCache[patronus.uri]
              return (
                <Card key={`patronus-${patronus.id}`} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    {metadata?.image && (
                      <img
                        src={metadata.image || "/placeholder.svg"}
                        alt={metadata.name || key}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{metadata?.name || key}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      {metadata?.description || `A magical ${key} patronus`}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handlemintPatronus(patronus.id, patronus.uri)}
                      disabled={processingItem === `patronus-${patronus.id}`}
                    >
                      {processingItem === `patronus-${patronus.id}` ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Professor Shards */}
        <TabsContent value="professorShards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.professorShards).map(([key, shard]) => {
              const metadata = metadataCache[shard.uri]
              // Determine which professor this shard belongs to
              let professorId = 0
              if (key === "SNAPE_SHARD") professorId = 9100
              else if (key === "DUMBLEDORE_SHARD") professorId = 9200
              else if (key === "VOLDEMORT_SHARD") professorId = 9300

              return (
                <Card key={`shard-${shard.id}`} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    {metadata?.image && (
                      <img
                        src={metadata.image || "/placeholder.svg"}
                        alt={metadata.name || key}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-2 right-2 bg-amber-500">Fungible</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{metadata?.name || key}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      {metadata?.description || `A shard of Professor ${key.split("_")[0]}`}
                    </p>
                    <p className="text-xs mt-2 text-muted-foreground">Collect shards to mint a Professor</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handlemintProfessorShard(shard.id, 1, professorId, shard.uri)}
                      disabled={processingItem === `professorShard-${shard.id}`}
                    >
                      {processingItem === `professorShard-${shard.id}` ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Professors */}
        <TabsContent value="professors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameAssets.professors).map(([key, professor]) => {
              const metadata = metadataCache[professor.uri]
              // Determine which shard is needed for this professor
              let shardId = 0
              if (key === "SNAPE") shardId = 9001
              else if (key === "DUMBLEDORE") shardId = 9002
              else if (key === "VOLDEMORT") shardId = 9003

              return (
                <Card key={`professor-${professor.id}`} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    {metadata?.image && (
                      <img
                        src={metadata.image || "/placeholder.svg"}
                        alt={metadata.name || key}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{metadata?.name || key}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{metadata?.description || `Professor ${key}`}</p>
                    <p className="text-xs mt-2 text-muted-foreground">Requires corresponding professor shards</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handlemintProfessor(shardId, professor.id)}
                      disabled={processingItem === `professor-${professor.id}`}
                    >
                      {processingItem === `professor-${professor.id}` ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}





// "use client";

// import { useState } from "react";
// import { useReadContract, useWriteContract,useAccount} from "wagmi";
// import { readContract,writeContract,waitForTransactionReceipt } from '@wagmi/core';
// import {GameItemsAddress,GameItemsABI} from "../abi/GameItems";
// import { config } from "../wagmi";

// const baseurl = process.env.url as string;

// const gameAssets = {
//   // Element Cards (Fungible)
//   elementCards: {
//     // INFERNO_CARD: { id: 1001, uri: `${baseurl}bafkreibsx7ei4ylmelaa3ul7wt7jwcs6j6fuydwkpf5zcicinnooekziby` },
//     INFERNO_CARD: { id: 1001, uri: "ipfs://bafkreibsx7ei4ylmelaa3ul7wt7jwcs6j6fuydwkpf5zcicinnooekziby" },
//     FROST_CARD: { id: 1002, uri: `${baseurl}bafkreiafo4nxgvlsa3jxkwzkhygmwlq4kugv3sk5ulddq6rvevngtz3eba` },
//     TEMPEST_CARD: { id: 1003, uri: `${baseurl}bafkreicavagxqlqnchqdemey3imvurdjvkecjxtsf35tqzuxyo3dt3rnea` },
//   },

//   // Wands (Non-fungible)
//   wands: {
//     infernoWands: [
//       { id: 101, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
//       { id: 102, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
//       { id: 103, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
//     ],
//     frostWands: [
//       { id: 201, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
//       { id: 202, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
//       { id: 203, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
//     ],
//     tempestWands: [
//       { id: 301, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//       { id: 302, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//       { id: 303, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//     ],
//   },

//   // Spells (Non-fungible)
//   spells: {
//     infernoSpells: [
//       { id: 401, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
//       { id: 402, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
//       { id: 403, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
//     ],
//     glaciusSpells: [
//       { id: 501, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
//       { id: 502, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
//       { id: 503, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
//     ],
//     tempestSpells: [
//       { id: 601, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//       { id: 602, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//       { id: 603, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
//     ],
//   },

//   // Patronus (Non-fungible)
//   patronus: {
//     STAG: { id: 701, uri: `${baseurl}bafkreifgviem2tgso7sww276463lmsrzjxxzhsx2vvfrkzo37htfbya2ty` },
//     PHOENIX: { id: 702, uri: `${baseurl}bafkreibe6gepb6wvijm7ljbaegl4pugwczffjjbmyalnkjwaw5pr4zudiy` },
//     OTTER: { id: 703, uri: `${baseurl}bafkreidv2b53srhsuodnwd3ihgtnko73mry6uda6gqbfrrxtptyrw3dyqe` },
//     WOLF: { id: 704, uri: `${baseurl}bafkreigok5kcnqglbwurm3svfzc5pp2cdfx5v6yq3n5wqxa4wdbotfdwly` },
//   },

//   // Professor Shards (Fungible)
//   professorShards: {
//     SNAPE_SHARD: { id: 9001, uri: `${baseurl}bafkreic7mvfvheedhg5k7j2s7rmxnouertik4bgdwq7tteaynje4ct7ul4` },
//     DUMBLEDORE_SHARD: { id: 9002, uri: `${baseurl}bafkreifvj5lhengf2pxdx3ddjhtccqwmi5lehgfufwh72e5ti24bwo7kq4` },
//     VOLDEMORT_SHARD: { id: 9003, uri: `${baseurl}bafkreicxu3vcjktmqq5pul4ytss3lbtpygee7tmki4rnskwezbvgecvkgy` },
//   },

//   // Professor SFTs (Non-fungible)
//   professors: {
//     SNAPE: { id: 9100, uri: `${baseurl}bafkreihw3k7q2xzjn7bggsmthn7owc5axsk3ujpqqaruxcpjm3mflrm3x4` },
//     DUMBLEDORE: { id: 9200, uri: `${baseurl}bafkreifnb3s6tekhzutv6ia3o34hvdcitckmpyjd3btruh4bqkkr5kt5q4` },
//     VOLDEMORT: { id: 9300, uri: `${baseurl}bafkreicpkp5jhmojjlglvvvbe3k3d2qmm5hcfezwzygkznouypaue5i65m` },
//   },
// }

// // Type for metadata
// interface ItemMetadata {
//   name: string
//   description: string
//   image: string
//   attributes?: Array<{
//     trait_type: string
//     value: string
//   }>
// }

// export default function BuyItemsPage() {
//   const { address, isConnected } = useAccount()
//   const [loading, setLoading] = useState(true)
//   const [metadataCache, setMetadataCache] = useState<Record<string, ItemMetadata>>({})
//   const [activeTab, setActiveTab] = useState("elementCards")
//   const [processingItem, setProcessingItem] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchAllMetadata = async () => {
//       setLoading(true)
//       const cache: Record<string, ItemMetadata> = {}

//       // Helper function to fetch and cache metadata for a single item
//       const fetchAndCacheItem = async (uri: string) => {
//         try {
//           if (!cache[uri]) {
//             const metadata = await fetchMetadata(uri)
//             cache[uri] = metadata
//           }
//         } catch (error) {
//           console.error(`Error fetching metadata for ${uri}:`, error)
//         }
//       }

//       // Fetch metadata for all items
//       const fetchPromises = []

//       // Element Cards
//       for (const key in gameAssets.elementCards) {
//         fetchPromises.push(fetchAndCacheItem(gameAssets.elementCards[key as keyof typeof gameAssets.elementCards].uri))
//       }

//       // Wands
//       for (const wandType in gameAssets.wands) {
//         const wandArray = gameAssets.wands[wandType as keyof typeof gameAssets.wands]
//         for (const wand of wandArray) {
//           fetchPromises.push(fetchAndCacheItem(wand.uri))
//         }
//       }

//       // Spells
//       for (const spellType in gameAssets.spells) {
//         const spellArray = gameAssets.spells[spellType as keyof typeof gameAssets.spells]
//         for (const spell of spellArray) {
//           fetchPromises.push(fetchAndCacheItem(spell.uri))
//         }
//       }

//       // Patronus
//       for (const key in gameAssets.patronus) {
//         fetchPromises.push(fetchAndCacheItem(gameAssets.patronus[key as keyof typeof gameAssets.patronus].uri))
//       }

//       // Professor Shards
//       for (const key in gameAssets.professorShards) {
//         fetchPromises.push(
//           fetchAndCacheItem(gameAssets.professorShards[key as keyof typeof gameAssets.professorShards].uri),
//         )
//       }

//       // Professors
//       for (const key in gameAssets.professors) {
//         fetchPromises.push(fetchAndCacheItem(gameAssets.professors[key as keyof typeof gameAssets.professors].uri))
//       }

//       await Promise.all(fetchPromises)
//       setMetadataCache(cache)
//       setLoading(false)
//     }

//     fetchAllMetadata()
//   }, [])

//   const fetchMetadata = async (uri: string) => {
//     try {
//       const response = await fetch(uri)
//       if (!response.ok) {
//         throw new Error("Failed to fetch metadata.")
//       }
//       return await response.json()
//     } catch (error) {
//       console.error("Error fetching metadata:", error)
//       throw new Error("Failed to fetch metadata.")
//     }
//   }

//   async function handlemintElementCard(id: number, amount: number, uri: string) {
//     try {
//       setProcessingItem(`elementCard-${id}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintElementCard",
//         args: [id, amount, uri],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Element Card #${id}`)
//     } catch (error) {
//       console.error("Error minting element card:", error)
//       alert("Failed to mint Element Card. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   async function handlemintWand(wandid: number, amount: number, uri: string) {
//     try {
//       setProcessingItem(`wand-${wandid}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintWand",
//         args: [wandid, amount, uri],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Wand #${wandid}`)
//     } catch (error) {
//       console.error("Error minting wand:", error)
//       alert("Failed to mint Wand. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   async function handlemintBasicSpell(spellid: number, elementCard: number, uri: string) {
//     try {
//       setProcessingItem(`spell-${spellid}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintBasicSpell",
//         args: [spellid, elementCard, 1, uri],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Spell #${spellid}`)
//     } catch (error) {
//       console.error("Error minting spell:", error)
//       alert("Failed to mint Spell. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   async function handlemintPatronus(id: number, uri: string) {
//     try {
//       setProcessingItem(`patronus-${id}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintPatronus",
//         args: [id, uri],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Patronus #${id}`)
//     } catch (error) {
//       console.error("Error minting patronus:", error)
//       alert("Failed to mint Patronus. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   async function handlemintProfessorShard(shardid: number, amount: number, professorid: number, uri: string) {
//     try {
//       setProcessingItem(`professorShard-${shardid}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintProfessorShard",
//         args: [shardid, amount, professorid, uri],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Professor Shard #${shardid}`)
//     } catch (error) {
//       console.error("Error minting professor shard:", error)
//       alert("Failed to mint Professor Shard. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   async function handlemintProfessor(shardid: number, professorid: number) {
//     try {
//       setProcessingItem(`professor-${professorid}`)
//       const result = await writeContract(config, {
//         abi: GameItemsABI,
//         address: GameItemsAddress,
//         functionName: "mintProfessor",
//         args: [shardid, professorid],
//       })
//       await waitForTransactionReceipt(config, { hash: result })
//       alert(`Successfully minted Professor #${professorid}`)
//     } catch (error) {
//       console.error("Error minting professor:", error)
//       alert("Failed to mint Professor. See console for details.")
//     } finally {
//       setProcessingItem(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <p className="mt-4 text-lg">Loading game assets...</p>
//       </div>
//     )
//   }

//   if (!isConnected) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh]">
//         <p className="text-lg mb-4">Please connect your wallet to purchase game items</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">Magical Items Shop</h1>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
//           <TabsTrigger value="elementCards" className="flex items-center gap-2">
//             <Fire className="h-4 w-4" />
//             <span className="hidden md:inline">Element Cards</span>
//           </TabsTrigger>
//           <TabsTrigger value="wands" className="flex items-center gap-2">
//             <Wand className="h-4 w-4" />
//             <span className="hidden md:inline">Wands</span>
//           </TabsTrigger>
//           <TabsTrigger value="spells" className="flex items-center gap-2">
//             <Sparkles className="h-4 w-4" />
//             <span className="hidden md:inline">Spells</span>
//           </TabsTrigger>
//           <TabsTrigger value="patronus" className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             <span className="hidden md:inline">Patronus</span>
//           </TabsTrigger>
//           <TabsTrigger value="professorShards" className="flex items-center gap-2">
//             <Sparkles className="h-4 w-4" />
//             <span className="hidden md:inline">Shards</span>
//           </TabsTrigger>
//           <TabsTrigger value="professors" className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             <span className="hidden md:inline">Professors</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Element Cards */}
//         <TabsContent value="elementCards">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.elementCards).map(([key, card]) => {
//               const metadata = metadataCache[card.uri]
//               return (
//                 <Card key={`element-${card.id}`} className="overflow-hidden flex flex-col">
//                   <div className="relative aspect-square overflow-hidden">
//                     {metadata?.image && (
//                       <img
//                         src={metadata.image || "/placeholder.svg"}
//                         alt={metadata.name || key}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                     <Badge className="absolute top-2 right-2 bg-amber-500">Fungible</Badge>
//                   </div>
//                   <CardHeader>
//                     <CardTitle>{metadata?.name || key}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex-grow">
//                     <p className="text-sm text-muted-foreground">{metadata?.description || "A magical element card"}</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className="w-full"
//                       onClick={() => handlemintElementCard(card.id, 1, card.uri)}
//                       disabled={processingItem === `elementCard-${card.id}`}
//                     >
//                       {processingItem === `elementCard-${card.id}` ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         "Buy"
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )
//             })}
//           </div>
//         </TabsContent>

//         {/* Wands */}
//         <TabsContent value="wands">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.wands).map(([wandType, wands]) => {
//               return wands.map((wand, index) => {
//                 const metadata = metadataCache[wand.uri]
//                 const wandTypeName = wandType.replace("Wands", "")
//                 return (
//                   <Card key={`wand-${wand.id}`} className="overflow-hidden flex flex-col">
//                     <div className="relative aspect-square overflow-hidden">
//                       {metadata?.image && (
//                         <img
//                           src={metadata.image || "/placeholder.svg"}
//                           alt={metadata.name || `${wandTypeName} Wand ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                       <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
//                       {wandType === "infernoWands" && (
//                         <Badge className="absolute top-2 left-2 bg-red-500">Inferno</Badge>
//                       )}
//                       {wandType === "frostWands" && <Badge className="absolute top-2 left-2 bg-blue-500">Frost</Badge>}
//                       {wandType === "tempestWands" && (
//                         <Badge className="absolute top-2 left-2 bg-green-500">Tempest</Badge>
//                       )}
//                     </div>
//                     <CardHeader>
//                       <CardTitle>{metadata?.name || `${wandTypeName} Wand ${index + 1}`}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex-grow">
//                       <p className="text-sm text-muted-foreground">
//                         {metadata?.description || `A powerful ${wandTypeName} wand`}
//                       </p>
//                     </CardContent>
//                     <CardFooter>
//                       <Button
//                         className="w-full"
//                         onClick={() => handlemintWand(wand.id, 1, wand.uri)}
//                         disabled={processingItem === `wand-${wand.id}`}
//                       >
//                         {processingItem === `wand-${wand.id}` ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Processing...
//                           </>
//                         ) : (
//                           "Buy"
//                         )}
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 )
//               })
//             })}
//           </div>
//         </TabsContent>

//         {/* Spells */}
//         <TabsContent value="spells">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.spells).map(([spellType, spells]) => {
//               let elementCardId = 0
//               if (spellType === "infernoSpells") elementCardId = 1001
//               else if (spellType === "glaciusSpells") elementCardId = 1002
//               else if (spellType === "tempestSpells") elementCardId = 1003

//               return spells.map((spell, index) => {
//                 const metadata = metadataCache[spell.uri]
//                 const spellTypeName = spellType.replace("Spells", "")
//                 return (
//                   <Card key={`spell-${spell.id}`} className="overflow-hidden flex flex-col">
//                     <div className="relative aspect-square overflow-hidden">
//                       {metadata?.image && (
//                         <img
//                           src={metadata.image || "/placeholder.svg"}
//                           alt={metadata.name || `${spellTypeName} Spell ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                       <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
//                       {spellType === "infernoSpells" && (
//                         <Badge className="absolute top-2 left-2 bg-red-500">Inferno</Badge>
//                       )}
//                       {spellType === "glaciusSpells" && (
//                         <Badge className="absolute top-2 left-2 bg-blue-500">Glacius</Badge>
//                       )}
//                       {spellType === "tempestSpells" && (
//                         <Badge className="absolute top-2 left-2 bg-green-500">Tempest</Badge>
//                       )}
//                     </div>
//                     <CardHeader>
//                       <CardTitle>{metadata?.name || `${spellTypeName} Spell ${index + 1}`}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex-grow">
//                       <p className="text-sm text-muted-foreground">
//                         {metadata?.description || `A powerful ${spellTypeName} spell`}
//                       </p>
//                       <p className="text-xs mt-2 text-muted-foreground">Requires corresponding element card</p>
//                     </CardContent>
//                     <CardFooter>
//                       <Button
//                         className="w-full"
//                         onClick={() => handlemintBasicSpell(spell.id, elementCardId, spell.uri)}
//                         disabled={processingItem === `spell-${spell.id}`}
//                       >
//                         {processingItem === `spell-${spell.id}` ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Processing...
//                           </>
//                         ) : (
//                           "Buy"
//                         )}
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 )
//               })
//             })}
//           </div>
//         </TabsContent>

//         {/* Patronus */}
//         <TabsContent value="patronus">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.patronus).map(([key, patronus]) => {
//               const metadata = metadataCache[patronus.uri]
//               return (
//                 <Card key={`patronus-${patronus.id}`} className="overflow-hidden flex flex-col">
//                   <div className="relative aspect-square overflow-hidden">
//                     {metadata?.image && (
//                       <img
//                         src={metadata.image || "/placeholder.svg"}
//                         alt={metadata.name || key}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                     <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
//                   </div>
//                   <CardHeader>
//                     <CardTitle>{metadata?.name || key}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex-grow">
//                     <p className="text-sm text-muted-foreground">
//                       {metadata?.description || `A magical ${key} patronus`}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className="w-full"
//                       onClick={() => handlemintPatronus(patronus.id, patronus.uri)}
//                       disabled={processingItem === `patronus-${patronus.id}`}
//                     >
//                       {processingItem === `patronus-${patronus.id}` ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         "Buy"
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )
//             })}
//           </div>
//         </TabsContent>

//         {/* Professor Shards */}
//         <TabsContent value="professorShards">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.professorShards).map(([key, shard]) => {
//               const metadata = metadataCache[shard.uri]
//               // Determine which professor this shard belongs to
//               let professorId = 0
//               if (key === "SNAPE_SHARD") professorId = 9100
//               else if (key === "DUMBLEDORE_SHARD") professorId = 9200
//               else if (key === "VOLDEMORT_SHARD") professorId = 9300

//               return (
//                 <Card key={`shard-${shard.id}`} className="overflow-hidden flex flex-col">
//                   <div className="relative aspect-square overflow-hidden">
//                     {metadata?.image && (
//                       <img
//                         src={metadata.image || "/placeholder.svg"}
//                         alt={metadata.name || key}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                     <Badge className="absolute top-2 right-2 bg-amber-500">Fungible</Badge>
//                   </div>
//                   <CardHeader>
//                     <CardTitle>{metadata?.name || key}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex-grow">
//                     <p className="text-sm text-muted-foreground">
//                       {metadata?.description || `A shard of Professor ${key.split("_")[0]}`}
//                     </p>
//                     <p className="text-xs mt-2 text-muted-foreground">Collect shards to mint a Professor</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className="w-full"
//                       onClick={() => handlemintProfessorShard(shard.id, 1, professorId, shard.uri)}
//                       disabled={processingItem === `professorShard-${shard.id}`}
//                     >
//                       {processingItem === `professorShard-${shard.id}` ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         "Buy"
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )
//             })}
//           </div>
//         </TabsContent>

//         {/* Professors */}
//         <TabsContent value="professors">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.entries(gameAssets.professors).map(([key, professor]) => {
//               const metadata = metadataCache[professor.uri]
//               // Determine which shard is needed for this professor
//               let shardId = 0
//               if (key === "SNAPE") shardId = 9001
//               else if (key === "DUMBLEDORE") shardId = 9002
//               else if (key === "VOLDEMORT") shardId = 9003

//               return (
//                 <Card key={`professor-${professor.id}`} className="overflow-hidden flex flex-col">
//                   <div className="relative aspect-square overflow-hidden">
//                     {metadata?.image && (
//                       <img
//                         src={metadata.image || "/placeholder.svg"}
//                         alt={metadata.name || key}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                     <Badge className="absolute top-2 right-2 bg-purple-500">Non-Fungible</Badge>
//                   </div>
//                   <CardHeader>
//                     <CardTitle>{metadata?.name || key}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex-grow">
//                     <p className="text-sm text-muted-foreground">{metadata?.description || `Professor ${key}`}</p>
//                     <p className="text-xs mt-2 text-muted-foreground">Requires corresponding professor shards</p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className="w-full"
//                       onClick={() => handlemintProfessor(shardId, professor.id)}
//                       disabled={processingItem === `professor-${professor.id}`}
//                     >
//                       {processingItem === `professor-${professor.id}` ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         "Buy"
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )
//             })}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }





// // "use client";

// // import { useState } from "react";
// // import { useReadContract, useWriteContract,useAccount} from "wagmi";
// // import { readContract,writeContract,waitForTransactionReceipt } from '@wagmi/core';
// // import {GameItemsAddress,GameItemsABI} from "../abi/GameItems";
// // import { config } from "../wagmi";

// // const baseurl = process.env.url as string;

// // const gameAssets = {
// //     // Element Cards (Fungible)
// //     elementCards: {
// //         INFERNO_CARD: { id: 1001, uri: `${baseurl}bafkreibsx7ei4ylmelaa3ul7wt7jwcs6j6fuydwkpf5zcicinnooekziby` },
// //         FROST_CARD: { id: 1002, uri: `${baseurl}bafkreiafo4nxgvlsa3jxkwzkhygmwlq4kugv3sk5ulddq6rvevngtz3eba` },
// //         TEMPEST_CARD: { id: 1003, uri: `${baseurl}bafkreicavagxqlqnchqdemey3imvurdjvkecjxtsf35tqzuxyo3dt3rnea` }
// //     },

// //     // Wands (Non-fungible)
// //     wands: {
// //         infernoWands: [
// //             { id: 101, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
// //             { id: 102, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` },
// //             { id: 103, uri: `${baseurl}bafkreibfeulsrbyozuoyseryzrael6yeolvlmdy2ub4hagm67ttr5f3cy4` }
// //         ],
// //         frostWands: [
// //             { id: 201, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
// //             { id: 202, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` },
// //             { id: 203, uri: `${baseurl}bafkreieji6x3gbz72iohhbc23d7a6ms2giw7rmnldatx7qhsnarawlpnoq` }
// //         ],
// //         tempestWands: [
// //             { id: 301, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy`},
// //             { id: 302, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
// //             { id: 303, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` }
// //         ]
// //     },

// //     // Spells (Non-fungible)
// //     spells: {
// //         infernoSpells: [
// //             { id: 401, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
// //             { id: 402, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` },
// //             { id: 403, uri: `${baseurl}bafkreieofhouk4crhwsgiw5loeztovssxdljud5qujtcdmbp23thy7y6yy` }
// //         ],
// //         glaciusSpells: [
// //             { id: 501, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
// //             { id: 502, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` },
// //             { id: 503, uri: `${baseurl}bafkreibw27gsd56sthzk42yef5pu432omdaosyql2duxp2zelh6ib7klym` }
// //         ],
// //         tempestSpells: [
// //             { id: 601, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
// //             { id: 602, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` },
// //             { id: 603, uri: `${baseurl}bafkreiet5y2r5knquwnspexpnnbxwspy6skwxfczbcidzufxrixjf7aqfy` }
// //         ]
// //     },

// //     // Patronus (Non-fungible)
// //     patronus: {
// //         STAG: { id: 701, uri: `${baseurl}bafkreifgviem2tgso7sww276463lmsrzjxxzhsx2vvfrkzo37htfbya2ty` },
// //         PHOENIX: { id: 702, uri: `${baseurl}bafkreibe6gepb6wvijm7ljbaegl4pugwczffjjbmyalnkjwaw5pr4zudiy` },
// //         OTTER: { id: 703, uri: `${baseurl}bafkreidv2b53srhsuodnwd3ihgtnko73mry6uda6gqbfrrxtptyrw3dyqe` },
// //         WOLF: { id: 704, uri: `${baseurl}bafkreigok5kcnqglbwurm3svfzc5pp2cdfx5v6yq3n5wqxa4wdbotfdwly` }
// //     },

// //     // Professor Shards (Fungible)
// //     professorShards: {
// //         SNAPE_SHARD: { id: 9001, uri: `${baseurl}bafkreic7mvfvheedhg5k7j2s7rmxnouertik4bgdwq7tteaynje4ct7ul4` },
// //         DUMBLEDORE_SHARD: { id: 9002, uri: `${baseurl}bafkreifvj5lhengf2pxdx3ddjhtccqwmi5lehgfufwh72e5ti24bwo7kq4` },
// //         VOLDEMORT_SHARD: { id: 9003, uri: `${baseurl}bafkreicxu3vcjktmqq5pul4ytss3lbtpygee7tmki4rnskwezbvgecvkgy` }
// //     },

// //     // Professor SFTs (Non-fungible)
// //     professors: {
// //         SNAPE: { id: 9100, uri: `${baseurl}bafkreihw3k7q2xzjn7bggsmthn7owc5axsk3ujpqqaruxcpjm3mflrm3x4` },
// //         DUMBLEDORE: { id: 9200, uri: `${baseurl}bafkreifnb3s6tekhzutv6ia3o34hvdcitckmpyjd3btruh4bqkkr5kt5q4` },
// //         VOLDEMORT: { id: 9300, uri:`${baseurl}bafkreicpkp5jhmojjlglvvvbe3k3d2qmm5hcfezwzygkznouypaue5i65m` }
// //     }
// // };




// // export default function BuyItemsPage() {
// //     const { address,isConnected } = useAccount()

// //     async function handlemintBasicSpell(spellid:any,elementCard:any,uri:string) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintBasicSpell',
// //             args: [
// //               spellid,
// //               elementCard,
// //               1,
// //               uri
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }

// //     async function handlemintElementCard(id:any,amount:any,uri:string) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintElementCard',
// //             args: [
// //               id,
// //               amount,
// //               uri
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }

// //     async function handlemintPatronus(id:any,uri:string) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintPatronus',
// //             args: [
// //               id,
// //               uri
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }

// //     async function handlemintProfessor(shardid:any,professorid:any) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintProfessor',
// //             args: [
// //               shardid,
// //               professorid
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }

// //     async function handlemintProfessorShard(shardid:any,amount:any,professorid:any,uri:string) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintProfessorShard',
// //             args: [
// //               shardid,
// //               amount,
// //               professorid,
// //               uri
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }

// //     async function handlemintWand(wandid:any,amount:any,uri:string) {
// //         const result = await writeContract(config, {
// //             abi:GameItemsABI,
// //             address: GameItemsAddress,
// //             functionName: 'mintWand',
// //             args: [
// //               wandid,
// //               amount,
// //               uri
// //             ],
// //         })
// //         const receipt = await waitForTransactionReceipt(config,{hash:result});
// //     }
// //     const fetchMetadata = async (uri: string) => {
// //         try {
// //           const pinataBaseURL = uri;
    
// //           const response = await fetch(pinataBaseURL);
    
// //           if (!response.ok) {
// //             throw new Error("Failed to fetch metadata.");
// //           }
// //           return await response.json();
// //         } catch (error) {
// //           console.error("Error fetching metadata:", error);
// //           throw new Error("Failed to fetch metadata.");
// //         }
// //       };
    
        




    
    
// // }