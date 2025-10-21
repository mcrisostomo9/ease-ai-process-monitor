'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useIsLoading, useSubmissionsActions } from '@/lib/store';
import { SubmissionWithGuideline } from '@/lib/api/submissions';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationMeta } from '@/lib/api/submissions';
import { Result } from '@/db/schemas/submissions';
import { useQueryState, parseAsStringLiteral, parseAsInteger } from 'nuqs';

type SubmissionHistoryProps = {
  submissions: Array<SubmissionWithGuideline>;
  pagination: PaginationMeta;
};

function useSubmissionHistoryFilters() {
  const [resultFilter, setResultFilter] = useQueryState(
    'result',
    parseAsStringLiteral(['complies', 'deviates', 'unclear', 'all'])
      .withDefault('all')
      .withOptions({
        shallow: false,
      }),
  );
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
    }),
  );
  const [limit, setLimit] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10).withOptions({
      shallow: false,
    }),
  );

  const handleRowsPerPageChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1); // Reset to first page when changing rows per page
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value as 'complies' | 'deviates' | 'unclear' | 'all');
    setPage(1); // Reset to first page when changing filter
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    resultFilter,
    page,
    limit,
    handleRowsPerPageChange,
    handleResultFilterChange,
    handlePageChange,
  };
}

export function SubmissionHistory({
  submissions,
  pagination,
}: SubmissionHistoryProps) {
  const isLoading = useIsLoading();
  const { openSubmissionDetailDialog } = useSubmissionsActions();

  const {
    resultFilter,
    handleRowsPerPageChange,
    handleResultFilterChange,
    handlePageChange,
  } = useSubmissionHistoryFilters();

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;
  const hasNextPage = pagination.hasNextPage;
  const hasPreviousPage = pagination.hasPreviousPage;
  const currentLimit = pagination.limit;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>
            All analyzed actions and their compliance results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading submissions...</p>
          </div>
        </CardContent>
      </Card>
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
        {/* Filters and rows per page selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Result filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Filter by result:
              </span>
              <Select
                value={resultFilter}
                onValueChange={handleResultFilterChange}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="complies">Complies</SelectItem>
                  <SelectItem value="deviates">Deviates</SelectItem>
                  <SelectItem value="unclear">Unclear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={currentLimit.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No submissions</p>
            <p className="text-sm mt-2">Submit an action to see results here</p>
          </div>
        ) : (
          <>
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
                    <TableRow
                      key={submission.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => openSubmissionDetailDialog(submission)}
                    >
                      <TableCell>
                        <Badge variant={submission.result}>
                          {submission.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.action}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.guideline}
                      </TableCell>
                      <TableCell>
                        {(Number(submission.confidence) * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(submission.timestamp.toISOString())}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          hasPreviousPage && handlePageChange(currentPage - 1)
                        }
                        className={
                          !hasPreviousPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          hasNextPage && handlePageChange(currentPage + 1)
                        }
                        className={
                          !hasNextPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
