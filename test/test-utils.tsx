import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that can be extended with providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, {
    // Add any global providers here if needed
    ...options,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
