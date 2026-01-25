import { create } from 'zustand';

interface Invitation {
  id: number;
  displayName: string;
  invitationCode: string;
  partySize: number;
  partyMembers: string;
  submittedRSVP: boolean;
  acceptingMembers: string;
}

interface InvitationStore {
  invitation: Invitation | null;
  setInvitation: (invitation: Invitation) => void;
  clearInvitation: () => void;
}

export const useInvitationStore = create<InvitationStore>((set) => ({
  invitation: null,
  setInvitation: (invitation) => set({ invitation }),
  clearInvitation: () => set({ invitation: null }),
}));
