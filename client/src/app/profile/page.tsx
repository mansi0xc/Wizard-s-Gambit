"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarAbi, AvatarAddress } from "@/app/abi/final/Avatar"
import { useAccount } from "wagmi"
import { useWriteContract } from "wagmi"
import { waitForTransactionReceipt, readContract } from "@wagmi/core"
import { config } from "../wagmi"
import axios from "axios"

type NFTMetadata = {
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
  house: string
  quizResults: any // Replace with your quiz results type
}

export default function WizardryQuiz() {
  const { isConnected, address } = useAccount()
  const [question, setQuestion] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")
  const [result, setResult] = useState<{ house: string; description: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [errorapi, setErrorapi] = useState<string | null>(null)
  const [nftBalance, setNftBalance] = useState<number>(0)
  const [tokenURI, setTokenURI] = useState<string>("")
  const [checkingWallet, setCheckingWallet] = useState<boolean>(true)

  // Move the hook to the component level
  const { writeContractAsync, isPending } = useWriteContract()

  useEffect(() => {
    console.log("Component mounted, checking wallet and NFTs")
    console.log("Wallet connected:", isConnected)
    console.log("Wallet address:", address)
    checkWalletAndNFTs()
  }, [isConnected, address]) // Add dependencies to re-run when connection changes

  const fetchTokenURI = async () => {
    try {
      console.log("Fetching token URI for address:", address)

      if (!address) {
        console.log("No address available")
        return ""
      }

      const data = await readContract(config, {
        address: AvatarAddress,
        abi: AvatarAbi,
        functionName: "getAvatar",
        args: [address],
      })

      console.log("Raw data from getAvatar:", data)

      if (!data) return "" // Handle case where data is undefined

      // Destructure the returned tuple
      const [tokenId, tokenURI] = data as [bigint, string]

      console.log("Token ID:", tokenId)
      console.log("Token URI:", tokenURI)

      return tokenURI || ""
    } catch (error) {
      console.error("Error in fetchTokenURI:", error)
      return ""
    }
  }

  const checkWalletAndNFTs = async () => {
    setCheckingWallet(true)
    try {
      if (!isConnected || !address) {
        console.log("Wallet not connected")
        setErrorapi("Please connect your wallet first")
        fetchQuestion() // Still fetch question if wallet not connected
        return
      }

      console.log("Checking NFTs for address:", address)

      // Use readContract directly instead of useReadContract hook
      const rawBalance = await readContract(config, {
        address: AvatarAddress,
        abi: AvatarAbi,
        functionName: "balanceOf",
        args: [address],
      })

      console.log("NFT balance raw data:", rawBalance)

      // Convert bigint to number safely
      const balance = rawBalance ? Number(rawBalance) : 0
      setNftBalance(balance)
      console.log("NFT balance:", balance)

      if (balance > 0) {
        // If user has NFTs, fetch the token URI
        try {
          const tokenData = await readContract(config, {
            address: AvatarAddress,
            abi: AvatarAbi,
            functionName: "getAvatar",
            args: [address],
          })

          console.log("Token data:", tokenData)

          if (tokenData) {
            // Assuming tokenData is [tokenId, uri]
            const uri = Array.isArray(tokenData) ? tokenData[1] : ""
            console.log("Token URI:", uri)
            setTokenURI(uri)
          }
        } catch (error) {
          console.error("Error fetching token URI:", error)
        }
      } else {
        // If user doesn't have NFTs, fetch the question
        console.log("No NFTs found, fetching question")
        fetchQuestion()
      }
    } catch (err) {
      console.error("Error checking wallet and NFTs:", err)
      setErrorapi("Failed to check wallet or NFTs. Please try again.")
      fetchQuestion() // Fetch question anyway to allow user to proceed
    } finally {
      setCheckingWallet(false)
    }
  }

  const fetchQuestion = async () => {
    setLoading(true)
    setErrorapi(null)
    try {
      const response = await fetch("/api/gemini/start-chat", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch question")
      }

      const data = await response.json()
      setQuestion(data.question)
    } catch (err) {
      setErrorapi("Failed to load question. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!answer.trim()) {
      console.log("Empty answer, not submitting")
      return
    }

    setSubmitting(true)
    setErrorapi(null)
    console.log("Submitting answer:", answer)

    try {
      console.log("Sending request to /api/gemini/submit-answer")
      const response = await fetch("/api/gemini/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error:", response.status, errorText)
        throw new Error(`Failed to submit answer: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log("Received house result:", data)
      setResult(data)

      // After getting the result, mint an NFT for the user
      console.log("Checking conditions for minting NFT:")
      console.log("- House:", data.house ? data.house : "MISSING")
      console.log("- Wallet connected:", isConnected ? "YES" : "NO")
      console.log("- Wallet address:", address ? address : "MISSING")

      if (data.house && isConnected && address) {
        console.log("Attempting to mint NFT for house:", data.house)
        try {
          const mintResult = await mintNFT(address, data.house, data)
          console.log("Mint result:", mintResult)

          if (mintResult) {
            console.log("NFT minted successfully")
          } else {
            console.log("NFT minting failed")
            setErrorapi("NFT minting failed. Please try again.")
          }
        } catch (error) {
          console.error("Error during NFT minting:", error)
          setErrorapi("Error during NFT minting. Please try again.")
        }
      } else {
        console.log("Not minting NFT - missing required conditions")
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      setErrorapi("Failed to analyze your answer. Please try again.")
    } finally {
      setSubmitting(false)
      console.log("Submission process completed")
    }
  }

  // Now mintNFT uses the writeContractAsync from the hook above
  const mintNFT = async (address: string, house: string, quizResults: any): Promise<boolean> => {
    try {
      console.log("Starting NFT minting process for house:", house)

      if (!address || address === "0x...") {
        console.error("Invalid wallet address")
        return false
      }

      // 1. Prepare metadata
      const metadata: NFTMetadata = {
        name: `Argyle Finch`,
        description: `A unique avatar representing your membership in ${house} House`,
        image: "ipfs://bafkreidvkht6oiwek3qd2b7e343mcuoerr3v4dpbfczl3mz7iszwt5nxga",
        attributes: [
          {
            trait_type: "House",
            value: house,
          },
        ],
        house,
        quizResults,
      }
      const pinataResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            metadata,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
              }
            }
          );
      
          const tokenURI = `ipfs://${pinataResponse.data.IpfsHash}`;
          console.log('Token URI:', tokenURI);

      // console.log("Prepared metadata:", metadata)

      // // 2. Upload to IPFS (in a real app)
      // console.log("Would upload to IPFS here with Pinata")
      // // Mock the IPFS response for testing
      // const tokenURI = `ipfs://QmMockHash${Date.now()}`
      // console.log("Token URI:", tokenURI)

      // 3. Mint NFT
      console.log("Calling mintAvatar with URI:", tokenURI)

      if (!writeContractAsync) {
        console.error("writeContractAsync not available")
        return false
      }

      const hash = await writeContractAsync({
        abi: AvatarAbi,
        address: AvatarAddress,
        functionName: "mintAvatar",
        args: [tokenURI],
      })

      console.log("Transaction hash:", hash)

      // 4. Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, { hash })
      console.log("Transaction receipt:", receipt)

      if (receipt.status === "success") {
        console.log(`Successfully minted ${house} House Avatar NFT`)
        return true
      } else {
        console.error("Transaction failed")
        return false
      }
    } catch (error) {
      console.error("Minting error:", error)
      return false
    }
  }

  const handleReset = () => {
    setQuestion("")
    setAnswer("")
    setResult(null)
    fetchQuestion()
  }

  const getHouseColor = (house: string) => {
    switch (house.toLowerCase()) {
      case "gryffindor":
        return "bg-red-600"
      case "slytherin":
        return "bg-green-600"
      case "ravenclaw":
        return "bg-blue-600"
      case "hufflepuff":
        return "bg-yellow-600"
      default:
        return "bg-purple-600"
    }
  }

  if (checkingWallet) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <h1 className="text-2xl font-bold">Checking your magical credentials...</h1>
          <div className="animate-pulse">
            <Skeleton className="h-12 w-48 bg-gray-700 mx-auto rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-200/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl text-center text-white font-bold mb-2">Magical House Sorting</h1>
          <p className="text-center text-gray-300 mb-6">Answer the magical question to discover your house</p>

          {nftBalance > 0 ? (
            <div className="text-center text-white space-y-4">
              <p>You already have a house assignment!</p>
              {/* Display the NFT or token URI information here */}
              <p>{tokenURI}</p>
            </div>
          ) : loading ? (
            <div className="space-y-4 text-center text-white">
              <div className="animate-pulse">
                <Skeleton className="h-4 w-full bg-gray-700 rounded" />
                <Skeleton className="h-4 w-3/4 bg-gray-700 rounded mt-2" />
                <Skeleton className="h-4 w-5/6 bg-gray-700 rounded mt-2" />
              </div>
              <p className="text-gray-300 mt-4">The magical quill is preparing your question...</p>
            </div>
          ) : errorapi ? (
            <div className="text-red-500 text-center p-4">{errorapi}</div>
          ) : submitting ? (
            <div className="text-center text-white space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-white rounded-full mx-auto"></div>
              <p className="text-xl">The Sorting Hat is determining your house...</p>
              <p className="text-gray-300">
                "Hmm, difficult. Very difficult. Plenty of courage, I see. Not a bad mind either..."
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className={`${getHouseColor(result.house)} text-white px-8 py-3 rounded-md text-xl font-bold`}>
                  {result.house}
                </div>
              </div>
              <p className="text-white text-center px-4">{result.description}</p>
              <Button
                onClick={handleReset}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-800/50 p-5 rounded-lg">
                <p className="font-medium text-white">{question}</p>
              </div>
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                className="w-full bg-gray-800/30 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={loading || submitting || !answer.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
              >
                Submit Answer
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function (same as before)
const getHouseImageUrl = (house: string): string => {
  const houseImages = {
    gryffindor: "ipfs://Qm...",
    slytherin: "ipfs://Qm...",
    hufflepuff: "ipfs://Qm...",
    ravenclaw: "ipfs://Qm...",
  }
  return houseImages[house.toLowerCase()] || ""
}
