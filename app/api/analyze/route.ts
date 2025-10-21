import { NextResponse } from 'next/server';
import { createSubmission } from '@/lib/api/submissions';
import { getAnalysis } from '@/lib/api/get-analysis';
import { submissionFormSchema } from '@/lib/zod/submission-form';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = submissionFormSchema.parse(body);
    const { action, guideline } = parsedBody;

    const analyzedResult = await getAnalysis(action, guideline);

    const newSubmission = await createSubmission({
      action,
      guideline,
      result: analyzedResult.label,
      confidence: analyzedResult.score,
    });

    return NextResponse.json(newSubmission);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
