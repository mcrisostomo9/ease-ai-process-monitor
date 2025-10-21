import { create } from 'zustand';
import { SubmissionWithGuideline } from '@/lib/api/submissions';
import { Guideline } from '../db/schemas/guidelines';

type State = {
  submissions: SubmissionWithGuideline[];
  currentResult: SubmissionWithGuideline | null;
  showAnalysisDialog: boolean;
  showAnalysisInProgressDialog: boolean;
  showClassifyAnalysisDialog: boolean;
  currentClassifyResult: SubmissionWithGuideline | null;
  guidelines: Guideline[];
  showSaveDialog: boolean;
  guidelineName: string;
  isLoading: boolean;
  showSubmissionDetailDialog: boolean;
  currentSubmissionDetail: SubmissionWithGuideline | null;
};

type Actions = {
  actions: {
    openAnalysisDialog: (submission: SubmissionWithGuideline) => void;
    closeAnalysisDialog: () => void;
    openAnalysisInProgressDialog: () => void;
    closeAnalysisInProgressDialog: () => void;
    openClassifyAnalysisDialog: (submission: SubmissionWithGuideline) => void;
    closeClassifyAnalysisDialog: () => void;
    openSaveDialog: () => void;
    closeSaveDialog: () => void;
    updateGuidelineName: (name: string) => void;
    clearGuidelineName: () => void;
    setSubmissions: (submissions: SubmissionWithGuideline[]) => void;
    setGuidelines: (guidelines: Guideline[]) => void;
    addGuideline: (name: string, text: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    openSubmissionDetailDialog: (submission: SubmissionWithGuideline) => void;
    closeSubmissionDetailDialog: () => void;
  };
};

type Store = State & Actions;

const useSubmissionStore = create<Store>()((set) => ({
  submissions: [],
  currentResult: null,
  showAnalysisDialog: false,
  showAnalysisInProgressDialog: false,
  showClassifyAnalysisDialog: false,
  currentClassifyResult: null,
  guidelines: [],
  showSaveDialog: false,
  guidelineName: '',
  isLoading: false,
  showSubmissionDetailDialog: false,
  currentSubmissionDetail: null,
  actions: {
    openAnalysisDialog: (submission) =>
      set({
        currentResult: submission,
        showAnalysisDialog: true,
        showAnalysisInProgressDialog: false,
      }),
    closeAnalysisDialog: () => set({ showAnalysisDialog: false }),
    openAnalysisInProgressDialog: () =>
      set({ showAnalysisInProgressDialog: true, showAnalysisDialog: false }),
    closeAnalysisInProgressDialog: () =>
      set({ showAnalysisInProgressDialog: false }),
    openClassifyAnalysisDialog: (submission) =>
      set({
        currentClassifyResult: submission,
        showClassifyAnalysisDialog: true,
        showAnalysisInProgressDialog: false,
      }),
    closeClassifyAnalysisDialog: () =>
      set({ showClassifyAnalysisDialog: false }),
    openSaveDialog: () => set({ showSaveDialog: true }),
    closeSaveDialog: () => set({ showSaveDialog: false }),
    updateGuidelineName: (name) => set({ guidelineName: name }),
    clearGuidelineName: () => set({ guidelineName: '' }),
    setSubmissions: (submissions) => set({ submissions }),
    setGuidelines: (guidelines) => set({ guidelines: guidelines }),
    addGuideline: async (name, text) => {
      try {
        const response = await fetch('/api/guidelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, text }),
        });

        if (!response.ok) throw new Error('Failed to save guideline');

        const newGuideline = await response.json();
        set((state) => ({
          guidelines: [...state.guidelines, newGuideline],
        }));
      } catch (error) {
        console.error('Error saving guideline:', error);
        throw error;
      }
    },
    setLoading: (loading) => set({ isLoading: loading }),
    openSubmissionDetailDialog: (submission) =>
      set({
        currentSubmissionDetail: submission,
        showSubmissionDetailDialog: true,
      }),
    closeSubmissionDetailDialog: () =>
      set({ showSubmissionDetailDialog: false }),
  },
}));

// Selectors
export const useSubmissions = () =>
  useSubmissionStore((state) => state.submissions);
export const useCurrentResult = () =>
  useSubmissionStore((state) => state.currentResult);
export const useShowAnalysisDialog = () =>
  useSubmissionStore((state) => state.showAnalysisDialog);
export const useShowAnalysisInProgressDialog = () =>
  useSubmissionStore((state) => state.showAnalysisInProgressDialog);
export const useShowClassifyAnalysisDialog = () =>
  useSubmissionStore((state) => state.showClassifyAnalysisDialog);
export const useCurrentClassifyResult = () =>
  useSubmissionStore((state) => state.currentClassifyResult);
export const useShowSaveDialog = () =>
  useSubmissionStore((state) => state.showSaveDialog);
export const useGuidelineName = () =>
  useSubmissionStore((state) => state.guidelineName);
export const useGuidelines = () =>
  useSubmissionStore((state) => state.guidelines);
export const useIsLoading = () =>
  useSubmissionStore((state) => state.isLoading);
export const useShowSubmissionDetailDialog = () =>
  useSubmissionStore((state) => state.showSubmissionDetailDialog);
export const useCurrentSubmissionDetail = () =>
  useSubmissionStore((state) => state.currentSubmissionDetail);

// Actions
export const useSubmissionsActions = () =>
  useSubmissionStore((state) => state.actions);
