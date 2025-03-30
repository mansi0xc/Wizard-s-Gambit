"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { writeContract, waitForTransactionReceipt, readContract } from "@wagmi/core"
import { PlayerAvatarAbi, PlayerAvatarAddress } from "../abi/PlayerAvatarAbi"
import { config } from "../wagmi"
import { Loader2, Wand, Shield, Book, Leaf } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Pinata IPFS gateway URL
const baseUrl = "https://scarlet-urgent-pig-985.mypinata.cloud/ipfs/"

// House metadata and URIs
const houseData = {
  gryffindor: {
    name: "Gryffindor",
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
    icon: Shield,
    // CIDs for house images on IPFS
    imageCid: "QmNTESVhTmFqV3qSECGNXYbFVGvnJfGw3TDNEcmBmzxVRT",
    description: "Brave, daring, and chivalrous. Gryffindors are known for their courage and determination.",
  },
  slytherin: {
    name: "Slytherin",
    color: "bg-green-600",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    icon: Wand,
    imageCid: "QmTH7dZ6KMvKA4Bxd3Trkj5Gj993YVgFbYA7MFpLyHwbxP",
    description: "Ambitious, cunning, and resourceful. Slytherins are determined to achieve their goals.",
  },
  ravenclaw: {
    name: "Ravenclaw",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
    icon: Book,
    imageCid: "QmWZQJZdj8QA7uQmE2tZgvYNfZBdcgRUaB3aTzQ1mEBJFk",
    description: "Intelligent, wise, and creative. Ravenclaws value knowledge and learning above all.",
  },
  hufflepuff: {
    name: "Hufflepuff",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    icon: Leaf,
    imageCid: "QmXZxeB4zyaKCQukzcKbX1Kw42LDcAix2yQYcGJyQYmRNT",
    description: "Loyal, patient, and hardworking. Hufflepuffs value fairness and inclusivity.",
  },
}

// Sample metadata CIDs for each house
const houseMetadataCids = {
  gryffindor: "QmcK5jxYsVGvzWQvJ8uJJCN7QHsRs5kPzLQu7x4WUxsv3S",
  slytherin: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
  ravenclaw: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  hufflepuff: "QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V",
}

export default function Profile() {
  const [processingItem, setProcessingItem] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const [nftBalance, setNftBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [userNft, setUserNft] = useState<any>(null)
  const [onboardingStep, setOnboardingStep] = useState<number>(0)
  const [question, setQuestion] = useState<string>("")
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [houseResult, setHouseResult] = useState<{ house: string; description: string } | null>(null)
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false)

  // Display house images for debugging
  const [showHouseImages, setShowHouseImages] = useState<boolean>(false)

  // Check if user has an NFT
  useEffect(() => {
    const checkNftBalance = async () => {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const balance = await readContract(config, {
          abi: PlayerAvatarAbi,
          address: PlayerAvatarAddress,
          functionName: "balanceOf",
          args: [address],
        })

        setNftBalance(Number(balance))

        // If user has an NFT, fetch it
        if (Number(balance) > 0) {
          const tokenId = await readContract(config, {
            abi: PlayerAvatarAbi,
            address: PlayerAvatarAddress,
            functionName: "getAvatarIdForUser",
            args: [address],
          })
          console.log("tokenId:", tokenId)

          const tokenUri = await readContract(config, {
            abi: PlayerAvatarAbi,
            address: PlayerAvatarAddress,
            functionName: "tokenURI",
            args: [tokenId],
          })
          console.log("tokenUri:", tokenUri)

          // Fetch metadata from IPFS
          // If the URI is an IPFS URI, convert it to use the Pinata gateway
          const metadataUrl = tokenUri.startsWith("ipfs://") ? tokenUri.replace("ipfs://", baseUrl) : tokenUri

          const response = await fetch(metadataUrl)
          const metadata = await response.json()

          setUserNft({
            id: tokenId,
            uri: tokenUri,
            metadata,
          })
        } else {
          // Start onboarding process
          startOnboarding()
        }
      } catch (error) {
        console.error("Error checking NFT balance:", error)
      } finally {
        setLoading(false)
      }
    }

    checkNftBalance()
  }, [address, isConnected])

  // Start onboarding process
  const startOnboarding = async () => {
    setOnboardingStep(1)
    try {
      // Fetch initial question from Gemini
      const response = await fetch("/api/gemini/start-chat", {
        method: "POST",
      })

      const data = await response.json()
      setQuestion(data.question)
    } catch (error) {
      console.error("Error starting onboarding:", error)
      setQuestion(
        "If you could possess any magical artifact from the Harry Potter universe (besides a wand), which would you choose and why?",
      )
    }
  }

  // Submit user's answer to Gemini
  const submitAnswer = async () => {
    if (!userAnswer.trim()) return

    setSubmittingAnswer(true)
    try {
      const response = await fetch("/api/gemini/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: userAnswer }),
      })

      const data = await response.json()
      setHouseResult(data)
      setOnboardingStep(2)
    } catch (error) {
      console.error("Error submitting answer:", error)
      // Fallback in case API fails
      setHouseResult({
        house: "Gryffindor",
        description: "You show courage and determination in your choices. A true Gryffindor at heart!",
      })
      setOnboardingStep(2)
    } finally {
      setSubmittingAnswer(false)
    }
  }

  // Create NFT metadata JSON
  const createNftMetadata = (house: string, description: string) => {
    const houseKey = house.toLowerCase() as keyof typeof houseData
    const houseInfo = houseData[houseKey]

    // Create the metadata object
    return {
      name: `${house} Wizard`,
      description: description,
      image: "https://scarlet-urgent-pig-985.mypinata.cloud/ipfs/bafkreihzbsiqff5i25fnkioe3j7nb7a5w75nodbfujrcucz6r77crekq5u",
      attributes: [
        {
          trait_type: "House",
          value: house,
        },
        {
          trait_type: "Personality",
          value: houseInfo.description.split(".")[0],
        },
      ],
    }
  }

