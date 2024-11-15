import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  username: string | null;
  setUsername: (username: string) => void;
  clearUser: () => void;
  lastUpdated?: number;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) =>
        set({ username, lastUpdated: new Date().getTime() }),
      clearUser: () => set({ username: null, lastUpdated: 0 }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const now = new Date().getTime();
          const lastUpdated = state.lastUpdated ?? 0;
          const oneHour = 60 * 60 * 1000;

          // Basically mimics like a 1 hour "logged in session"
          if (now - lastUpdated > oneHour) {
            state.clearUser();
          }
        }
      },
      version: 0,
    },
  ),
);

export default useUserStore;
