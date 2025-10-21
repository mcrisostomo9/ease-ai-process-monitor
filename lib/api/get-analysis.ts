import { resultEnum, type Result } from '@/db/schemas/submissions';

const HUGGING_FACE_MODEL_URL =
  'https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli';

export const getAnalysis = async (action: string, guideline: string) => {
  try {
    const response = await fetch(HUGGING_FACE_MODEL_URL, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',

      body: JSON.stringify({
        inputs: `Action: ${action}, \n Guideline: ${guideline}`,
        parameters: {
          candidate_labels: resultEnum,
        },
      }),
    });
    if (!response.ok) throw new Error('Failed to analyze submission');
    const data = (await response.json()) as {
      labels: Array<Result>;
      scores: Array<number>;
      sequence: string;
    };
    const analyzedResult = {
      label: data.labels[0],
      score: data.scores[0],
      sequence: data.sequence,
    };

    return analyzedResult;
  } catch (error) {
    throw error;
  }
};
