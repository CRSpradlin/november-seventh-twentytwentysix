"use client";

import { useEffect, useState } from "react"
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
import { updateInvitation } from "@/app/backend/db";

type MemberStatus = 'pending' | 'accepted' | 'declined';

export const WeddingRSVPButton = () => {
    const invitation = useInvitationStore((state) => state.invitation);

    // Track acceptance status for each member
    const [memberStatuses, setMemberStatuses] = useState<Record<string, MemberStatus>>({});

    // Update member statuses when invitation changes
    useEffect(() => {
        if (invitation) {

            const newStatuses = Object.fromEntries(
                invitation.partyMembers.map(member => {
                    if (invitation.acceptingMembers.includes(member)) {
                        return [member, 'accepted' as MemberStatus];
                    } else if (invitation.submittedRSVPMembers.includes(member)) {
                        return [member, 'declined' as MemberStatus];
                    } else {
                        return [member, 'pending' as MemberStatus];
                    }
                })
            );
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMemberStatuses(newStatuses);
        }
    }, [invitation]);

    const updateMemberStatus = (memberName: string, accepted: boolean) => {
        if (invitation !== null) {
            let newInvitation = {} as typeof invitation;
            if (accepted) {
                newInvitation = {
                    ...invitation,
                    acceptingMembers: Array.from(new Set([...invitation.acceptingMembers, memberName])),
                    submittedRSVPMembers: Array.from(new Set([...invitation.acceptingMembers, memberName])),
                };
            } else {
                newInvitation = {
                    ...invitation,
                    acceptingMembers: invitation.partyMembers.filter(member => member !== memberName),
                    submittedRSVPMembers: Array.from(new Set([...invitation.submittedRSVPMembers, memberName])),
                };
            }
            useInvitationStore.getState().setInvitation({...newInvitation});
            updateInvitation(newInvitation);
        }
    }

    const handleAccept = (memberName: string) => {
        updateMemberStatus(memberName, true);
    };

    const handleDecline = (memberName: string) => {
        updateMemberStatus(memberName, false);
    };

    const handleReset = (memberName: string) => {
        if (invitation !== null) {
            const newInvitation = {
                ...invitation,
                acceptingMembers: invitation.acceptingMembers.filter(member => member !== memberName),
                submittedRSVPMembers: invitation.submittedRSVPMembers.filter(member => member !== memberName),
            };
            useInvitationStore.getState().setInvitation({...newInvitation});
            updateInvitation(newInvitation);
        }
    };

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
                                <span className="font-medium">Party Size:</span> {invitation.partyMembers.length}
                            </p>
                            {invitation.partyMembers.length > 0 && (
                                <div className="text-sm space-y-2">
                                    <span className="font-medium">Guests:</span>
                                    <div className="space-y-2 mt-2">
                                        {invitation.partyMembers.map((member, index) => (
                                            <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-md bg-background border">
                                                <span className="text-sm font-medium">{member}</span>
                                                {memberStatuses[member] === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() => handleAccept(member)}
                                                            className="h-7 px-3 text-xs"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDecline(member)}
                                                            className="h-7 px-3 text-xs"
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                )}
                                                {memberStatuses[member] === 'accepted' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                            ✓ Accepted
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleReset(member)}
                                                            className="h-7 px-2 text-xs"
                                                        >
                                                            Reset
                                                        </Button>
                                                    </div>
                                                )}
                                                {memberStatuses[member] === 'declined' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                                                            ✗ Declined
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleReset(member)}
                                                            className="h-7 px-2 text-xs"
                                                        >
                                                            Reset
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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