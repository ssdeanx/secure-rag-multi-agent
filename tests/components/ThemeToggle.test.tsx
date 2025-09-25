/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
//@ts-ignore
import { render, screen, fireEvent } from '@testing-library/react'; // Corrected import path
import { ThemeToggle } from '../../components/ThemeToggle';
import { ThemeProvider } from 'next-themes';


// Mock useTheme to control behavior without relying on system/media queries
vi.mock('next-themes', () => {
  return {
    useTheme: () => ({ theme: mockThemeState.theme, setTheme: mockThemeState.setTheme }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  };
});

const mockThemeState = {
  theme: 'light',
  setTheme: vi.fn((val: string) => { mockThemeState.theme = val; })
};

// Because ThemeToggle has a mounted guard, we need to advance through the effect cycle
function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockThemeState.theme = 'light';
    mockThemeState.setTheme.mockClear();
  });

  it('renders the switch and starts unchecked in light mode', async () => {
    renderWithProvider();
    const toggle = await screen.findByRole('switch', { name: /toggle theme/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles to dark mode when switched on', async () => {
  renderWithProvider();
  const toggle = await screen.findByRole('switch', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(mockThemeState.setTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles back to light mode when already dark', async () => {
    mockThemeState.theme = 'dark';
  renderWithProvider();
  const toggle = await screen.findByRole('switch', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(mockThemeState.setTheme).toHaveBeenCalledWith('light');
  });
});
