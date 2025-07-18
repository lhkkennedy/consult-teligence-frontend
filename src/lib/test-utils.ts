import { vi } from 'vitest';
import type { Consultant, ContactInfo, Testimonial, CaseStudy } from './types';

/**
 * Creates a mock consultant object with default values
 */
export function createMockConsultant(overrides: Partial<Consultant> = {}): Consultant {
	const defaultConsultant: Consultant = {
		documentId: 'consultant-123',
		id: 1,
		firstName: 'John',
		lastName: 'Doe',
		location: 'New York, NY',
		company: 'Tech Corp',
		currentRole: 'Senior Consultant',
		functionalExpertise: ['Strategy', 'Operations'],
		geographicalExpertise: 'North America',
		countryExpertise: 'United States',
		rate: 250,
		bio: 'Experienced consultant with 10+ years in strategy and operations.',
		education: 'MBA from Harvard Business School',
		certifications: ['PMP', 'Six Sigma Black Belt'],
		languages: ['English', 'Spanish'],
		profileImage: 'https://example.com/profile.jpg',
		contactInfo: {
			email: 'john.doe@example.com',
			phone: '+1-555-0123',
			linkedin: 'https://linkedin.com/in/johndoe'
		},
		availability: 'Available',
		testimonials: [],
		caseStudies: []
	};

	return { ...defaultConsultant, ...overrides };
}

/**
 * Creates a mock contact info object
 */
export function createMockContactInfo(overrides: Partial<ContactInfo> = {}): ContactInfo {
	const defaultContactInfo: ContactInfo = {
		email: 'test@example.com',
		phone: '+1-555-0123',
		linkedin: 'https://linkedin.com/in/test'
	};

	return { ...defaultContactInfo, ...overrides };
}

/**
 * Creates a mock testimonial object
 */
export function createMockTestimonial(overrides: Partial<Testimonial> = {}): Testimonial {
	const defaultTestimonial: Testimonial = {
		id: 1,
		name: 'Happy Client',
		company: 'Big Corp',
		text: 'Excellent work on our project!'
	};

	return { ...defaultTestimonial, ...overrides };
}

/**
 * Creates a mock case study object
 */
export function createMockCaseStudy(overrides: Partial<CaseStudy> = {}): CaseStudy {
	const defaultCaseStudy: CaseStudy = {
		id: 1,
		title: 'Digital Transformation Project',
		description: 'Led a comprehensive digital transformation initiative for a Fortune 500 company.'
	};

	return { ...defaultCaseStudy, ...overrides };
}

/**
 * Creates multiple mock consultants with different data
 */
export function createMockConsultants(count: number): Consultant[] {
	const consultants: Consultant[] = [];

	for (let i = 0; i < count; i++) {
		consultants.push(
			createMockConsultant({
				documentId: `consultant-${i + 1}`,
				id: i + 1,
				firstName: `FirstName${i + 1}`,
				lastName: `LastName${i + 1}`,
				company: `Company${i + 1}`,
				rate: 200 + i * 50
			})
		);
	}

	return consultants;
}

/**
 * Mock localStorage implementation for tests
 */
export function createMockLocalStorage() {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
		get length() {
			return Object.keys(store).length;
		},
		key: (index: number) => {
			const keys = Object.keys(store);
			return keys[index] || null;
		}
	};
}

/**
 * Mock fetch implementation for tests
 */
export function createMockFetch() {
	return {
		mockResolvedValue: (value: any) => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(value)
			});
		},
		mockRejectedValue: (error: any) => {
			global.fetch = vi.fn().mockRejectedValue(error);
		},
		mockResolvedValueOnce: (value: any) => {
			global.fetch = vi.fn().mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(value)
			});
		},
		mockRejectedValueOnce: (error: any) => {
			global.fetch = vi.fn().mockRejectedValueOnce(error);
		}
	};
}

/**
 * Mock window.matchMedia for tests
 */
export function mockMatchMedia(matches: boolean = false) {
	if (typeof window !== 'undefined') {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: (query: string) => ({
				matches,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => {}
			})
		});
	} else {
		// In Node.js environment, create a global window mock
		global.window = {
			matchMedia: (query: string) => ({
				matches,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => {}
			})
		} as any;
	}
}

/**
 * Creates a mock DOM element for tests
 */
export function createMockElement(tagName: string = 'div') {
	const element = document.createElement(tagName);

	// Mock classList methods
	const classList = {
		add: vi.fn(),
		remove: vi.fn(),
		toggle: vi.fn(),
		contains: vi.fn()
	};

	Object.defineProperty(element, 'classList', {
		value: classList,
		writable: true
	});

	return element;
}

/**
 * Waits for a specified amount of time (useful for testing async operations)
 */
export function waitFor(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates a delay in async operations
 */
export async function mockDelay(ms: number = 100): Promise<void> {
	await waitFor(ms);
}

/**
 * Creates a mock event object
 */
export function createMockEvent(type: string, properties: Record<string, any> = {}) {
	const event = new Event(type);
	Object.assign(event, properties);
	return event;
}

/**
 * Mock console methods for tests
 */
export function mockConsole() {
	const originalConsole = { ...console };

	return {
		mock: () => {
			console.log = vi.fn();
			console.error = vi.fn();
			console.warn = vi.fn();
			console.info = vi.fn();
		},
		restore: () => {
			Object.assign(console, originalConsole);
		},
		getLogs: () => ({
			log: (console.log as any).mock.calls,
			error: (console.error as any).mock.calls,
			warn: (console.warn as any).mock.calls,
			info: (console.info as any).mock.calls
		})
	};
}

/**
 * Test data constants
 */
export const TEST_CONSTANTS = {
	MOCK_JWT_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
	MOCK_USER_ID: 1,
	MOCK_CONSULTANT_ID: 'consultant-123',
	MOCK_API_URL: 'http://localhost:1337',
	MOCK_PROFILE_IMAGE: 'https://example.com/profile.jpg',
	MOCK_LINKEDIN_URL: 'https://linkedin.com/in/test'
} as const;

/**
 * Common test assertions
 */
export const assertions = {
	isValidEmail: (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	},
	isValidUrl: (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	},
	isValidPhoneNumber: (phone: string) => {
		const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
		return phoneRegex.test(phone);
	}
};
