import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { login, register, clearAuthState } from './auth';
import { authToken, user, consultantId } from './stores/authStore';

// Mock the environment variable
vi.mock('$env/static/public', () => ({
  env: {
    VITE_STRAPI_URL: 'http://localhost:1337'
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock fetch
const fetchMock = vi.fn();

describe('auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset stores
    authToken.set(null);
    user.set(null);
    consultantId.set(null);
    
    // Mock global fetch
    global.fetch = fetchMock;
    
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Mock import.meta.env
    vi.stubEnv('VITE_STRAPI_URL', 'http://localhost:1337');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('clearAuthState', () => {
    it('should clear all auth stores and localStorage', () => {
      // Set initial values
      authToken.set('test-token');
      user.set({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      consultantId.set('consultant-123');

      // Call clearAuthState
      clearAuthState();

      // Check stores are cleared
      expect(get(authToken)).toBe(null);
      expect(get(user)).toBe(null);
      expect(get(consultantId)).toBe(null);

      // Check localStorage is cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('consultantId');
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockJwt = 'test-jwt-token';
      const mockConsultantId = 'consultant-123';

      // Mock successful login response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          jwt: mockJwt,
          user: mockUser,
        }),
      });

      // Mock consultant fetch response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          data: [{
            documentId: mockConsultantId,
          }],
        }),
      });

      const result = await login('testuser', 'password123');

      expect(result).toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:1337/api/auth/local',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: 'testuser',
            password: 'password123',
          }),
        }
      );
    });

    it('should handle login failure', async () => {
      const mockError = {
        error: {
          message: 'Invalid credentials',
        },
      };

      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockError),
      });

      const result = await login('testuser', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });

    it('should handle login failure without error message', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({}),
      });

      const result = await login('testuser', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: 'Login failed',
      });
    });

    it('should handle consultant fetch failure gracefully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockJwt = 'test-jwt-token';

      // Mock successful login response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          jwt: mockJwt,
          user: mockUser,
        }),
      });

      // Mock consultant fetch failure (empty response)
      fetchMock.mockResolvedValue({
        json: () => Promise.resolve({
          data: [],
        }),
      });

      const result = await login('testuser', 'password123');

      expect(result).toEqual({ success: true });
      expect(get(consultantId)).toBe(null);
    });

    it('should retry consultant fetch on failure', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockJwt = 'test-jwt-token';
      const mockConsultantId = 'consultant-123';

      // Mock successful login response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          jwt: mockJwt,
          user: mockUser,
        }),
      });

      // Mock consultant fetch - first call fails, second succeeds
      fetchMock
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ data: [] }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({
            data: [{ documentId: mockConsultantId }],
          }),
        });

      const result = await login('testuser', 'password123');

      expect(result).toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledTimes(3); // login + 2 consultant fetches
    });
  });

  describe('register', () => {
    it('should successfully register with valid data', async () => {
      const mockUser = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
      };
      const mockJwt = 'test-jwt-token';
      const mockConsultantId = 'consultant-456';

      // Mock successful registration response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          jwt: mockJwt,
          user: mockUser,
        }),
      });

      // Mock consultant fetch response
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({
          data: [{
            documentId: mockConsultantId,
          }],
        }),
      });

      const result = await register('newuser', 'new@example.com', 'password123');

      expect(result).toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:1337/api/auth/local/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'newuser',
            email: 'new@example.com',
            password: 'password123',
          }),
        }
      );
    });

    it('should handle registration failure', async () => {
      const mockError = {
        error: {
          message: 'Username already taken',
        },
      };

      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockError),
      });

      const result = await register('existinguser', 'existing@example.com', 'password123');

      expect(result).toEqual({
        success: false,
        error: 'Username already taken',
      });
    });

    it('should handle registration failure without error message', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({}),
      });

      const result = await register('newuser', 'new@example.com', 'password123');

      expect(result).toEqual({
        success: false,
        error: 'Registration failed',
      });
    });
  });

  describe('error handling', () => {
    it('should handle network errors in login', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      await expect(login('testuser', 'password123')).rejects.toThrow('Network error');
    });

    it('should handle network errors in register', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      await expect(register('newuser', 'new@example.com', 'password123')).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(login('testuser', 'password123')).rejects.toThrow('Invalid JSON');
    });
  });
});