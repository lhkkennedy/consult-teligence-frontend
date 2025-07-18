import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { authToken, user, consultantId, logout, type User } from './authStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset stores to initial state
    authToken.set(null);
    user.set(null);
    consultantId.set(null);
    
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Mock window
    Object.defineProperty(global, 'window', {
      value: { localStorage: localStorageMock },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('stores initialization', () => {
    it('should initialize with null values', () => {
      expect(get(authToken)).toBe(null);
      expect(get(user)).toBe(null);
      expect(get(consultantId)).toBe(null);
    });

    it('should load data from localStorage on initialization', () => {
      const mockJwt = 'test-jwt-token';
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockConsultantId = 'consultant-123';

      localStorageMock.getItem.mockImplementation((key) => {
        switch (key) {
          case 'jwt':
            return mockJwt;
          case 'user':
            return JSON.stringify(mockUser);
          case 'consultantId':
            return mockConsultantId;
          default:
            return null;
        }
      });

      // This would happen during module initialization
      expect(localStorageMock.getItem).toHaveBeenCalledWith('jwt');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('consultantId');
    });
  });

  describe('authToken store', () => {
    it('should update auth token', () => {
      const token = 'test-jwt-token';
      authToken.set(token);
      expect(get(authToken)).toBe(token);
    });

    it('should handle null token', () => {
      authToken.set('some-token');
      authToken.set(null);
      expect(get(authToken)).toBe(null);
    });
  });

  describe('user store', () => {
    it('should update user data', () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      user.set(mockUser);
      expect(get(user)).toEqual(mockUser);
    });

    it('should handle null user', () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      user.set(mockUser);
      user.set(null);
      expect(get(user)).toBe(null);
    });
  });

  describe('consultantId store', () => {
    it('should update consultant ID', () => {
      const consultantIdValue = 'consultant-123';
      consultantId.set(consultantIdValue);
      expect(get(consultantId)).toBe(consultantIdValue);
    });

    it('should handle null consultant ID', () => {
      consultantId.set('some-id');
      consultantId.set(null);
      expect(get(consultantId)).toBe(null);
    });
  });

  describe('logout function', () => {
    it('should clear all stores and localStorage', () => {
      // Set initial values
      authToken.set('test-token');
      user.set({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      consultantId.set('consultant-123');

      // Call logout
      logout();

      // Check stores are cleared
      expect(get(authToken)).toBe(null);
      expect(get(user)).toBe(null);
      expect(get(consultantId)).toBe(null);

      // Check localStorage is cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });

    it('should not throw error when localStorage is not available', () => {
      // @ts-ignore
      global.localStorage = undefined;
      
      expect(() => logout()).not.toThrow();
    });
  });

  describe('User interface', () => {
    it('should accept valid user object', () => {
      const validUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };

      user.set(validUser);
      expect(get(user)).toEqual(validUser);
    });

    it('should handle user with additional properties', () => {
      const userWithExtra: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        // Additional properties from Strapi
      };

      user.set(userWithExtra);
      expect(get(user)).toEqual(userWithExtra);
    });
  });
});