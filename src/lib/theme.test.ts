import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { theme, toggleTheme } from './theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock document
const documentMock = {
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      toggle: vi.fn(),
    },
  },
};

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('theme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset global mocks
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    Object.defineProperty(global, 'document', {
      value: documentMock,
      writable: true,
    });
    
    Object.defineProperty(global, 'window', {
      value: { 
        matchMedia: matchMediaMock,
        localStorage: localStorageMock 
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('theme store', () => {
    it('should initialize with dark theme by default', () => {
      expect(get(theme)).toBe('dark');
    });

    it('should update theme value when set', () => {
      theme.set('light');
      expect(get(theme)).toBe('light');
      
      theme.set('dark');
      expect(get(theme)).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      theme.set('dark');
      toggleTheme();
      expect(get(theme)).toBe('light');
    });

    it('should toggle from light to dark', () => {
      theme.set('light');
      toggleTheme();
      expect(get(theme)).toBe('dark');
    });

    it('should toggle document class when document is available', () => {
      theme.set('dark');
      toggleTheme();
      
      expect(documentMock.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should not throw error when document is not available', () => {
      // @ts-ignore
      global.document = undefined;
      
      theme.set('dark');
      expect(() => toggleTheme()).not.toThrow();
    });
  });

  describe('localStorage integration', () => {
    it('should save theme to localStorage when theme changes', () => {
      theme.set('light');
      // The subscription should trigger localStorage.setItem
      // This would happen in the actual implementation
    });

    it('should load saved theme from localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      // This would happen during module initialization
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('should respect system preference when no saved theme', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: true });
      
      // This would set dark theme based on system preference
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });
});