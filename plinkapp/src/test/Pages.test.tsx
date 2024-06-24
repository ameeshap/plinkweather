import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import ErrorPage from '@/pages/ErrorPage';



/* Error Page */
// Mock the Navbar component if necessary
vi.mock('@/components/Navbar', () => ({
  default: () => <div>Mocked Navbar</div>
}));

describe('ErrorPage', () => {
  it('should render the error message', () => {
    render(<ErrorPage />);
    const errorMessage = screen.getByText('Error 404: Page Not Found!');
    expect(errorMessage).toBeInTheDocument();
  });
})


/* Location Page */

