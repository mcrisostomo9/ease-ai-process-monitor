'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  useSubmissionsActions,
  useCurrentResult,
  useShowAnalysisDialog,
  useShowAnalysisInProgressDialog,
  useCurrentClassifyResult,
  useShowClassifyAnalysisDialog,
} from '@/lib/store';

export function AnalysisDialog() {
  const { closeAnalysisDialog } = useSubmissionsActions();
  const currentResult = useCurrentResult();
  const showAnalysisDialog = useShowAnalysisDialog();

  return (
    <Dialog open={showAnalysisDialog} onOpenChange={closeAnalysisDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Analysis Complete</DialogTitle>
          <DialogDescription>
            The action has been evaluated against the guideline
          </DialogDescription>
        </DialogHeader>
        {currentResult && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Result:</span>
              <Badge
                variant={currentResult.result}
                className="text-base px-3 py-1"
              >
                {currentResult.result}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence:</span>
              <span className="text-sm">
                {(Number(currentResult.confidence) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                The submission has been added to your history table.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AnalysisInProgress() {
  const showAnalysisInProgressDialog = useShowAnalysisInProgressDialog();
  const { closeAnalysisInProgressDialog } = useSubmissionsActions();

  if (!showAnalysisInProgressDialog) return null;

  return (
    <Dialog
      open={showAnalysisInProgressDialog}
      onOpenChange={closeAnalysisInProgressDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Analyzing Submission</DialogTitle>
          <DialogDescription>
            Please wait while we evaluate your action against the guideline
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Processing your submission...
              </p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              This may take a few moments. Please do not close this dialog.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClassifyAnalysisDialog() {
  const { closeClassifyAnalysisDialog } = useSubmissionsActions();
  const currentClassifyResult = useCurrentClassifyResult();
  const showClassifyAnalysisDialog = useShowClassifyAnalysisDialog();

  return (
    <Dialog
      open={showClassifyAnalysisDialog}
      onOpenChange={closeClassifyAnalysisDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Classification Analysis Complete</DialogTitle>
          <DialogDescription>
            The action has been evaluated against the selected guidelines
          </DialogDescription>
        </DialogHeader>
        {currentClassifyResult && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Result:</span>
              <Badge
                variant={currentClassifyResult.result}
                className="text-base px-3 py-1"
              >
                {currentClassifyResult.result}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence:</span>
              <span className="text-sm">
                {(Number(currentClassifyResult.confidence) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                The submission has been added to your history table.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
