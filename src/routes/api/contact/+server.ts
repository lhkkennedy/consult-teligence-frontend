import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { name, email, subject, message, contactMethod, urgency } = body;

		// Basic validation
		if (!name || !email || !subject || !message) {
			return json(
				{ 
					success: false, 
					error: 'Missing required fields' 
				}, 
				{ status: 400 }
			);
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json(
				{ 
					success: false, 
					error: 'Invalid email format' 
				}, 
				{ status: 400 }
			);
		}

		// Here you would typically:
		// 1. Save to database
		// 2. Send email notification
		// 3. Create ticket in support system
		// 4. Log the contact request

		// For now, we'll simulate a successful submission
		console.log('Contact form submission:', {
			name,
			email,
			subject,
			message,
			contactMethod,
			urgency,
			timestamp: new Date().toISOString()
		});

		// Simulate processing delay
		await new Promise(resolve => setTimeout(resolve, 1000));

		return json({
			success: true,
			message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
			reference: `CON-${Date.now()}`
		});

	} catch (error) {
		console.error('Contact form error:', error);
		return json(
			{ 
				success: false, 
				error: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
};