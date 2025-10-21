import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AnalysisDialog,
  AnalysisInProgress,
} from '@/components/analysis-dialog';

// Mock the store
vi.mock('@/lib/store', () => ({
  useSubmissionsActions: () => ({
    closeAnalysisDialog: vi.fn(),
    closeAnalysisInProgressDialog: vi.fn(),
  }),
  useCurrentResult: () => ({
    result: 'complies',
    confidence: 0.95,
  }),
  useShowAnalysisDialog: () => true,
  useShowAnalysisInProgressDialog: () => false,
}));

describe('AnalysisDialog Component', () => {
  it('should render when dialog is open', () => {
    render(<AnalysisDialog />);

    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
    expect(
      screen.getByText('The action has been evaluated against the guideline'),
    ).toBeInTheDocument();
  });

  it('should display result badge', () => {
    render(<AnalysisDialog />);

    expect(screen.getByText('complies')).toBeInTheDocument();
    expect(screen.getByText('Result:')).toBeInTheDocument();
  });

  it('should display confidence percentage', () => {
    render(<AnalysisDialog />);

    expect(screen.getByText('Confidence:')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('should display submission added message', () => {
    render(<AnalysisDialog />);

    expect(
      screen.getByText('The submission has been added to your history table.'),
    ).toBeInTheDocument();
  });
});

describe('AnalysisInProgress Component', () => {
  it('should return null when not in progress', () => {
    const { container } = render(<AnalysisInProgress />);
    expect(container.firstChild).toBeNull();
  });
});
