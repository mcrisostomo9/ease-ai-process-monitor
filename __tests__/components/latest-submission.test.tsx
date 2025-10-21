import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LatestSubmission } from '@/components/latest-submission';
import { SubmissionWithGuideline } from '@/lib/api/submissions';

// Mock the store
vi.mock('@/lib/store', () => ({
  useSubmissionsActions: () => ({}),
  useCurrentResult: () => null,
  useShowAnalysisDialog: () => false,
  useShowAnalysisInProgressDialog: () => false,
}));

const mockSubmission: SubmissionWithGuideline = {
  id: 1,
  action: 'Closed ticket #12345 and sent confirmation email',
  guideline: 'All closed tickets must include a confirmation email',
  result: 'complies',
  confidence: '0.95',
  timestamp: new Date('2024-01-15T10:30:00Z'),
  guidelineId: 1,
  createdAt: new Date('2024-01-15T10:30:00Z'),
};

describe('LatestSubmission Component', () => {
  it('should render submission data when provided', () => {
    render(<LatestSubmission latestSubmission={mockSubmission} />);

    expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    expect(
      screen.getByText('Most recent compliance analysis'),
    ).toBeInTheDocument();
    expect(screen.getByText('complies')).toBeInTheDocument();
    expect(screen.getByText('95% confidence')).toBeInTheDocument();
    expect(screen.getByText(mockSubmission.action)).toBeInTheDocument();
    expect(screen.getByText(mockSubmission.guideline)).toBeInTheDocument();
  });

  it('should render empty state when no submission provided', () => {
    render(<LatestSubmission latestSubmission={null} />);

    expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    expect(screen.getByText('No submissions yet')).toBeInTheDocument();
    expect(
      screen.getByText('Submit an action to see results here'),
    ).toBeInTheDocument();
  });

  it('should format timestamp correctly', () => {
    render(<LatestSubmission latestSubmission={mockSubmission} />);

    // The timestamp should be formatted and displayed
    const timestampText = screen.getByText(/1\/15\/2024/);
    expect(timestampText).toBeInTheDocument();
  });

  it('should display confidence percentage correctly', () => {
    const submissionWithLowConfidence = {
      ...mockSubmission,
      confidence: '0.75',
    };

    render(<LatestSubmission latestSubmission={submissionWithLowConfidence} />);
    expect(screen.getByText('75% confidence')).toBeInTheDocument();
  });

  it('should render badge with correct variant', () => {
    render(<LatestSubmission latestSubmission={mockSubmission} />);

    const badge = screen.getByText('complies');
    expect(badge).toHaveClass('bg-primary'); // complies variant uses bg-primary
  });

  it('should render action and guideline in muted backgrounds', () => {
    render(<LatestSubmission latestSubmission={mockSubmission} />);

    const actionElement = screen.getByText(mockSubmission.action);
    const guidelineElement = screen.getByText(mockSubmission.guideline);

    expect(actionElement.closest('p')).toHaveClass('bg-muted');
    expect(guidelineElement.closest('p')).toHaveClass('bg-muted');
  });
});
