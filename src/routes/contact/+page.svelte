<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ContactService, type ContactFormData } from '$lib/services/contactService';
	import ContactInfoCard from '../components/ContactInfoCard.svelte';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Send from '@lucide/svelte/icons/send';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Twitter from '@lucide/svelte/icons/twitter';

	let isVisible = false;
	let formData: ContactFormData = {
		name: '',
		email: '',
		subject: '',
		message: '',
		contactMethod: 'email',
		urgency: 'normal'
	};
	let isSubmitting = false;
	let isSubmitted = false;
	let expandedFaq = -1;
	let formErrors: string[] = [];
	let showErrors = false;

	const faqs = [
		{
			question: "How do I connect with a real estate expert?",
			answer: "You can browse our expert directory, use the search filters to find specialists in your area, or contact us directly and we'll match you with the right professional for your needs."
		},
		{
			question: "What are the consultation rates?",
			answer: "Rates vary by expert and project scope. Most experts offer free initial consultations, with detailed project rates ranging from $150-$500 per hour depending on expertise and location."
		},
		{
			question: "How quickly can I get a response?",
			answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please select 'Urgent' in your contact form and we'll prioritize your request."
		},
		{
			question: "Do you offer international consulting?",
			answer: "Yes! Our network spans 190 countries with experts in every major real estate market. We can connect you with local professionals who understand regional regulations and market conditions."
		},
		{
			question: "How do I become an expert on your platform?",
			answer: "We have a rigorous vetting process for experts. Please contact us with your credentials, experience, and areas of expertise. We'll review your application and get back to you within 5-7 business days."
		}
	];

	const contactMethods = [
		{
			icon: Mail,
			title: "Email Us",
			description: "Send us a detailed message",
			value: "email",
			details: "info@consulteligence.com"
		},
		{
			icon: Phone,
			title: "Call Us",
			description: "Speak with our team directly",
			value: "phone",
			details: "+1 (555) 123-4567"
		},
		{
			icon: MessageCircle,
			title: "Live Chat",
			description: "Get instant support",
			value: "chat",
			details: "Available 24/7"
		}
	];

	const urgencyLevels = [
		{ value: 'low', label: 'Low Priority', description: 'General inquiry' },
		{ value: 'normal', label: 'Normal Priority', description: 'Standard consultation' },
		{ value: 'high', label: 'High Priority', description: 'Urgent matter' },
		{ value: 'urgent', label: 'Urgent', description: 'Immediate attention needed' }
	];

	async function handleSubmit() {
		// Validate form
		const validation = ContactService.validateForm(formData);
		if (!validation.isValid) {
			formErrors = validation.errors;
			showErrors = true;
			return;
		}

		showErrors = false;
		isSubmitting = true;
		
		try {
			const result = await ContactService.submitForm(formData);

			if (result.success) {
				isSubmitted = true;
				formData = { name: '', email: '', subject: '', message: '', contactMethod: 'email', urgency: 'normal' };
			} else {
				formErrors = [result.error || 'An error occurred while submitting the form'];
				showErrors = true;
			}
		} catch (error) {
			console.error('Form submission error:', error);
			formErrors = ['An unexpected error occurred. Please try again.'];
			showErrors = true;
		} finally {
			isSubmitting = false;
		}
	}

	function toggleFaq(index: number) {
		expandedFaq = expandedFaq === index ? -1 : index;
	}

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 100);
	});
</script>

<svelte:head>
	<title>Contact Us - Consulteligence</title>
	<meta name="description" content="Get in touch with our team for expert real estate consulting, support, or partnership opportunities." />
</svelte:head>

