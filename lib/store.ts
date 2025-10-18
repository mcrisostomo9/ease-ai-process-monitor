import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Result = 'COMPLIES' | 'DEVIATES' | 'UNCLEAR';

export interface Submission {
  id: string;
  action: string;
  guideline: string;
  result: Result;
  confidence: number;
  timestamp: string;
}

export interface SavedGuideline {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

type State = {
  submissions: Submission[];
  currentResult: Submission | null;
  showAnalysisDialog: boolean;
  savedGuidelines: SavedGuideline[];
  showSaveDialog: boolean;
  guidelineName: string;
};

type Actions = {
  actions: {
    addSubmission: (submission: Omit<Submission, 'id' | 'timestamp'>) => void;
    openAnalysisDialog: () => void;
    closeAnalysisDialog: () => void;
    addSavedGuideline: (name: string, text: string) => void;
    removeSavedGuideline: (id: string) => void;
    openSaveDialog: () => void;
    closeSaveDialog: () => void;
    updateGuidelineName: (name: string) => void;
    clearGuidelineName: () => void;
  };
};

type Store = State & Actions;

const useSubmissionStore = create<Store>()(
  persist(
    (set) => ({
      submissions: [],
      currentResult: null,
      showAnalysisDialog: false,
      savedGuidelines: [],
      showSaveDialog: false,
      guidelineName: '',
      actions: {
        addSubmission: (submission) =>
          set((state) => ({
            submissions: [
              {
                ...submission,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
              },
              ...state.submissions,
            ],
            currentResult: {
              ...submission,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
            },
            showAnalysisDialog: true,
          })),
        openAnalysisDialog: () => set({ showAnalysisDialog: true }),
        closeAnalysisDialog: () => set({ showAnalysisDialog: false }),
        addSavedGuideline: (name, text) =>
          set((state) => ({
            savedGuidelines: [
              ...state.savedGuidelines,
              {
                id: Date.now().toString(),
                name,
                text,
                createdAt: new Date().toISOString(),
              },
            ],
          })),
        removeSavedGuideline: (id) =>
          set((state) => ({
            savedGuidelines: state.savedGuidelines.filter((g) => g.id !== id),
          })),
        openSaveDialog: () => set({ showSaveDialog: true }),
        closeSaveDialog: () => set({ showSaveDialog: false }),
        updateGuidelineName: (name) => set({ guidelineName: name }),
        clearGuidelineName: () => set({ guidelineName: '' }),
      },
    }),
    {
      name: 'process-monitor-storage',
      partialize: (state) => ({ savedGuidelines: state.savedGuidelines }),
    },
  ),
);

// Selectors
export const useSubmissions = () =>
  useSubmissionStore((state) => state.submissions);
export const useCurrentResult = () =>
  useSubmissionStore((state) => state.currentResult);
export const useShowAnalysisDialog = () =>
  useSubmissionStore((state) => state.showAnalysisDialog);
export const useShowSaveDialog = () =>
  useSubmissionStore((state) => state.showSaveDialog);
export const useGuidelineName = () =>
  useSubmissionStore((state) => state.guidelineName);
export const useSavedGuidelines = () =>
  useSubmissionStore((state) => state.savedGuidelines);

// Actions
export const useSubmissionsActions = () =>
  useSubmissionStore((state) => state.actions);
