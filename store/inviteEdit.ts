import { create } from "zustand";

type InviteData = {
	title?: string;
	eventDate?: string;
	eventTime?: string;
	eventLocation?: string;
	eventMessage?: string;
};

type InviteStoreType = {
  inviteData: InviteData;
  updateInviteData: (newData: Partial<InviteData>) => void;
  
};

const useInviteStore = create<InviteStoreType>((set) => ({
  inviteData: {
    title: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventMessage: "",
  },
  updateInviteData: (newData) =>
    set((state) => ({
      inviteData: { ...state.inviteData, ...newData },
    })),
}));

export default useInviteStore;