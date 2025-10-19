import { create } from "zustand"

export type Result = "COMPLIES" | "DEVIATES" | "UNCLEAR"

export interface Submission {
  id: string | number
  action: string
  guideline: string
  result: Result
  confidence: number
  timestamp: string
}

export interface SavedGuideline {
  id: string | number
  name: string
  text: string
  createdAt: string
}

type State = {
  submissions: Submission[]
  currentResult: Submission | null
  showAnalysisDialog: boolean
  savedGuidelines: SavedGuideline[]
  showSaveDialog: boolean
  guidelineName: string
  isLoading: boolean
}

type Actions = {
  actions: {
    addSubmission: (submission: Omit<Submission, "id" | "timestamp">) => Promise<void>
    fetchSubmissions: () => Promise<void>
    openAnalysisDialog: () => void
    closeAnalysisDialog: () => void
    addSavedGuideline: (name: string, text: string) => Promise<void>
    removeSavedGuideline: (id: string | number) => Promise<void>
    fetchSavedGuidelines: () => Promise<void>
    openSaveDialog: () => void
    closeSaveDialog: () => void
    updateGuidelineName: (name: string) => void
    clearGuidelineName: () => void
    setSubmissions: (submissions: Submission[]) => void
    setSavedGuidelines: (guidelines: SavedGuideline[]) => void
    setLoading: (loading: boolean) => void
  }
}

type Store = State & Actions

const useSubmissionStore = create<Store>()((set) => ({
  submissions: [],
  currentResult: null,
  showAnalysisDialog: false,
  savedGuidelines: [],
  showSaveDialog: false,
  guidelineName: "",
  isLoading: false,
  actions: {
    addSubmission: async (submission) => {
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        })

        if (!response.ok) throw new Error("Failed to create submission")

        const newSubmission = await response.json()

        set((state) => ({
          submissions: [newSubmission, ...state.submissions],
          currentResult: newSubmission,
          showAnalysisDialog: true,
        }))
      } catch (error) {
        console.error("[v0] Error adding submission:", error)
      }
    },
    fetchSubmissions: async () => {
      try {
        set({ isLoading: true })
        const response = await fetch("/api/submissions")
        if (!response.ok) throw new Error("Failed to fetch submissions")
        const submissions = await response.json()
        set({ submissions })
      } catch (error) {
        console.error("[v0] Error fetching submissions:", error)
      } finally {
        set({ isLoading: false })
      }
    },
    openAnalysisDialog: () => set({ showAnalysisDialog: true }),
    closeAnalysisDialog: () => set({ showAnalysisDialog: false }),
    addSavedGuideline: async (name, text) => {
      try {
        const response = await fetch("/api/guidelines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, text }),
        })

        if (!response.ok) throw new Error("Failed to create guideline")

        const newGuideline = await response.json()

        set((state) => ({
          savedGuidelines: [newGuideline, ...state.savedGuidelines],
        }))
      } catch (error) {
        console.error("[v0] Error adding guideline:", error)
      }
    },
    removeSavedGuideline: async (id) => {
      try {
        const response = await fetch(`/api/guidelines/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete guideline")

        set((state) => ({
          savedGuidelines: state.savedGuidelines.filter((g) => g.id !== id),
        }))
      } catch (error) {
        console.error("[v0] Error removing guideline:", error)
      }
    },
    fetchSavedGuidelines: async () => {
      try {
        const response = await fetch("/api/guidelines")
        if (!response.ok) throw new Error("Failed to fetch guidelines")
        const guidelines = await response.json()
        set({ savedGuidelines: guidelines })
      } catch (error) {
        console.error("[v0] Error fetching guidelines:", error)
      }
    },
    openSaveDialog: () => set({ showSaveDialog: true }),
    closeSaveDialog: () => set({ showSaveDialog: false }),
    updateGuidelineName: (name) => set({ guidelineName: name }),
    clearGuidelineName: () => set({ guidelineName: "" }),
    setSubmissions: (submissions) => set({ submissions }),
    setSavedGuidelines: (guidelines) => set({ savedGuidelines: guidelines }),
    setLoading: (loading) => set({ isLoading: loading }),
  },
}))

// Selectors
export const useSubmissions = () => useSubmissionStore((state) => state.submissions)
export const useCurrentResult = () => useSubmissionStore((state) => state.currentResult)
export const useShowAnalysisDialog = () => useSubmissionStore((state) => state.showAnalysisDialog)
export const useShowSaveDialog = () => useSubmissionStore((state) => state.showSaveDialog)
export const useGuidelineName = () => useSubmissionStore((state) => state.guidelineName)
export const useSavedGuidelines = () => useSubmissionStore((state) => state.savedGuidelines)
export const useIsLoading = () => useSubmissionStore((state) => state.isLoading)

// Actions
export const useSubmissionsActions = () => useSubmissionStore((state) => state.actions)
