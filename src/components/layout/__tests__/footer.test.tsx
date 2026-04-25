import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

describe('Footer', () => {
  it('renders footer copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2024 CivicLens — Empowering Democracy')).toBeInTheDocument();
  });

  it('renders all footer links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });
});
