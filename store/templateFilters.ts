import { create } from "zustand";

type TemplateFilter = {
    search:string;
    setSearch:(t:string)=>void
}

const usesTemaplteFilterstore = create<TemplateFilter>((set)=>({
    search:'',
    setSearch: (t)=>{
        set(()=>({
            search:t
        }))
    }
}))

export default usesTemaplteFilterstore