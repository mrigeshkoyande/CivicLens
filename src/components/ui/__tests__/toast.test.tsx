import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../toast';
import { useEffect } from 'react';

const TestComponent = ({ message, type }: { message: string; type?: "success" | "error" | "info" }) => {
  const { show } = useToast();
  
  useEffect(() => {
    show(message, type);
  }, [message, type, show]);

  return <div>Test Component</div>;
};

describe('ToastProvider and useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders a toast when show is called', () => {
    render(
      <ToastProvider>
        <TestComponent message="Test Toast Message" />
      </ToastProvider>
    );

    expect(screen.getByText('Test Toast Message')).toBeInTheDocument();
  });

  it('removes the toast after 3500ms', () => {
    render(
      <ToastProvider>
        <TestComponent message="Expiring Toast" />
      </ToastProvider>
    );

    expect(screen.getByText('Expiring Toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('Expiring Toast')).not.toBeInTheDocument();
  });

  it('renders correct styling and icon based on type', () => {
    const { unmount } = render(
      <ToastProvider>
        <TestComponent message="Success Toast" type="success" />
      </ToastProvider>
    );
    expect(screen.getByText('check_circle')).toBeInTheDocument();
    unmount();

    render(
      <ToastProvider>
        <TestComponent message="Error Toast" type="error" />
      </ToastProvider>
    );
    expect(screen.getByText('error')).toBeInTheDocument();
  });
});
