import { describe, it, expect } from 'vitest';
import type {
	Consultant,
	ContactInfo,
	Testimonial,
	CaseStudy,
	Region,
	Country,
	Specialty,
	SubSpecialty
} from './types';

describe('Types', () => {
	describe('Consultant interface', () => {
		it('should accept a valid consultant object', () => {
			const validConsultant: Consultant = {
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

			// If this compiles, the type is valid
			expect(validConsultant).toBeDefined();
			expect(validConsultant.documentId).toBe('consultant-123');
			expect(validConsultant.id).toBe(1);
			expect(validConsultant.firstName).toBe('John');
			expect(validConsultant.lastName).toBe('Doe');
			expect(validConsultant.functionalExpertise).toEqual(['Strategy', 'Operations']);
		});

		it('should accept consultant with empty arrays', () => {
			const consultantWithEmptyArrays: Consultant = {
				documentId: 'consultant-456',
				id: 2,
				firstName: 'Jane',
				lastName: 'Smith',
				location: 'San Francisco, CA',
				company: 'StartupCorp',
				currentRole: 'Consultant',
				functionalExpertise: [],
				geographicalExpertise: 'North America',
				countryExpertise: 'United States',
				rate: 200,
				bio: '',
				education: '',
				certifications: [],
				languages: [],
				profileImage: '',
				contactInfo: {
					email: 'jane.smith@example.com',
					phone: '',
					linkedin: ''
				},
				availability: 'Busy',
				testimonials: [],
				caseStudies: []
			};

			expect(consultantWithEmptyArrays).toBeDefined();
			expect(consultantWithEmptyArrays.functionalExpertise).toEqual([]);
			expect(consultantWithEmptyArrays.certifications).toEqual([]);
			expect(consultantWithEmptyArrays.languages).toEqual([]);
		});

		it('should accept consultant with multiple functional expertise', () => {
			const consultant: Consultant = {
				documentId: 'consultant-789',
				id: 3,
				firstName: 'Bob',
				lastName: 'Johnson',
				location: 'Chicago, IL',
				company: 'BigCorp',
				currentRole: 'Principal Consultant',
				functionalExpertise: ['Strategy', 'Operations', 'Technology', 'Finance'],
				geographicalExpertise: 'North America',
				countryExpertise: 'United States',
				rate: 350,
				bio: 'Multi-domain expert',
				education: 'PhD in Business Administration',
				certifications: ['PMP', 'CPA', 'Six Sigma Black Belt'],
				languages: ['English', 'French', 'German'],
				profileImage: 'https://example.com/bob.jpg',
				contactInfo: {
					email: 'bob.johnson@example.com',
					phone: '+1-555-0456',
					linkedin: 'https://linkedin.com/in/bobjohnson'
				},
				availability: 'Available',
				testimonials: [],
				caseStudies: []
			};

			expect(consultant.functionalExpertise).toHaveLength(4);
			expect(consultant.certifications).toHaveLength(3);
			expect(consultant.languages).toHaveLength(3);
		});
	});

	describe('ContactInfo interface', () => {
		it('should accept valid contact info', () => {
			const validContactInfo: ContactInfo = {
				email: 'test@example.com',
				phone: '+1-555-0123',
				linkedin: 'https://linkedin.com/in/test'
			};

			expect(validContactInfo).toBeDefined();
			expect(validContactInfo.email).toBe('test@example.com');
			expect(validContactInfo.phone).toBe('+1-555-0123');
			expect(validContactInfo.linkedin).toBe('https://linkedin.com/in/test');
		});

		it('should accept contact info with empty strings', () => {
			const emptyContactInfo: ContactInfo = {
				email: '',
				phone: '',
				linkedin: ''
			};

			expect(emptyContactInfo).toBeDefined();
			expect(emptyContactInfo.email).toBe('');
			expect(emptyContactInfo.phone).toBe('');
			expect(emptyContactInfo.linkedin).toBe('');
		});
	});

	describe('Testimonial interface', () => {
		it('should accept valid testimonial', () => {
			const validTestimonial: Testimonial = {
				id: 1,
				name: 'Client Name',
				company: 'Client Company',
				text: 'Great work!'
			};

			expect(validTestimonial).toBeDefined();
			expect(validTestimonial.id).toBe(1);
			expect(validTestimonial.name).toBe('Client Name');
			expect(validTestimonial.company).toBe('Client Company');
			expect(validTestimonial.text).toBe('Great work!');
		});

		it('should accept testimonial with empty text', () => {
			const emptyTestimonial: Testimonial = {
				id: 2,
				name: 'Another Client',
				company: 'Another Company',
				text: ''
			};

			expect(emptyTestimonial).toBeDefined();
			expect(emptyTestimonial.text).toBe('');
		});
	});

	describe('CaseStudy interface', () => {
		it('should accept valid case study', () => {
			const validCaseStudy: CaseStudy = {
				id: 1,
				title: 'Digital Transformation Project',
				description: 'Led a comprehensive digital transformation initiative...'
			};

			expect(validCaseStudy).toBeDefined();
			expect(validCaseStudy.id).toBe(1);
			expect(validCaseStudy.title).toBe('Digital Transformation Project');
			expect(validCaseStudy.description).toBe(
				'Led a comprehensive digital transformation initiative...'
			);
		});

		it('should accept case study with empty description', () => {
			const emptyCaseStudy: CaseStudy = {
				id: 2,
				title: 'Another Project',
				description: ''
			};

			expect(emptyCaseStudy).toBeDefined();
			expect(emptyCaseStudy.description).toBe('');
		});
	});

	describe('Region type', () => {
		it('should accept valid region values', () => {
			const validRegions: Region[] = [
				'North America',
				'South America',
				'Europe',
				'Africa',
				'Asia',
				'Middle East',
				'Oceania'
			];

			validRegions.forEach((region) => {
				const testRegion: Region = region;
				expect(testRegion).toBe(region);
			});
		});

		it('should work with region assignment', () => {
			let region: Region;

			region = 'North America';
			expect(region).toBe('North America');

			region = 'Europe';
			expect(region).toBe('Europe');

			region = 'Asia';
			expect(region).toBe('Asia');
		});
	});

	describe('Country, Specialty, and SubSpecialty types', () => {
		it('should accept string values for Country', () => {
			const country: Country = 'United States';
			expect(country).toBe('United States');
		});

		it('should accept string values for Specialty', () => {
			const specialty: Specialty = 'Strategy';
			expect(specialty).toBe('Strategy');
		});

		it('should accept string values for SubSpecialty', () => {
			const subSpecialty: SubSpecialty = 'Digital Strategy';
			expect(subSpecialty).toBe('Digital Strategy');
		});

		it('should accept empty strings', () => {
			const emptyCountry: Country = '';
			const emptySpecialty: Specialty = '';
			const emptySubSpecialty: SubSpecialty = '';

			expect(emptyCountry).toBe('');
			expect(emptySpecialty).toBe('');
			expect(emptySubSpecialty).toBe('');
		});
	});

	describe('Type compatibility', () => {
		it('should allow consultant with testimonials and case studies', () => {
			const consultant: Consultant = {
				documentId: 'consultant-with-content',
				id: 4,
				firstName: 'Alice',
				lastName: 'Wilson',
				location: 'Boston, MA',
				company: 'ConsultingFirm',
				currentRole: 'Senior Partner',
				functionalExpertise: ['Strategy'],
				geographicalExpertise: 'North America',
				countryExpertise: 'United States',
				rate: 400,
				bio: 'Senior consultant with proven track record',
				education: 'MBA from MIT',
				certifications: ['PMP'],
				languages: ['English'],
				profileImage: 'https://example.com/alice.jpg',
				contactInfo: {
					email: 'alice.wilson@example.com',
					phone: '+1-555-0789',
					linkedin: 'https://linkedin.com/in/alicewilson'
				},
				availability: 'Available',
				testimonials: [
					{
						id: 1,
						name: 'Happy Client',
						company: 'Big Corp',
						text: 'Excellent work on our strategy project!'
					}
				],
				caseStudies: [
					{
						id: 1,
						title: 'Market Entry Strategy',
						description: 'Developed comprehensive market entry strategy for Fortune 500 company.'
					}
				]
			};

			expect(consultant.testimonials).toHaveLength(1);
			expect(consultant.caseStudies).toHaveLength(1);
			expect(consultant.testimonials[0].name).toBe('Happy Client');
			expect(consultant.caseStudies[0].title).toBe('Market Entry Strategy');
		});
	});
});
