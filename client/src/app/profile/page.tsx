"use client";
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { abi, contract_address } from '@/abi/player';
import { useState } from 'react';
import Image from "next/image";
import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [avatarURI, setAvatarURI] = useState("");
  const [newAvatarURI, setNewAvatarURI] = useState("");

  // Read player's avatar
  const { data: avatar, isLoading, refetch } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getAvatar',
    args: [address!],
    query: { enabled: !!address }
  });

  const [tokenId, tokenURI] = avatar || [0, ""];

  // Mint new avatar
  const handleMint = async () => {
    if (!avatarURI) {
      toast.error("Please enter an avatar URI");
      return;
    }
    
    writeContract({
      address: contract_address,
      abi,
      functionName: 'mintAvatar',
      args: [avatarURI],
      onSuccess: () => {
        toast.success("Avatar minted successfully!");
        refetch();
        setAvatarURI("");
      },
      onError: (error) => {
        toast.error(`Minting failed: ${error.message}`);
      }
    });
  };

  // Update existing avatar
  const handleUpdate = async () => {
    if (!newAvatarURI) {
      toast.error("Please enter a new avatar URI");
      return;
    }

    writeContract({
      address: contract_address,
      abi,
      functionName: 'updateAvatar',
      args: [newAvatarURI],
      onSuccess: () => {
        toast.success("Avatar updated successfully!");
        refetch();
        setNewAvatarURI("");
      },
      onError: (error) => {
        toast.error(`Update failed: ${error.message}`);
      }
    });
  };

  if (!isConnected) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 text-center p-8">
      <h2 className="text-3xl mb-4">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-8">Please connect your wallet to view or create your avatar</p>
      <w3m-button />
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
      </div>
    </div>
  );

  if (!tokenId) return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 text-center p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl mb-4">Create Your Avatar</h2>
        <div className="space-y-4 mb-8">
          <Input
            placeholder="IPFS URI for avatar metadata"
            value={avatarURI}
            onChange={(e) => setAvatarURI(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={handleMint}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <WandSparkles className="h-4 w-4 mr-2" />
                Mint Avatar
              </>
            )}
          </Button>
        </div>
        <p className="text-gray-400 text-sm">
          Cost: 100 $RUNE (initial tokens will be allocated)
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Your Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-square w-64 mx-auto rounded-lg overflow-hidden border-2 border-purple-500">
              {tokenURI ? (
                <Image
                  src={tokenURI}
                  alt="Player Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                  <WandSparkles className="h-12 w-12 text-purple-500" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Input
                placeholder="New IPFS URI for avatar metadata"
                value={newAvatarURI}
                onChange={(e) => setNewAvatarURI(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={handleUpdate}
                disabled={isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Avatar"
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400">Token ID</p>
                <p className="font-mono">{tokenId.toString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400">Metadata URI</p>
                <p className="font-mono truncate">{tokenURI}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}