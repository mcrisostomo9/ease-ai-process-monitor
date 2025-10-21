import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveGuidelineDialog } from '@/components/save-guideline-dialog';

// Mock the store
vi.mock('@/lib/store', () => ({
  useSubmissionsActions: () => ({
    updateGuidelineName: vi.fn(),
    closeSaveDialog: vi.fn(),
    addGuideline: vi.fn(),
    clearGuidelineName: vi.fn(),
  }),
  useShowSaveDialog: () => true,
  useGuidelineName: () => 'Test Guideline',
}));

// Mock document.getElementById for textarea access
const mockTextarea = {
  value: 'Test guideline text content',
};

describe('SaveGuidelineDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(document, 'getElementById').mockReturnValue(
      mockTextarea as HTMLTextAreaElement,
    );
  });

  it('should render when dialog is open', () => {
    render(<SaveGuidelineDialog />);

    expect(
      screen.getByRole('heading', { name: 'Save Guideline' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Give this guideline a name so you can reuse it later'),
    ).toBeInTheDocument();
  });

  it('should display guideline name input', () => {
    render(<SaveGuidelineDialog />);

    const nameInput = screen.getByLabelText('Guideline Name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('Test Guideline');
  });

  it('should display guideline text preview', () => {
    render(<SaveGuidelineDialog />);

    expect(screen.getByText('Guideline Text')).toBeInTheDocument();
    expect(screen.getByText('Test guideline text content')).toBeInTheDocument();
  });

  it('should enable save button when both name and text are provided', () => {
    render(<SaveGuidelineDialog />);

    const saveButton = screen.getByRole('button', { name: 'Save Guideline' });
    expect(saveButton).not.toBeDisabled();
  });

  it('should disable save button when guideline text is empty', () => {
    mockTextarea.value = '';

    render(<SaveGuidelineDialog />);

    const saveButton = screen.getByRole('button', { name: 'Save Guideline' });
    expect(saveButton).toBeDisabled();
  });

  it('should display placeholder text for guideline name input', () => {
    render(<SaveGuidelineDialog />);

    const nameInput = screen.getByPlaceholderText(
      'e.g., Ticket Closure Policy',
    );
    expect(nameInput).toBeInTheDocument();
  });

  it('should show "No guideline text" when textarea value is empty', () => {
    mockTextarea.value = '';

    render(<SaveGuidelineDialog />);

    expect(screen.getByText('No guideline text')).toBeInTheDocument();
  });
});
