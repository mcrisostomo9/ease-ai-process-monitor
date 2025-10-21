'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useSubmissionsActions,
  useCurrentSubmissionDetail,
  useShowSubmissionDetailDialog,
} from '@/lib/store';

export function SubmissionDetailDialog() {
  const { closeSubmissionDetailDialog } = useSubmissionsActions();
  const currentSubmission = useCurrentSubmissionDetail();
  const showDialog = useShowSubmissionDetailDialog();

  if (!currentSubmission) return null;

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={showDialog} onOpenChange={closeSubmissionDetailDialog}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Detailed analysis of submission #{currentSubmission.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <Badge
              variant={currentSubmission.result}
              className="text-base px-3 py-1"
            >
              {currentSubmission.result}
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {(Number(currentSubmission.confidence) * 100).toFixed(0)}%
              confidence
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Action
              </p>
              <p className="text-sm bg-muted p-3 rounded-md">
                {currentSubmission.action}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Guideline
              </p>
              <p className="text-sm bg-muted p-3 rounded-md">
                {currentSubmission.guideline}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimestamp(currentSubmission.timestamp)}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={closeSubmissionDetailDialog} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
