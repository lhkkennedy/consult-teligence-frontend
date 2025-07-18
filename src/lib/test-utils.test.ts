import { describe, it, expect, vi } from 'vitest';
import {
  createMockConsultant,
  createMockContactInfo,
  createMockTestimonial,
  createMockCaseStudy,
  createMockConsultants,
  createMockLocalStorage,
  mockMatchMedia,
  waitFor,
  mockDelay,
  createMockEvent,
  assertions,
  TEST_CONSTANTS,
} from './test-utils';

describe('Test Utils', () => {
  describe('createMockConsultant', () => {
    it('should create a consultant with default values', () => {
      const consultant = createMockConsultant();
      
      expect(consultant.documentId).toBe('consultant-123');
      expect(consultant.firstName).toBe('John');
      expect(consultant.lastName).toBe('Doe');
      expect(consultant.company).toBe('Tech Corp');
      expect(consultant.rate).toBe(250);
      expect(consultant.functionalExpertise).toEqual(['Strategy', 'Operations']);
    });

    it('should override default values with provided overrides', () => {
      const consultant = createMockConsultant({
        firstName: 'Jane',
        lastName: 'Smith',
        rate: 300,
        functionalExpertise: ['Technology'],
      });
      
      expect(consultant.firstName).toBe('Jane');
      expect(consultant.lastName).toBe('Smith');
      expect(consultant.rate).toBe(300);
      expect(consultant.functionalExpertise).toEqual(['Technology']);
      // Other values should remain default
      expect(consultant.company).toBe('Tech Corp');
    });

    it('should create consultant with nested object overrides', () => {
      const consultant = createMockConsultant({
        contactInfo: {
          email: 'custom@example.com',
          phone: '+1-555-9999',
          linkedin: 'https://linkedin.com/in/custom',
        },
      });
      
      expect(consultant.contactInfo.email).toBe('custom@example.com');
      expect(consultant.contactInfo.phone).toBe('+1-555-9999');
      expect(consultant.contactInfo.linkedin).toBe('https://linkedin.com/in/custom');
    });
  });

  describe('createMockContactInfo', () => {
    it('should create contact info with default values', () => {
      const contactInfo = createMockContactInfo();
      
      expect(contactInfo.email).toBe('test@example.com');
      expect(contactInfo.phone).toBe('+1-555-0123');
      expect(contactInfo.linkedin).toBe('https://linkedin.com/in/test');
    });

    it('should override default values', () => {
      const contactInfo = createMockContactInfo({
        email: 'custom@example.com',
        phone: '+1-555-9999',
      });
      
      expect(contactInfo.email).toBe('custom@example.com');
      expect(contactInfo.phone).toBe('+1-555-9999');
      expect(contactInfo.linkedin).toBe('https://linkedin.com/in/test');
    });
  });

  describe('createMockTestimonial', () => {
    it('should create testimonial with default values', () => {
      const testimonial = createMockTestimonial();
      
      expect(testimonial.id).toBe(1);
      expect(testimonial.name).toBe('Happy Client');
      expect(testimonial.company).toBe('Big Corp');
      expect(testimonial.text).toBe('Excellent work on our project!');
    });

    it('should override default values', () => {
      const testimonial = createMockTestimonial({
        id: 2,
        name: 'Another Client',
        text: 'Great service!',
      });
      
      expect(testimonial.id).toBe(2);
      expect(testimonial.name).toBe('Another Client');
      expect(testimonial.text).toBe('Great service!');
      expect(testimonial.company).toBe('Big Corp');
    });
  });

  describe('createMockCaseStudy', () => {
    it('should create case study with default values', () => {
      const caseStudy = createMockCaseStudy();
      
      expect(caseStudy.id).toBe(1);
      expect(caseStudy.title).toBe('Digital Transformation Project');
      expect(caseStudy.description).toBe('Led a comprehensive digital transformation initiative for a Fortune 500 company.');
    });

    it('should override default values', () => {
      const caseStudy = createMockCaseStudy({
        id: 2,
        title: 'Custom Project',
        description: 'Custom description',
      });
      
      expect(caseStudy.id).toBe(2);
      expect(caseStudy.title).toBe('Custom Project');
      expect(caseStudy.description).toBe('Custom description');
    });
  });

  describe('createMockConsultants', () => {
    it('should create the specified number of consultants', () => {
      const consultants = createMockConsultants(3);
      
      expect(consultants).toHaveLength(3);
      expect(consultants[0].documentId).toBe('consultant-1');
      expect(consultants[1].documentId).toBe('consultant-2');
      expect(consultants[2].documentId).toBe('consultant-3');
    });

    it('should create consultants with unique data', () => {
      const consultants = createMockConsultants(2);
      
      expect(consultants[0].id).toBe(1);
      expect(consultants[1].id).toBe(2);
      expect(consultants[0].firstName).toBe('FirstName1');
      expect(consultants[1].firstName).toBe('FirstName2');
      expect(consultants[0].rate).toBe(200);
      expect(consultants[1].rate).toBe(250);
    });

    it('should handle zero count', () => {
      const consultants = createMockConsultants(0);
      expect(consultants).toHaveLength(0);
    });
  });

  describe('createMockLocalStorage', () => {
    it('should implement localStorage interface', () => {
      const localStorage = createMockLocalStorage();
      
      expect(localStorage.getItem('test')).toBe(null);
      
      localStorage.setItem('test', 'value');
      expect(localStorage.getItem('test')).toBe('value');
      
      localStorage.removeItem('test');
      expect(localStorage.getItem('test')).toBe(null);
    });

    it('should handle clear operation', () => {
      const localStorage = createMockLocalStorage();
      
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      expect(localStorage.length).toBe(2);
      
      localStorage.clear();
      expect(localStorage.length).toBe(0);
      expect(localStorage.getItem('key1')).toBe(null);
    });

    it('should handle key operation', () => {
      const localStorage = createMockLocalStorage();
      
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      expect(localStorage.key(0)).toBe('key1');
      expect(localStorage.key(1)).toBe('key2');
      expect(localStorage.key(2)).toBe(null);
    });
  });

  describe('mockMatchMedia', () => {
    it('should mock matchMedia with default values', () => {
      mockMatchMedia();
      
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      expect(mediaQuery.matches).toBe(false);
      expect(mediaQuery.media).toBe('(max-width: 768px)');
    });

    it('should mock matchMedia with custom matches value', () => {
      mockMatchMedia(true);
      
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      expect(mediaQuery.matches).toBe(true);
    });
  });

  describe('waitFor', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await waitFor(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow for some timing variance
    });
  });

  describe('mockDelay', () => {
    it('should delay with default time', async () => {
      const start = Date.now();
      await mockDelay();
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(90);
    });

    it('should delay with custom time', async () => {
      const start = Date.now();
      await mockDelay(50);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('createMockEvent', () => {
    it('should create event with default properties', () => {
      const event = createMockEvent('click');
      
      expect(event.type).toBe('click');
    });

    it('should create event with custom properties', () => {
      const event = createMockEvent('keydown', { key: 'Enter', ctrlKey: true });
      
      expect(event.type).toBe('keydown');
      expect((event as any).key).toBe('Enter');
      expect((event as any).ctrlKey).toBe(true);
    });
  });

  describe('assertions', () => {
    describe('isValidEmail', () => {
      it('should validate correct email addresses', () => {
        expect(assertions.isValidEmail('test@example.com')).toBe(true);
        expect(assertions.isValidEmail('user.name@domain.co.uk')).toBe(true);
        expect(assertions.isValidEmail('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(assertions.isValidEmail('invalid-email')).toBe(false);
        expect(assertions.isValidEmail('test@')).toBe(false);
        expect(assertions.isValidEmail('@example.com')).toBe(false);
        expect(assertions.isValidEmail('test@example')).toBe(false);
      });
    });

    describe('isValidUrl', () => {
      it('should validate correct URLs', () => {
        expect(assertions.isValidUrl('https://example.com')).toBe(true);
        expect(assertions.isValidUrl('http://example.com')).toBe(true);
        expect(assertions.isValidUrl('https://example.com/path')).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(assertions.isValidUrl('invalid-url')).toBe(false);
        expect(assertions.isValidUrl('example.com')).toBe(false);
        expect(assertions.isValidUrl('')).toBe(false);
      });
    });

    describe('isValidPhoneNumber', () => {
      it('should validate correct phone numbers', () => {
        expect(assertions.isValidPhoneNumber('+1-555-0123')).toBe(true);
        expect(assertions.isValidPhoneNumber('555-0123')).toBe(true);
        expect(assertions.isValidPhoneNumber('+1 (555) 012-3456')).toBe(true);
        expect(assertions.isValidPhoneNumber('5550123')).toBe(true);
      });

      it('should reject invalid phone numbers', () => {
        expect(assertions.isValidPhoneNumber('abc-def-ghij')).toBe(false);
        expect(assertions.isValidPhoneNumber('555-abc-1234')).toBe(false);
        expect(assertions.isValidPhoneNumber('')).toBe(false);
      });
    });
  });

  describe('TEST_CONSTANTS', () => {
    it('should have all required constants', () => {
      expect(TEST_CONSTANTS.MOCK_JWT_TOKEN).toBeDefined();
      expect(TEST_CONSTANTS.MOCK_USER_ID).toBe(1);
      expect(TEST_CONSTANTS.MOCK_CONSULTANT_ID).toBe('consultant-123');
      expect(TEST_CONSTANTS.MOCK_API_URL).toBe('http://localhost:1337');
      expect(TEST_CONSTANTS.MOCK_PROFILE_IMAGE).toBe('https://example.com/profile.jpg');
      expect(TEST_CONSTANTS.MOCK_LINKEDIN_URL).toBe('https://linkedin.com/in/test');
    });

    it('should have valid JWT token format', () => {
      expect(TEST_CONSTANTS.MOCK_JWT_TOKEN).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/);
    });

    it('should have valid URLs', () => {
      expect(assertions.isValidUrl(TEST_CONSTANTS.MOCK_API_URL)).toBe(true);
      expect(assertions.isValidUrl(TEST_CONSTANTS.MOCK_PROFILE_IMAGE)).toBe(true);
      expect(assertions.isValidUrl(TEST_CONSTANTS.MOCK_LINKEDIN_URL)).toBe(true);
    });
  });
});