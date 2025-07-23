export interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
	contactMethod: 'email' | 'phone' | 'chat';
	urgency: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ContactResponse {
	success: boolean;
	message?: string;
	error?: string;
	reference?: string;
}

export class ContactService {
	static async submitForm(data: ContactFormData): Promise<ContactResponse> {
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!response.ok) {
				return {
					success: false,
					error: result.error || 'An error occurred while submitting the form'
				};
			}

			return result;
		} catch (error) {
			console.error('Contact service error:', error);
			return {
				success: false,
				error: 'Network error. Please check your connection and try again.'
			};
		}
	}

	static validateForm(data: ContactFormData): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!data.name.trim()) {
			errors.push('Name is required');
		}

		if (!data.email.trim()) {
			errors.push('Email is required');
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(data.email)) {
				errors.push('Please enter a valid email address');
			}
		}

		if (!data.subject.trim()) {
			errors.push('Subject is required');
		}

		if (!data.message.trim()) {
			errors.push('Message is required');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}
}