import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AdvancedInviteData = {


	name: string;
	age: string;
	dateTime: string;
	location: string;
	address: string;
	addressLink: string[] | string;
	themeOrMessage?: string;
	dressCode?: string;
	giftInfo?: string;
	rsvpDeadline?: string;
	contactInfo: string;
	
};

type AdvancedInviteStoreType = {
	inviteData: AdvancedInviteData;
	setInviteData: (newData: Partial<AdvancedInviteData>) => void;
	resetInviteData: () => void;
	isReady: ()=>boolean;
};
const useAdvancedInviteStore = create<AdvancedInviteStoreType>()(
	devtools((set, get) => ({
		inviteData: {} as AdvancedInviteData,
		setInviteData: (newData) =>
			set((state) => ({
				inviteData: { ...state.inviteData, ...newData },
			})),
		resetInviteData: () =>
			set({ inviteData: {} as AdvancedInviteData }),
		isReady: () => {
			const requiredFields: (keyof AdvancedInviteData)[] = [
				"name",
				"age",
				"dateTime",
				"location",
				"address",
				"addressLink",
				"contactInfo",
			];
			const { inviteData } = get();
			requiredFields.forEach((field) => {
				if (
					inviteData[field] === undefined ||
					inviteData[field] === null ||
					inviteData[field] === ""
				) {
					toast.info(`${field} is required`);
				}
			});
			return requiredFields.every(
				(field) =>
					inviteData[field] !== undefined &&
					inviteData[field] !== null &&
					inviteData[field] !== ""
			);
		},
	}))
);

export default useAdvancedInviteStore;
export type { AdvancedInviteData, AdvancedInviteStoreType };