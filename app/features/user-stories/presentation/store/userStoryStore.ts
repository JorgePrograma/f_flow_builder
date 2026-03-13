import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserStory } from "../../domain/entities/UserStory";

interface UserStoryState {
  stories: UserStory[];
  isLoading: boolean;
  activeId: string | null;
  error: string | null;
  
  // Actions
  setStories: (stories: UserStory[]) => void;
  setActiveId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  stories: [],
  isLoading: false,
  activeId: null,
  error: null,
};

export const useUserStoryStore = create<UserStoryState>()(
  devtools(
    (set) => ({
      ...initialState,
      setStories: (stories) => set({ stories }, false, "userStory/setStories"),
      setActiveId: (activeId) => set({ activeId }, false, "userStory/setActiveId"),
      setLoading: (isLoading) => set({ isLoading }, false, "userStory/setLoading"),
      setError: (error) => set({ error }, false, "userStory/setError"),
      reset: () => set(initialState, false, "userStory/reset"),
    }),
    { name: "UserStoryStore" }
  )
);
