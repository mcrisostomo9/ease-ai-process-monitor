'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookmarkPlus,
  Bookmark,
  Trash2,
} from 'lucide-react';
import {
  useSubmissions,
  useCurrentResult,
  useShowAnalysisDialog,
  useSubmissionsActions,
  useShowSaveDialog,
  useGuidelineName,
  useSavedGuidelines,
  Result,
} from '@/lib/store';
import { submissionSchema, type SubmissionFormData } from '@/lib/validation';
import { Input } from '@/components/ui/input';

const RESULT_ICONS: Record<Result, React.ReactNode> = {
  COMPLIES: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  DEVIATES: <XCircle className="h-5 w-5 text-red-600" />,
  UNCLEAR: <HelpCircle className="h-5 w-5 text-yellow-600" />,
};

const RESULT_BADGE_VARIANTS: Record<
  Result,
  'default' | 'destructive' | 'secondary'
> = {
  COMPLIES: 'default',
  DEVIATES: 'destructive',
  UNCLEAR: 'secondary',
};

export default function Page() {
  const showAnalysisDialog = useShowAnalysisDialog();
  const showSaveDialog = useShowSaveDialog();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <div className="grid gap-8 lg:grid-cols-2">
          <SubmissionForm />
          <LatestResult />
        </div>
        <SubmissionHistory />
        {showAnalysisDialog && <AnalysisDialog />}
        {showSaveDialog && <SaveGuidelineDialog />}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
        Ease Process Monitor
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-lg">
        Evaluate whether actions comply with established guidelines
      </p>
    </div>
  );
}

function SubmissionForm() {
  const actions = useSubmissionsActions();
  const savedGuidelines = useSavedGuidelines();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const currentGuideline = watch('guideline');

  const onSubmit = (data: SubmissionFormData) => {
    const results: Result[] = ['COMPLIES', 'DEVIATES', 'UNCLEAR'];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    const randomConfidence = Math.random() * 0.3 + 0.7;

    actions.addSubmission({
      action: data.action.trim(),
      guideline: data.guideline.trim(),
      result: randomResult,
      confidence: Number.parseFloat(randomConfidence.toFixed(2)),
    });

    reset();
  };

  const handleLoadGuideline = (text: string) => {
    setValue('guideline', text, { shouldValidate: true });
  };
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Submit Action for Analysis</CardTitle>
        <CardDescription>
          Enter the action taken and the guideline to evaluate compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="action">Action Taken</Label>
            <Textarea
              id="action"
              placeholder="e.g., Closed ticket #48219 and sent confirmation email"
              {...register('action')}
              className={errors.action ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.action && (
              <p className="text-sm text-red-600">{errors.action.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="guideline">Guideline</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={actions.openSaveDialog}
                disabled={
                  !currentGuideline || currentGuideline.trim().length < 10
                }
                className="h-8 gap-1.5"
              >
                <BookmarkPlus className="h-4 w-4" />
                Save
              </Button>
            </div>
            <Textarea
              id="guideline"
              placeholder="e.g., All closed tickets must include a confirmation email"
              {...register('guideline')}
              className={errors.guideline ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.guideline && (
              <p className="text-sm text-red-600">{errors.guideline.message}</p>
            )}

            {savedGuidelines.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Saved Guidelines:
                </p>
                <div className="space-y-1.5">
                  {savedGuidelines.map((guideline) => (
                    <div
                      key={guideline.id}
                      className="flex items-center gap-2 p-2 rounded-md border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadGuideline(guideline.text)}
                        className="flex-1 justify-start h-auto py-1.5 px-2 font-normal"
                      >
                        <Bookmark className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {guideline.name}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          actions.removeSavedGuideline(guideline.id)
                        }
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Analyze Compliance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function LatestResult() {
  const submissions = useSubmissions();

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Latest Result</CardTitle>
        <CardDescription>Most recent compliance analysis</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {RESULT_ICONS[submissions[0].result]}
              <Badge
                variant={RESULT_BADGE_VARIANTS[submissions[0].result]}
                className="text-base px-3 py-1"
              >
                {submissions[0].result}
              </Badge>
              <span className="text-sm text-muted-foreground ml-auto">
                {(submissions[0].confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Action
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {submissions[0].action}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Guideline
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {submissions[0].guideline}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(submissions[0].timestamp)}
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

function SubmissionHistory() {
  const submissions = useSubmissions();

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No submissions yet</p>
        <p className="text-sm mt-2">Submit an action to see results here</p>
      </div>
    );
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Submission History</CardTitle>
        <CardDescription>
          All analyzed actions and their compliance results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Result</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Guideline</TableHead>
                <TableHead className="w-[100px]">Confidence</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {RESULT_ICONS[submission.result]}
                      <Badge variant={RESULT_BADGE_VARIANTS[submission.result]}>
                        {submission.result}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {submission.action}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {submission.guideline}
                  </TableCell>
                  <TableCell>
                    {(submission.confidence * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(submission.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisDialog() {
  const { closeAnalysisDialog } = useSubmissionsActions();
  const currentResult = useCurrentResult();
  const showAnalysisDialog = useShowAnalysisDialog();

  return (
    <Dialog open={showAnalysisDialog} onOpenChange={closeAnalysisDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {currentResult && RESULT_ICONS[currentResult.result]}
            Analysis Complete
          </DialogTitle>
          <DialogDescription>
            The action has been evaluated against the guideline
          </DialogDescription>
        </DialogHeader>
        {currentResult && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Result:</span>
              <Badge
                variant={RESULT_BADGE_VARIANTS[currentResult.result]}
                className="text-base px-3 py-1"
              >
                {currentResult.result}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence:</span>
              <span className="text-sm">
                {(currentResult.confidence * 100).toFixed(0)}%
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

function SaveGuidelineDialog() {
  const { updateGuidelineName, closeSaveDialog } = useSubmissionsActions();
  const showSaveDialog = useShowSaveDialog();
  const guidelineName = useGuidelineName();
  return (
    <Dialog open={showSaveDialog} onOpenChange={closeSaveDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Guideline</DialogTitle>
          <DialogDescription>
            Give this guideline a name so you can reuse it later
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guideline-name">Guideline Name</Label>
            <Input
              id="guideline-name"
              placeholder="e.g., Ticket Closure Policy"
              value={guidelineName}
              onChange={(e) => updateGuidelineName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Guideline Text</Label>
            <p className="text-sm bg-muted p-3 rounded-md">
              {/* {currentGuideline} */}
              {/* TODO: Add current guideline */}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={closeSaveDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Add save guideline
              }}
              disabled={!guidelineName.trim()}
            >
              Save Guideline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
