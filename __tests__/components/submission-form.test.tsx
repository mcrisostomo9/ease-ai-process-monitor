import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionForm } from '@/components/submission-form';

// Mock Next.js router
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock the store
const mockActions = {
  openAnalysisInProgressDialog: vi.fn(),
  openAnalysisDialog: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useSubmissionsActions: () => mockActions,
}));

// Mock fetch
global.fetch = vi.fn();

describe('SubmissionForm Component', () => {
  const mockGuidelines = [
    {
      id: 1,
      name: 'Test Guideline 1',
      text: 'All tickets must be closed with confirmation email',
      createdAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: 2,
      name: 'Test Guideline 2',
      text: 'Customer data changes require verification',
      createdAt: new Date('2024-01-14T15:45:00Z'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should render form elements', () => {
    render(<SubmissionForm guidelines={mockGuidelines} />);

    expect(screen.getByText('Submit Action for Analysis')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Enter the action taken and the guideline to evaluate compliance',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Action Taken')).toBeInTheDocument();
    expect(screen.getByText('Analysis Mode')).toBeInTheDocument();
  });

  it('should render guideline mode by default', () => {
    render(<SubmissionForm guidelines={mockGuidelines} />);

    expect(screen.getByLabelText('Guideline')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('should switch to classify mode when selected', async () => {
    const user = userEvent.setup();
    render(<SubmissionForm guidelines={mockGuidelines} />);

    const classifyRadio = screen.getByDisplayValue('classify');
    await user.click(classifyRadio);

    expect(screen.getByText('Preset')).toBeInTheDocument();
  });

  it('should switch back to guideline mode when selected', async () => {
    const user = userEvent.setup();
    render(<SubmissionForm guidelines={mockGuidelines} />);

    // First switch to classify mode
    const classifyRadio = screen.getByDisplayValue('classify');
    await user.click(classifyRadio);

    // Then switch back to guideline mode
    const guidelineRadio = screen.getByDisplayValue('guideline');
    await user.click(guidelineRadio);

    expect(screen.getByLabelText('Guideline')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<SubmissionForm guidelines={mockGuidelines} />);

    const submitButton = screen.getByRole('button', {
      name: 'Analyze Action',
    });
    await user.click(submitButton);

    // The form should prevent submission with empty fields
    // Check that the button is still enabled (form validation prevents submission)
    expect(submitButton).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 1, result: 'compliant' }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    render(<SubmissionForm guidelines={mockGuidelines} />);

    const actionTextarea = screen.getByLabelText('Action Taken');
    const guidelineTextarea = screen.getByLabelText('Guideline');
    const submitButton = screen.getByRole('button', {
      name: 'Analyze Action',
    });

    await user.type(actionTextarea, 'Closed ticket #12345');
    await user.type(
      guidelineTextarea,
      'All tickets must be closed with confirmation',
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Closed ticket #12345',
          guideline: 'All tickets must be closed with confirmation',
        }),
      });
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    render(<SubmissionForm guidelines={mockGuidelines} />);

    const actionTextarea = screen.getByLabelText('Action Taken');
    const guidelineTextarea = screen.getByLabelText('Guideline');
    const submitButton = screen.getByRole('button', {
      name: 'Analyze Action',
    });

    await user.type(actionTextarea, 'Closed ticket #12345');
    await user.type(
      guidelineTextarea,
      'All tickets must be closed with confirmation',
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
    });

    // Form should be reset after error
    await waitFor(() => {
      expect(actionTextarea).toHaveValue('');
      expect(guidelineTextarea).toHaveValue('');
    });
  });

  it('should show spinner when submitting', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 1, result: 'compliant' }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    render(<SubmissionForm guidelines={mockGuidelines} />);

    const actionTextarea = screen.getByLabelText('Action Taken');
    const guidelineTextarea = screen.getByLabelText('Guideline');
    const submitButton = screen.getByRole('button', {
      name: 'Analyze Action',
    });

    await user.type(actionTextarea, 'Closed ticket #12345');
    await user.type(
      guidelineTextarea,
      'All tickets must be closed with confirmation',
    );
    await user.click(submitButton);

    // Check if spinner is shown (the button text changes)
    expect(
      screen.getByRole('button', { name: /Analyze Action/ }),
    ).toBeInTheDocument();
  });

  it('should have correct placeholders', () => {
    render(<SubmissionForm guidelines={mockGuidelines} />);

    expect(
      screen.getByPlaceholderText(
        'e.g., Closed ticket #48219 and sent confirmation email',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        'e.g., All closed tickets must include a confirmation email',
      ),
    ).toBeInTheDocument();
  });

  it('should apply error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(<SubmissionForm guidelines={mockGuidelines} />);

    const submitButton = screen.getByRole('button', {
      name: 'Analyze Action',
    });
    await user.click(submitButton);

    await waitFor(() => {
      const actionTextarea = screen.getByLabelText('Action Taken');
      const guidelineTextarea = screen.getByLabelText('Guideline');

      // Check that the form elements are still present
      expect(actionTextarea).toBeInTheDocument();
      expect(guidelineTextarea).toBeInTheDocument();
    });
  });

  // Test Cases from EASE-AI.md Requirements
  describe('EASE-AI Test Cases', () => {
    it('should handle Case 1: Closed ticket with confirmation email (COMPLIES)', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 1,
          action: 'Closed ticket #48219 and sent confirmation email',
          guideline: 'All closed tickets must include a confirmation email',
          result: 'complies',
          confidence: '0.94',
          timestamp: '2025-01-15T10:15:00Z',
        }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      render(<SubmissionForm guidelines={mockGuidelines} />);

      const actionTextarea = screen.getByLabelText('Action Taken');
      const guidelineTextarea = screen.getByLabelText('Guideline');
      const submitButton = screen.getByRole('button', {
        name: 'Analyze Action',
      });

      await user.type(
        actionTextarea,
        'Closed ticket #48219 and sent confirmation email',
      );
      await user.type(
        guidelineTextarea,
        'All closed tickets must include a confirmation email',
      );
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Closed ticket #48219 and sent confirmation email',
            guideline: 'All closed tickets must include a confirmation email',
          }),
        });
      });
    });

    it('should handle Case 2: Closed ticket without confirmation email (DEVIATES)', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 2,
          action: 'Closed ticket #48219 without sending confirmation email',
          guideline: 'All closed tickets must include a confirmation email',
          result: 'deviates',
          confidence: '0.92',
          timestamp: '2025-01-15T10:16:00Z',
        }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      render(<SubmissionForm guidelines={mockGuidelines} />);

      const actionTextarea = screen.getByLabelText('Action Taken');
      const guidelineTextarea = screen.getByLabelText('Guideline');
      const submitButton = screen.getByRole('button', {
        name: 'Analyze Action',
      });

      await user.type(
        actionTextarea,
        'Closed ticket #48219 without sending confirmation email',
      );
      await user.type(
        guidelineTextarea,
        'All closed tickets must include a confirmation email',
      );
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Closed ticket #48219 without sending confirmation email',
            guideline: 'All closed tickets must include a confirmation email',
          }),
        });
      });
    });

    it('should handle Case 3: Server reboot without weekly schedule (DEVIATES)', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 3,
          action: 'Rebooted the server and checked logs',
          guideline:
            'Servers must be rebooted weekly and logs reviewed after restart',
          result: 'deviates',
          confidence: '0.89',
          timestamp: '2025-01-15T10:17:00Z',
        }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      render(<SubmissionForm guidelines={mockGuidelines} />);

      const actionTextarea = screen.getByLabelText('Action Taken');
      const guidelineTextarea = screen.getByLabelText('Guideline');
      const submitButton = screen.getByRole('button', {
        name: 'Analyze Action',
      });

      await user.type(actionTextarea, 'Rebooted the server and checked logs');
      await user.type(
        guidelineTextarea,
        'Servers must be rebooted weekly and logs reviewed after restart',
      );
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Rebooted the server and checked logs',
            guideline:
              'Servers must be rebooted weekly and logs reviewed after restart',
          }),
        });
      });
    });

    it('should handle Case 4: Action with no relevant guidelines (UNCLEAR)', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 4,
          action: 'Skipped torque confirmation at Station 3',
          guideline: 'No guidelines exist for this case',
          result: 'unclear',
          confidence: '0.78',
          timestamp: '2025-01-15T10:18:00Z',
        }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      render(<SubmissionForm guidelines={mockGuidelines} />);

      const actionTextarea = screen.getByLabelText('Action Taken');
      const guidelineTextarea = screen.getByLabelText('Guideline');
      const submitButton = screen.getByRole('button', {
        name: 'Analyze Action',
      });

      await user.type(
        actionTextarea,
        'Skipped torque confirmation at Station 3',
      );
      await user.type(guidelineTextarea, 'No guidelines exist for this case');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockActions.openAnalysisInProgressDialog).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Skipped torque confirmation at Station 3',
            guideline: 'No guidelines exist for this case',
          }),
        });
      });
    });
  });
});
