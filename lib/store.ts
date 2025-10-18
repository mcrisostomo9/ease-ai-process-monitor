import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Result = "COMPLIES" | "DEVIATES" | "UNCLEAR"

export interface Submission {
  id: string
  action: string
  guideline: string
  result: Result
  confidence: number
  timestamp: string
}

export interface SavedGuideline {
  id: string
  name: string
  text: string
  createdAt: string
}

interface SubmissionStore {
  submissions: Submission[]
  currentResult: Submission | null
  showDialog: boolean
  savedGuidelines: SavedGuideline[]
  addSubmission: (submission: Omit<Submission, "id" | "timestamp">) => void
  setShowDialog: (show: boolean) => void
  addSavedGuideline: (name: string, text: string) => void
  removeSavedGuideline: (id: string) => void
}

export const useSubmissionStore = create<SubmissionStore>()(
  persist(
    (set) => ({
      submissions: [],
      currentResult: null,
      showDialog: false,
      savedGuidelines: [],
      addSubmission: (submission) => {
        const newSubmission: Submission = {
          ...submission,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          submissions: [newSubmission, ...state.submissions],
          currentResult: newSubmission,
          showDialog: true,
        }))
      },
      setShowDialog: (show) => set({ showDialog: show }),
      addSavedGuideline: (name, text) => {
        const newGuideline: SavedGuideline = {
          id: Date.now().toString(),
          name,
          text,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          savedGuidelines: [...state.savedGuidelines, newGuideline],
        }))
      },
      removeSavedGuideline: (id) => {
        set((state) => ({
          savedGuidelines: state.savedGuidelines.filter((g) => g.id !== id),
        }))
      },
    }),
    {
      name: "process-monitor-storage",
      partialize: (state) => ({ savedGuidelines: state.savedGuidelines }),
    },
  ),
)
