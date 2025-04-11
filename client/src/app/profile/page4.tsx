"use client"

import type React from "react"
import axios from 'axios';


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {AvatarAbi,AvatarAddress} from "@/app/abi/final/Avatar"
import { useAccount } from "wagmi"
import { useReadContract,useWriteContract } from "wagmi"
import { writeContract, waitForTransactionReceipt, readContract } from "@wagmi/core"
import { config } from "../wagmi";

type NFTMetadata = {
	name: string;
	description: string;
	image: string;
	attributes: {
	  trait_type: string;
	  value: string;
	}[];
	house: string;
	quizResults: any; // Replace with your quiz results type
  };

// Smart contract integration placeholder functions

const mintNFT = async (address: string, house: string): Promise<boolean> => {
  // TODO: Implement this function to mint an NFT for the user based on their house
  // This should connect to the blockchain and call mint on your smart contract
  console.log("Minting NFT for house:", house)
  return true // Placeholder return value
}

export default function WizardryQuiz() {

  const { isConnected, address } = useAccount()
  const [question, setQuestion] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")
  const [result, setResult] = useState<{ house: string; description: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [errorapi, setErrorapi] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [nftBalance, setNftBalance] = useState<number>(0)
  const [tokenURI, setTokenURI] = useState<string>("")
  const [checkingWallet, setCheckingWallet] = useState<boolean>(true)

  useEffect(() => {
    // Check if user has wallet connected and NFTs
    checkWalletAndNFTs()
  }, [])

	// const {
	//   data,
	//   isLoading,
	//   error,
	//   refetch,
	// } = useReadContract({
	//   address: AvatarAddress,
	//   abi: AvatarAbi,
	//   functionName: 'balanceOf',
	//   args: [address],
	// })
  
	// const formatBalance = (rawBalance: bigint | undefined) => {
	//   if (!rawBalance) return '0'
	//   const balanceInEther = Number(rawBalance) / 1e18
	//   return balanceInEther.toFixed(4) // Display 4 decimal places
	// }

//   const checkWalletAndNFTs = async () => {
//     setCheckingWallet(true)
//     try {
//       // Placeholder for getting the user's wallet address
//       // In a real implementation, you would use a library like ethers.js or web3.js
//       const address = "0x..." // This should be dynamically set based on the connected wallet
//       setWalletAddress(address)

//       // Check NFT balance
//       const balance = await checkNFTBalance(address)
//       setNftBalance(balance)

//       if (balance > 0) {
//         // If user has NFTs, fetch the token URI
//         const uri = await fetchTokenURI(address, 0) // Assuming we're checking the first token
//         setTokenURI(uri)
//       } else {
//         // If user doesn't have NFTs, fetch the question
//         fetchQuestion()
//       }
//     } catch (err) {
//       setErrorapi("Failed to check wallet or NFTs. Please try again.")
//       console.error(err)
//     } finally {
//       setCheckingWallet(false)
//     }
//   }


type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  house: string;
  quizResults: any;
};

const mintNFT = async (address: string, house: string, quizResults: any): Promise<boolean> => {
  try {
    // 1. Prepare metadata
    const metadata: NFTMetadata = {
      name: `${house} House Avatar`,
      description: `A unique avatar representing your membership in ${house} House`,
      image: getHouseImageUrl(house),
      attributes: [{
        trait_type: "House",
        value: house
      }],
      house,
      quizResults
    };

    // 2. Upload to IPFS
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

    // 3. Mint NFT
    const hash = await writeContract(config, {
      abi: AvatarAbi,
      address: AvatarAddress,
      functionName: 'mintAvatar',
      args: [tokenURI],
      account: address as `0x${string}`
    });

    // 4. Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(config, { hash });
    
    if (receipt.status === 'success') {
      console.log(`Successfully minted ${house} House Avatar NFT`);
      return true;
    } else {
      console.error('Transaction failed');
      return false;
    }

  } catch (error) {
    console.error('Minting error:', error);
    return false;
  }
};

// Helper function (same as before)
const getHouseImageUrl = (house: string): string => {
  const houseImages = {
    gryffindor: 'ipfs://Qm...',
    slytherin: 'ipfs://Qm...',
    hufflepuff: 'ipfs://Qm...',
    ravenclaw: 'ipfs://Qm...'
  };
  return houseImages[house.toLowerCase()] || '';
};
  

const fetchTokenURI = async () => {
	const {data}= await useReadContract({
		address: AvatarAddress,
		abi:AvatarAbi,
		functionName:"getAvatar",
		args:[address]
	})

	console.log("Raw data from getAvatar:", data);

	if (!data) return ""; // Handle case where data is undefined
  
	// Destructure the returned tuple
	const [tokenId, tokenURI] = data as [bigint, string];
  
	console.log("Token ID:", tokenId);
	console.log("Token URI:", tokenURI);
  
	return tokenURI || "";

}


const checkWalletAndNFTs = async () => {
  setCheckingWallet(true);
  try {
    // Placeholder for getting the user's wallet address
    // In a real implementation, you would use a library like ethers.js or web3.js
    const address = "0x..."; // This should be dynamically set based on the connected wallet
    setWalletAddress(address);

    // Check NFT balance using the hook-like logic
    const { data: rawBalance, error } = await useReadContract({
      address: AvatarAddress,
      abi: AvatarAbi,
      functionName: 'balanceOf',
      args: [address],
    });

    if (error) {
      throw new Error(error.message);
    }

    const formatBalance = (rawBalance: bigint | undefined) => {
      if (!rawBalance) return 0; // Return 0 instead of '0' to match your number comparison below
      const balanceInEther = Number(rawBalance) / 1e18;
      return parseFloat(balanceInEther.toFixed(4)); // Convert back to number
    };

    const balance = formatBalance(rawBalance as any);
    setNftBalance(balance);

    if (balance > 0) {
      // If user has NFTs, fetch the token URI
      const uri = await fetchTokenURI(); // Assuming we're checking the first token
      setTokenURI(uri);
    } else {
      // If user doesn't have NFTs, fetch the question
      fetchQuestion();
    }
  } catch (err) {
    setErrorapi("Failed to check wallet or NFTs. Please try again.");
    console.error(err);
  } finally {
    setCheckingWallet(false);
  }
};

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
      return
    }

    setSubmitting(true)
    setErrorapi(null)

    try {
      const response = await fetch("/api/gemini/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }

      const data = await response.json()
      setResult(data)

      // After getting the result, mint an NFT for the user
      if (data.house) {
        await mintNFT(walletAddress, data.house,data)
      }
    } catch (err) {
      setErrorapi("Failed to analyze your answer. Please try again.")
      console.error(err)
    } finally {
      setSubmitting(false)
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
          <h1 className="text-2xl text-center text-white font-bold mb-2">Hogwarts House Sorting</h1>
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


