import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubmissionDetailDialog } from '@/components/submission-detail-dialog';

// Mock the store
const mockSubmission = {
  id: 1,
  action: 'Closed ticket #12345 and sent confirmation email',
  guideline: 'All closed tickets must include a confirmation email',
  result: 'complies' as const,
  confidence: 0.95,
  timestamp: new Date('2024-01-15T10:30:00Z'),
};

vi.mock('@/lib/store', () => ({
  useSubmissionsActions: () => ({
    closeSubmissionDetailDialog: vi.fn(),
  }),
  useCurrentSubmissionDetail: () => mockSubmission,
  useShowSubmissionDetailDialog: () => true,
}));

describe('SubmissionDetailDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when dialog is open and submission exists', () => {
    render(<SubmissionDetailDialog />);

    expect(screen.getByText('Submission Details')).toBeInTheDocument();
    expect(
      screen.getByText('Detailed analysis of submission #1'),
    ).toBeInTheDocument();
  });

  it('should display submission result badge', () => {
    render(<SubmissionDetailDialog />);

    expect(screen.getByText('complies')).toBeInTheDocument();
    expect(screen.getByText('95% confidence')).toBeInTheDocument();
  });

  it('should display action and guideline content', () => {
    render(<SubmissionDetailDialog />);

    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Guideline')).toBeInTheDocument();
    expect(screen.getByText(mockSubmission.action)).toBeInTheDocument();
    expect(screen.getByText(mockSubmission.guideline)).toBeInTheDocument();
  });

  it('should format and display timestamp', () => {
    render(<SubmissionDetailDialog />);

    // The timestamp should be formatted and displayed
    const timestampText = screen.getByText(/1\/15\/2024/);
    expect(timestampText).toBeInTheDocument();
  });

  it('should render action and guideline in muted backgrounds', () => {
    render(<SubmissionDetailDialog />);

    const actionElement = screen.getByText(mockSubmission.action);
    const guidelineElement = screen.getByText(mockSubmission.guideline);

    expect(actionElement.closest('p')).toHaveClass('bg-muted');
    expect(guidelineElement.closest('p')).toHaveClass('bg-muted');
  });
});