//   API Key: 3c9b25b0ab12d3919eb2
// API Secret: 20293988e0bfb30d554bc455a02d20a41035b4b8dfeebe4f119e4c0241ecaa55
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MjBmNGYxZi0zMDZiLTRhZjktYThhOC05ZTgxM2E3MzA0NTYiLCJlbWFpbCI6InN0dWR5MW5nYWNjMHVudDAwN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2M5YjI1YjBhYjEyZDM5MTllYjIiLCJzY29wZWRLZXlTZWNyZXQiOiIyMDI5Mzk4OGUwYmZiMzBkNTU0YmM0NTVhMDJkMjBhNDEwMzViNGI4ZGZlZWJlNGYxMTllNGMwMjQxZWNhYTU1IiwiZXhwIjoxNzc0ODUwNDE4fQ.CL6bj71z0yhjIKdOtmMQyRDzova6TYs7RLNsQVmMNxE
  const uploadToPinata = async (metadata: object) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const pinataApiKey = "3c9b25b0ab12d3919eb2";
    const pinataSecretApiKey = "20293988e0bfb30d554bc455a02d20a41035b4b8dfeebe4f119e4c0241ecaa55";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            },
            body: JSON.stringify(metadata)
        });
        const data = await response.json();
        consoloe.log("Pinata response:", data);
        return `https://scarlet-urgent-pig-985.mypinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        return null;
    }
};


  // Mint NFT based on house result
  const mintHouseNft = async () => {
    if (!houseResult) return

    setProcessingItem("minting")
    try {
      const house = houseResult.house.toLowerCase() as keyof typeof houseData
      const houseInfo = houseData[house]

      // In a real implementation, you would:
      // 1. Create the metadata JSON
      const metadata = createNftMetadata(houseResult.house, houseResult.description)
      const metadataUri = await uploadToPinata(metadata)  

      console.log("NFT Metadata:", metadata)

      // 4. Mint the NFT with the metadata URI
      const result = await writeContract(config, {
        abi: PlayerAvatarAbi,
        address: PlayerAvatarAddress,
        functionName: "mintAvatar",
        args: [metadataUri],
      })

      await waitForTransactionReceipt(config, { hash: result })
      alert(`Successfully minted your ${houseResult.house} avatar!`)

      // Refresh page to show the new NFT
      window.location.reload()
    } catch (error) {
      console.error("Error minting avatar:", error)
      alert("Failed to mint avatar. See console for details.")
    } finally {
      setProcessingItem(null)
    }
  }

  // Toggle house images display
  const toggleHouseImages = () => {
    setShowHouseImages(!showHouseImages)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Wizard Profile</h1>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-lg mb-4">Please connect your wallet to view your wizard profile</p>
            <Wand className="w-16 h-16 mx-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Wizard Profile</h1>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading your wizard profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Onboarding process
  if (nftBalance === 0) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Wizard Onboarding</h1>

        {/* Debug button to show house images */}
        <div className="flex justify-center mb-4">
          <Button variant="outline" size="sm" onClick={toggleHouseImages}>
            {showHouseImages ? "Hide House Images" : "Show House Images"}
          </Button>
        </div>

        {/* House images display for debugging */}
        {showHouseImages && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {Object.entries(houseData).map(([key, house]) => (
              <Card key={key} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={`${baseUrl}${house.imageCid}`}
                    alt={house.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className={`font-bold ${house.textColor}`}>{house.name}</h3>
                  <p className="text-xs mt-1 text-muted-foreground">CID: {house.imageCid}</p>
                  <p className="text-xs mt-1">
                    Metadata CID: {houseMetadataCids[key as keyof typeof houseMetadataCids]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {onboardingStep === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand className="h-6 w-6 text-primary" />
                Sorting Hat Ceremony
              </CardTitle>
              <CardDescription>Answer the question below to determine your Hogwarts house</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-lg">{question}</p>
              </div>
              <Textarea
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={submitAnswer} disabled={!userAnswer.trim() || submittingAnswer}>
                {submittingAnswer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your answer...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {onboardingStep === 2 && houseResult && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand className="h-6 w-6 text-primary" />
                Your Hogwarts House
              </CardTitle>
              <CardDescription>The Sorting Hat has made its decision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {houseResult.house && houseData[houseResult.house.toLowerCase() as keyof typeof houseData] && (
                <div className="flex flex-col items-center">
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center ${houseData[houseResult.house.toLowerCase() as keyof typeof houseData].color}`}
                  >
                    {React.createElement(houseData[houseResult.house.toLowerCase() as keyof typeof houseData].icon, {
                      className: "w-16 h-16 text-white",
                    })}
                  </div>
                  <h2
                    className={`text-2xl font-bold mt-4 ${houseData[houseResult.house.toLowerCase() as keyof typeof houseData].textColor}`}
                  >
                    {houseResult.house}
                  </h2>

                  {/* Display the house image from IPFS */}
                  <div className="mt-4 aspect-square w-48 h-48 overflow-hidden rounded-md border">
                    <img
                      src={`${baseUrl}${houseData[houseResult.house.toLowerCase() as keyof typeof houseData].imageCid}`}
                      alt={houseResult.house}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-md">
                <p className="text-lg">{houseResult.description}</p>
              </div>

              {/* Display metadata preview */}
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">NFT Metadata Preview:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(createNftMetadata(houseResult.house, houseResult.description), null, 2)}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={mintHouseNft} disabled={processingItem === "minting"}>
                {processingItem === "minting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting your wizard avatar...
                  </>
                ) : (
                  "Mint Your Wizard Avatar"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    )
  }

  // Display existing NFT
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Wizard Profile</h1>

      {userNft && (
        <Card className="max-w-2xl mx-auto">
          <div className="aspect-square relative overflow-hidden">
            {userNft.metadata?.image && (
              <img
                src={userNft.metadata.image.replace("ipfs://", baseUrl) || "/placeholder.svg"}
                alt={userNft.metadata.name || "Wizard Avatar"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                }}
              />
            )}
          </div>
          <CardHeader>
            <CardTitle>{userNft.metadata?.name || "Wizard Avatar"}</CardTitle>
            <CardDescription>{userNft.metadata?.description || "Your magical avatar"}</CardDescription>
          </CardHeader>
          <CardContent>
            {userNft.metadata?.attributes && (
              <div className="flex flex-wrap gap-2">
                {userNft.metadata.attributes.map((attr: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">NFT Metadata:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(userNft.metadata, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
