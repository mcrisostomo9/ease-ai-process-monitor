import { NextResponse } from 'next/server';
import { getAnalysis } from '@/lib/api/get-analysis';
import { getGuidelinesByIds } from '@/lib/api/guidelines';
import { classifySubmissionFormSchema } from '@/lib/zod/submission-form';
import { createSubmission } from '@/lib/api/submissions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = classifySubmissionFormSchema.parse(body);
    const { action, guidelineIds } = parsedBody;

    const guidelines = await getGuidelinesByIds(guidelineIds);

    const analysisPromises = guidelines.map((guideline) =>
      getAnalysis(action, guideline.text),
    );

    const analyzedResults = await Promise.all(analysisPromises);

    const resultsWithGuidelines = guidelines.map((guideline, index) => ({
      guidelineId: guideline.id,
      guidelineName: guideline.name,
      guidelineText: guideline.text,
      analysis: analyzedResults[index],
    }));

    // Define label priority (higher number = higher priority)
    const labelPriority = {
      complies: 3,
      deviates: 2,
      unclear: 1,
    };

    const highestPriorityResult = resultsWithGuidelines.reduce(
      (highest, current) => {
        const currentPriority =
          labelPriority[current.analysis.label as keyof typeof labelPriority] ||
          0;
        const highestPriority =
          labelPriority[highest.analysis.label as keyof typeof labelPriority] ||
          0;

        if (currentPriority > highestPriority) {
          return current;
        } else if (currentPriority < highestPriority) {
          return highest;
        }

        // If same priority, compare by confidence score
        return current.analysis.score > highest.analysis.score
          ? current
          : highest;
      },
    );

    const newSubmission = await createSubmission({
      action,
      guideline: highestPriorityResult.guidelineText,
      result: highestPriorityResult.analysis.label,
      confidence: highestPriorityResult.analysis.score,
    });

    return NextResponse.json(newSubmission);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
