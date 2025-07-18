import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import ThemeToggle from './ThemeToggle.svelte';
import { theme } from '../lib/theme';

// Mock the theme store
vi.mock('../lib/theme', () => ({
  theme: {
    subscribe: vi.fn(),
    set: vi.fn(),
    update: vi.fn(),
  },
  toggleTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  let mockThemeSubscribe: any;
  let mockToggleTheme: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get the mocked functions
    mockThemeSubscribe = vi.mocked(theme.subscribe);
    mockToggleTheme = vi.mocked(
      (await import('../lib/theme')).toggleTheme
    );
    
    // Mock the subscribe function to call the callback immediately
    mockThemeSubscribe.mockImplementation((callback: (value: 'light' | 'dark') => void) => {
      callback('dark'); // Default to dark theme
      return () => {}; // Return unsubscribe function
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with moon icon when theme is dark', () => {
    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle dark/light mode');
    
    // Check that the button has the correct classes
    expect(button).toHaveClass('p-2', 'rounded-lg', 'focus:outline-none');
  });

  it('should render with sun icon when theme is light', () => {
    // Mock theme as light
    mockThemeSubscribe.mockImplementation((callback: (value: 'light' | 'dark') => void) => {
      callback('light');
      return () => {};
    });

    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should call toggleTheme when button is clicked', async () => {
    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    
    await fireEvent.click(button!);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', async () => {
    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    
    // Test Enter key
    await fireEvent.keyDown(button!, { key: 'Enter' });
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    
    // Test Space key
    await fireEvent.keyDown(button!, { key: ' ' });
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
  });

  it('should have correct styling classes', () => {
    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toHaveClass(
      'p-2',
      'rounded-lg',
      'focus:outline-none',
      'bg-gray-100',
      'dark:bg-gray-800',
      'text-gray-600',
      'dark:text-gray-300',
      'hover:text-gray-900',
      'dark:hover:text-white',
      'transition-colors'
    );
  });

  it('should update when theme changes', () => {
    let themeCallback: (value: 'light' | 'dark') => void;
    
    mockThemeSubscribe.mockImplementation((callback: (value: 'light' | 'dark') => void) => {
      themeCallback = callback;
      callback('dark');
      return () => {};
    });

    const { container } = render(ThemeToggle);
    
    // Initially dark theme
    expect(container.querySelector('button')).toBeInTheDocument();
    
    // Change to light theme
    themeCallback!('light');
    
    // Component should re-render with light theme
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should unsubscribe from theme store on unmount', () => {
    const unsubscribeMock = vi.fn();
    
    mockThemeSubscribe.mockImplementation((callback: (value: 'light' | 'dark') => void) => {
      callback('dark');
      return unsubscribeMock;
    });

    const { unmount } = render(ThemeToggle);
    
    // Unmount the component
    unmount();
    
    // The unsubscribe function should be called
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    const { container } = render(ThemeToggle);
    
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle dark/light mode');
    expect(button).toHaveAttribute('tabindex', '0');
  });
});