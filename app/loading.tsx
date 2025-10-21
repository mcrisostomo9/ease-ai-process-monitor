import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      {/* Top grid with two cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Submission Form Skeleton */}
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
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-4 md:flex-row flex-col">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* Action Textarea */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-20 w-full" />
            </div>

            {/* Guideline Selection */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Guidelines List */}
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Latest Submission Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Latest Submission</CardTitle>
            <CardDescription>Most recent compliance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Badge and Confidence */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>

              {/* Action */}
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>

                {/* Guideline */}
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>

                {/* Analysis */}
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>

                {/* Timestamp */}
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submission History Skeleton */}
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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-[70px]" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="rounded-md border">
            <div className="border-b">
              {/* Table header */}
              <div className="flex items-center p-4 space-x-4">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center p-4 space-x-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
