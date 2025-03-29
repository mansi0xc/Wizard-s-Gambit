"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ConnectionDialog({
  open,
  onOpenChange,
  onConnect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (ip: string) => void
}) {
  const [ip, setIp] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Server</DialogTitle>
          <DialogDescription>
            Enter the IP address of the server running on your local network
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              Server IP
            </Label>
            <Input
              id="ip"
              placeholder="192.168.x.x"
              className="col-span-3"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={() => {
              onConnect(ip)
              onOpenChange(false)
            }}
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}