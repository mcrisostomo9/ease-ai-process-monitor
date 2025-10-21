import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/header';

describe('Header Component', () => {
  it('should render the main title', () => {
    render(<Header />);
    expect(screen.getByText('Ease Process Monitor')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Header />);
    expect(
      screen.getByText(
        'Evaluate whether actions comply with established guidelines',
      ),
    ).toBeInTheDocument();
  });
});
