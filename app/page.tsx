import { getGuidelines } from '@/lib/api/guidelines';
import PageClient from './page-client';
import { getLatestSubmission, getSubmissions } from '@/lib/api/submissions';

import {
  createLoader,
  parseAsInteger,
  parseAsStringLiteral,
  SearchParams,
} from 'nuqs/server';
import { resultEnum } from '@/db/schemas/submissions';

const submissionFilters = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  result: parseAsStringLiteral([...resultEnum, 'all']).withDefault('all'),
};

const loadSearchParams = createLoader(submissionFilters);

type PageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: PageProps) {
  const { page, limit, result } = await loadSearchParams(searchParams);

  const submissionsPromise = getSubmissions({
    pagination: { page, limit },
    filters: { result },
  });
  const latestSubmissionPromise = getLatestSubmission();
  const guidelinesPromise = getGuidelines();

  const [submissions, latestSubmission, guidelines] = await Promise.all([
    submissionsPromise,
    latestSubmissionPromise,
    guidelinesPromise,
  ]);

  return (
    <PageClient
      submissions={submissions.data}
      pagination={submissions.pagination}
      latestSubmission={latestSubmission}
      guidelines={guidelines}
    />
  );
}
