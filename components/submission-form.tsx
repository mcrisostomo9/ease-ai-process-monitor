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
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';
import { useSubmissionsActions } from '@/lib/store';
import {
  submissionFormSchema,
  classifySubmissionFormSchema,
  type SubmissionFormData,
  type ClassifySubmissionFormData,
} from '@/lib/zod/submission-form';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Guideline } from '@/db/schemas/guidelines';

export function SubmissionForm({
  guidelines,
}: {
  guidelines: Array<Guideline>;
}) {
  const [mode, setMode] = useState<'guideline' | 'classify'>('guideline');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Submit Action for Analysis</CardTitle>
        <CardDescription>
          Enter the action taken and the guideline to evaluate compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mode Selection */}
        <div className="space-y-3 mb-6">
          <Label>Analysis Mode</Label>
          <div className="flex gap-4 md:flex-row flex-col">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="guideline"
                checked={mode === 'guideline'}
                onChange={(e) =>
                  setMode(e.target.value as 'guideline' | 'classify')
                }
                className="text-blue-600"
              />
              <span className="text-sm">Manual</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="classify"
                checked={mode === 'classify'}
                onChange={(e) =>
                  setMode(e.target.value as 'guideline' | 'classify')
                }
                className="text-blue-600"
              />
              <span className="text-sm">Preset</span>
            </label>
          </div>
        </div>

        {mode === 'guideline' ? (
          <SingleGuidelineSubmissionForm guidelines={guidelines} />
        ) : (
          <ClassifyForm guidelines={guidelines} />
        )}
      </CardContent>
    </Card>
  );
}

function SingleGuidelineSubmissionForm({
  guidelines,
}: {
  guidelines: Array<Guideline>;
}) {
  const actions = useSubmissionsActions();
  const router = useRouter();

  const { register, handleSubmit, reset, formState } =
    useForm<SubmissionFormData>({
      resolver: zodResolver(submissionFormSchema),
    });

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      actions.openAnalysisInProgressDialog();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to analyze submission');

      const newSubmission = await response.json();
      actions.openAnalysisDialog(newSubmission);
      reset();
      router.refresh();
    } catch (error) {
      console.error('Error analyzing submission:', error);
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="action">Action Taken</Label>
        <Textarea
          id="action"
          placeholder="e.g., Closed ticket #48219 and sent confirmation email"
          {...register('action')}
          className={formState.errors.action ? 'border-red-500' : ''}
          rows={4}
        />
        {formState.errors.action && (
          <p className="text-sm text-red-600">
            {formState.errors.action.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guideline">Guideline</Label>
        <Textarea
          id="guideline"
          placeholder="e.g., All closed tickets must include a confirmation email"
          {...register('guideline')}
          className={formState.errors.guideline ? 'border-red-500' : ''}
          rows={4}
        />
        {formState.errors.guideline && (
          <p className="text-sm text-red-600">
            {formState.errors.guideline.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={formState.isSubmitting || !formState.isValid}
      >
        {formState.isSubmitting ? <Spinner /> : 'Analyze Action'}
      </Button>
    </form>
  );
}

function ClassifyForm({ guidelines }: { guidelines: Array<Guideline> }) {
  const actions = useSubmissionsActions();
  const router = useRouter();

  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm<ClassifySubmissionFormData>({
      resolver: zodResolver(classifySubmissionFormSchema),
    });

  const guidelineIds = watch('guidelineIds') || [];

  // Helper function to handle checkbox toggle
  const handleGuidelineToggle = (guidelineId: number) => {
    const currentIds = guidelineIds;
    const newIds = currentIds.includes(guidelineId)
      ? currentIds.filter((id) => id !== guidelineId)
      : [...currentIds, guidelineId];
    setValue('guidelineIds', newIds);
  };

  const onSubmit = async (data: ClassifySubmissionFormData) => {
    try {
      actions.openAnalysisInProgressDialog();

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to analyze submission');

      const newSubmission = await response.json();
      actions.openClassifyAnalysisDialog(newSubmission);
      reset();
      router.refresh();
    } catch (error) {
      console.error('Error analyzing submission:', error);
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="action">Action Taken</Label>
        <Textarea
          id="action"
          placeholder="e.g., Closed ticket #48219 and sent confirmation email"
          {...register('action')}
          className={formState.errors.action ? 'border-red-500' : ''}
          rows={4}
        />
        {formState.errors.action && (
          <p className="text-sm text-red-600">
            {formState.errors.action.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Select Guidelines to Check</Label>
        <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-4">
          {guidelines.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No guidelines available</p>
              <p className="text-xs mt-1">
                Add guidelines to enable preset analysis
              </p>
            </div>
          ) : (
            guidelines.map((guideline) => (
              <div key={guideline.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`guideline-${guideline.id}`}
                  checked={guidelineIds.includes(guideline.id)}
                  onCheckedChange={() => handleGuidelineToggle(guideline.id)}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`guideline-${guideline.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {guideline.name}
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
        {formState.errors.guidelineIds && (
          <p className="text-sm text-red-600 mt-2">
            {formState.errors.guidelineIds.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={formState.isSubmitting || guidelineIds.length === 0}
      >
        {formState.isSubmitting ? <Spinner /> : 'Analyze Action'}
      </Button>
    </form>
  );
}