<main class="flex-grow">
	<!-- Hero Section -->
	<section class="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-primary-bg via-secondary-bg to-accent-purple flex items-center justify-center">
		<!-- Animated background elements -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute top-20 left-10 w-20 h-20 bg-accent-purple/20 rounded-full blur-xl animate-pulse"></div>
			<div class="absolute top-40 right-20 w-32 h-32 bg-accent-teal/20 rounded-full blur-xl animate-pulse delay-1000"></div>
			<div class="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-pink/20 rounded-full blur-xl animate-pulse delay-2000"></div>
		</div>

		<div class="relative z-10 text-center px-6">
			{#if isVisible}
				<div in:fly={{ y: 50, duration: 800, easing: quintOut }} out:fade>
					<h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
						Get in Touch
					</h1>
				</div>

				<div in:fly={{ y: 50, duration: 800, delay: 200, easing: quintOut }} out:fade>
					<p class="mx-auto max-w-3xl text-xl md:text-2xl text-[#A0AEC0] leading-relaxed mb-8">
						Ready to connect with real estate experts worldwide? We're here to help you find the right professional for your project.
					</p>
				</div>

				<div in:fly={{ y: 50, duration: 800, delay: 400, easing: quintOut }} out:fade>
					<div class="flex flex-wrap justify-center gap-4">
						<div class="flex items-center text-white">
							<Mail class="w-5 h-5 mr-2" />
							<span>info@consulteligence.com</span>
						</div>
						<div class="flex items-center text-white">
							<Phone class="w-5 h-5 mr-2" />
							<span>+1 (555) 123-4567</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Contact Methods Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Choose Your Preferred Contact Method
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					We offer multiple ways to get in touch. Select the method that works best for you.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
				{#each contactMethods as method, index}
					<ContactInfoCard
						icon={method.icon}
						title={method.title}
						description={method.description}
						details={method.details}
						isClickable={true}
						isSelected={formData.contactMethod === method.value}
						on:click={() => formData.contactMethod = method.value}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Form Section -->
	<section class="py-20 bg-gradient-to-b from-[#1E2130] to-primary-bg">
		<div class="container mx-auto px-6">
			<div class="max-w-4xl mx-auto">
				<div class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Send Us a Message
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						Tell us about your project and we'll connect you with the right expert.
					</p>
				</div>

				{#if isSubmitted}
					<div class="expert-card text-center">
						<CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
						<h3 class="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
						<p class="text-[#A0AEC0] mb-6">We'll get back to you within 24 hours.</p>
						<button 
							class="btn btn-primary"
							on:click={() => isSubmitted = false}
						>
							Send Another Message
						</button>
					</div>
				{:else}
					<form on:submit|preventDefault={handleSubmit} class="expert-card">
						{#if showErrors && formErrors.length > 0}
							<div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
								<div class="text-red-400 font-medium mb-2">Please fix the following errors:</div>
								<ul class="text-red-300 text-sm space-y-1">
									{#each formErrors as error}
										<li>• {error}</li>
									{/each}
								</ul>
							</div>
						{/if}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label for="name" class="block text-white font-medium mb-2">Full Name *</label>
								<input
									id="name"
									type="text"
									bind:value={formData.name}
									required
									class="form-input w-full"
									placeholder="Enter your full name"
								/>
							</div>
							<div>
								<label for="email" class="block text-white font-medium mb-2">Email Address *</label>
								<input
									id="email"
									type="email"
									bind:value={formData.email}
									required
									class="form-input w-full"
									placeholder="Enter your email address"
								/>
							</div>
						</div>

						<div class="mb-6">
							<label for="subject" class="block text-white font-medium mb-2">Subject *</label>
							<input
								id="subject"
								type="text"
								bind:value={formData.subject}
								required
								class="form-input w-full"
								placeholder="Brief description of your inquiry"
							/>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label class="block text-white font-medium mb-2">Preferred Contact Method</label>
								<select bind:value={formData.contactMethod} class="form-select w-full">
									{#each contactMethods as method}
										<option value={method.value}>{method.title}</option>
									{/each}
								</select>
							</div>
							<div>
								<label class="block text-white font-medium mb-2">Urgency Level</label>
								<select bind:value={formData.urgency} class="form-select w-full">
									{#each urgencyLevels as level}
										<option value={level.value}>{level.label}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="mb-8">
							<label for="message" class="block text-white font-medium mb-2">Message *</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="form-input w-full resize-none"
								placeholder="Please describe your project, requirements, and any specific questions you have..."
							></textarea>
						</div>

						<div class="text-center">
							<button
								type="submit"
								disabled={isSubmitting}
								class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isSubmitting}
									<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Sending...
								{:else}
									<Send class="w-5 h-5 mr-2" />
									Send Message
								{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</section>

	<!-- Office Locations Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Our Global Offices
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					We have offices and partners around the world to serve you better.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<ContactInfoCard
					icon={MapPin}
					title="New York"
					description="Our main office in the heart of Manhattan"
					details="123 Real Estate Avenue<br>New York, NY 10001"
					actionText="Get Directions"
					actionLink="https://maps.google.com"
					showTimezone={true}
					timezone="America/New_York"
					timezoneLabel="EST"
				/>
				<ContactInfoCard
					icon={MapPin}
					title="London"
					description="European headquarters in the financial district"
					details="456 Property Street<br>London, UK SW1A 1AA"
					actionText="Get Directions"
					actionLink="https://maps.google.com"
					showTimezone={true}
					timezone="Europe/London"
					timezoneLabel="GMT"
				/>
				<ContactInfoCard
					icon={MapPin}
					title="Singapore"
					description="Asia-Pacific regional office"
					details="789 Marina Bay<br>Singapore 018956"
					actionText="Get Directions"
					actionLink="https://maps.google.com"
					showTimezone={true}
					timezone="Asia/Singapore"
					timezoneLabel="SGT"
				/>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
		<div class="container mx-auto px-6">
			<div class="max-w-4xl mx-auto">
				<div class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Frequently Asked Questions
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						Find answers to common questions about our services and platform.
					</p>
				</div>

				<div class="space-y-4">
					{#each faqs as faq, index}
						<div class="expert-card">
							<button
								class="w-full flex items-center justify-between text-left"
								on:click={() => toggleFaq(index)}
							>
								<h3 class="text-lg font-semibold text-white pr-4">{faq.question}</h3>
								<svelte:component this={expandedFaq === index ? ChevronUp : ChevronDown} class="w-5 h-5 text-accent-teal flex-shrink-0" />
							</button>
							{#if expandedFaq === index}
								<div in:fly={{ y: -10, duration: 300 }} class="mt-4 pt-4 border-t border-[#2D3748]">
									<p class="text-[#A0AEC0] leading-relaxed">{faq.answer}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Social Media Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6 text-center">
			<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
				Connect With Us
			</h2>
			<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto mb-12">
				Follow us on social media for the latest updates, market insights, and expert tips.
			</p>

			<div class="flex justify-center space-x-8">
				<a
					href="https://facebook.com/consulteligence"
					target="_blank"
					rel="noopener"
					class="group p-4 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				>
					<Facebook class="w-8 h-8 text-white" />
				</a>
				<a
					href="https://instagram.com/consulteligence"
					target="_blank"
					rel="noopener"
					class="group p-4 bg-gradient-to-r from-accent-pink to-accent-coral rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				>
					<Instagram class="w-8 h-8 text-white" />
				</a>
				<a
					href="https://linkedin.com/company/consulteligence"
					target="_blank"
					rel="noopener"
					class="group p-4 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				>
					<Linkedin class="w-8 h-8 text-white" />
				</a>
				<a
					href="https://twitter.com/consulteligence"
					target="_blank"
					rel="noopener"
					class="group p-4 bg-gradient-to-r from-accent-teal to-accent-aqua rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				>
					<Twitter class="w-8 h-8 text-white" />
				</a>
			</div>
		</div>
	</section>
</main>