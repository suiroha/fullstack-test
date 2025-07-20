import { create } from "zustand";

interface isLogin {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

interface items {
    name: string;
    description: string;
    amount: number;
}

interface itemsData {
    items: items | items[] | null;
    setItems: (items:items|items[]) => void;
}
// interface UserData {
//     id: number;
//     username: string;
//     email: string;
// }
export const useItemsStore = create<itemsData>((set) => ({
    items: null,
    setItems: (items) => set(() => ({ items })),
}));
export const useLoginStore = create<isLogin>((set) => ({
    isLogin: false,
    setIsLogin: (isLogin) => set(() => ({ isLogin })),
}));
