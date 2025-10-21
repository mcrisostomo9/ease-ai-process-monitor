'use client';

import {
  useShowAnalysisDialog,
  useShowAnalysisInProgressDialog,
  useShowClassifyAnalysisDialog,
  useShowSaveDialog,
  useShowSubmissionDetailDialog,
} from '@/lib/store';
import { SubmissionForm } from '@/components/submission-form';
import { LatestSubmission } from '@/components/latest-submission';
import { SubmissionHistory } from '@/components/submission-history';
import {
  AnalysisDialog,
  AnalysisInProgress,
  ClassifyAnalysisDialog,
} from '@/components/analysis-dialog';
import { SaveGuidelineDialog } from '@/components/save-guideline-dialog';
import { SubmissionDetailDialog } from '@/components/submission-detail-dialog';
import { SubmissionWithGuideline, PaginationMeta } from '@/lib/api/submissions';
import { Guideline } from '@/db/schemas/guidelines';

type PageClientProps = {
  submissions: Array<SubmissionWithGuideline>;
  pagination: PaginationMeta;
  latestSubmission: SubmissionWithGuideline | null;
  guidelines: Array<Guideline>;
};

export default function PageClient({
  latestSubmission,
  guidelines,
  ...delegated
}: PageClientProps) {
  const showAnalysisDialog = useShowAnalysisDialog();
  const showSaveDialog = useShowSaveDialog();
  const showAnalysisInProgressDialog = useShowAnalysisInProgressDialog();
  const showClassifyAnalysisDialog = useShowClassifyAnalysisDialog();
  const showSubmissionDetailDialog = useShowSubmissionDetailDialog();

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        <SubmissionForm guidelines={guidelines} />
        <LatestSubmission latestSubmission={latestSubmission} />
      </div>

      <SubmissionHistory {...delegated} />
      {showAnalysisDialog && <AnalysisDialog />}
      {showClassifyAnalysisDialog && <ClassifyAnalysisDialog />}
      {showAnalysisInProgressDialog && <AnalysisInProgress />}
      {showSaveDialog && <SaveGuidelineDialog />}
      {showSubmissionDetailDialog && <SubmissionDetailDialog />}
    </>
  );
}
