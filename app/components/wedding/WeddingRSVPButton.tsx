"use client";

import { MailIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/app/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"
import { useInvitationStore } from "@/stores/useInvitationStore"

export const WeddingRSVPButton = () => {
    const invitation = useInvitationStore((state) => state.invitation);
    
    // Parse party members from comma-separated string
    const partyMembers = invitation?.partyMembers 
        ? invitation.partyMembers.split(',').map(name => name.trim()).filter(Boolean)
        : [];

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
                <HugeiconsIcon
                icon={MailIcon}
                strokeWidth={2}
                data-icon="inline-start"
                />
                RSVP Now
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>RSVP Information</AlertDialogTitle>
            <div className="space-y-4 text-left">
                <AlertDialogDescription className="text-sm">
                We&apos;re so excited to celebrate with you! Please let us know if you&apos;ll be attending by November 1st, 2026.
                </AlertDialogDescription>
                
                {invitation && (
                    <div className="space-y-2">
                        <p className="font-semibold">Your Invitation Details:</p>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">Party:</span> {invitation.displayName}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Party Size:</span> {invitation.partySize}
                            </p>
                            {partyMembers.length > 0 && (
                                <div className="text-sm">
                                    <span className="font-medium">Guests:</span>
                                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                                        {partyMembers.map((member, index) => (
                                            <li key={index}>{member}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="space-y-2">
                    <p className="font-semibold">How to RSVP:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Email us at: <a href="mailto:wedding@example.com" className="text-primary hover:underline">wedding@example.com</a></li>
                        <li>Call or text: <a href="tel:+1234567890" className="text-primary hover:underline">(123) 456-7890</a></li>
                        <li>Or fill out the RSVP card included with your invitation</li>
                    </ul>
                </div>
                
                <p className="text-sm text-muted-foreground">
                    Please let us know of any dietary restrictions or special accommodations needed.
                </p>
            </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}