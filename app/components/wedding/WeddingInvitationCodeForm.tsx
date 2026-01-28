"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

export function WeddingInvitationCodeForm() {
  const [invitationCode, setInvitationCode] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (invitationCode.trim()) {
      router.push(`/rsvp/${invitationCode.trim()}`)
    }
  }

  return (

        <form onSubmit={handleSubmit} className="p-4">
          <Input
            id="invitationCode"
            type="text"
            placeholder="Enter your code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-1">
            Submit
          </Button>
        </form>

  )
}
