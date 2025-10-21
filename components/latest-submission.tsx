'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubmissionWithGuideline } from '@/lib/api/submissions';

export function LatestSubmission({
  latestSubmission,
}: {
  latestSubmission: SubmissionWithGuideline | null;
}) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Latest Submission</CardTitle>
        <CardDescription>Most recent compliance analysis</CardDescription>
      </CardHeader>
      <CardContent>
        {latestSubmission ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={latestSubmission.result}
                className="text-base px-3 py-1"
              >
                {latestSubmission.result}
              </Badge>
              <span className="text-sm text-muted-foreground ml-auto">
                {(Number(latestSubmission.confidence) * 100).toFixed(0)}%
                confidence
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Action
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {latestSubmission.action}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Guideline
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {latestSubmission.guideline}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(latestSubmission.timestamp.toISOString())}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No submissions yet</p>
            <p className="text-sm mt-2">Submit an action to see results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
