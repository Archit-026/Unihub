
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestConsumer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

const renderTheme = () =>
  render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>
  );

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('uses the saved light theme from localStorage', () => {
    localStorage.setItem('unihub-theme', 'light');

    renderTheme();

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('uses the saved dark theme from localStorage', () => {
    localStorage.setItem('unihub-theme', 'dark');

    renderTheme();

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('uses the system dark preference when no theme is saved', () => {
    window.matchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    renderTheme();

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('toggles the theme from light to dark and saves it', () => {
    renderTheme();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Theme' }));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(localStorage.getItem('unihub-theme')).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('toggles the theme from dark to light and saves it', () => {
    localStorage.setItem('unihub-theme', 'dark');

    renderTheme();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Theme' }));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(localStorage.getItem('unihub-theme')).toBe('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('throws an error when useTheme is used outside ThemeProvider', () => {
    const InvalidConsumer = () => {
      useTheme();
      return null;
    };

    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<InvalidConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });
});
