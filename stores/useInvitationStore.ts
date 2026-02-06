import { Invitation } from '@/app/generated/prisma/client';
import { create } from 'zustand';

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
