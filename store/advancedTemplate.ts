import { AdvancedTemplateInputsType } from "@/data/advanced-templates";
import { create } from "zustand";

type StoreState = {
    inputs: AdvancedTemplateInputsType;
    setInputs: (inputs: AdvancedTemplateInputsType) => void;
    id: string | null;
    setId: (id: string | null) => void;
    path:string | null;
    setPath: (path: string | null) => void;
};

const useTemplateStore = create<StoreState>((set) => ({
    inputs: [],
    setInputs: (inputs) => set(() => ({ inputs })),
    id: null,
    setId: (id) => set(() => ({ id })),
    path: null,
    setPath: (path) => set(() => ({ path })),
}));

export default useTemplateStore;
