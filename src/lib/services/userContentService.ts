import type { TimelinePost, Property } from '../types';
import { user } from '../stores/authStore';
import { get } from 'svelte/store';

// Mock data storage (in a real app, this would be in a database)
let userPosts: TimelinePost[] = [];
let userProperties: Property[] = [];

export class UserContentService {
	/**
	 * Get all posts for the current user
	 */
	static async getUserPosts(): Promise<TimelinePost[]> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		return userPosts.filter((post) => post.person_id === currentUser.id?.toString());
	}

	/**
	 * Create a new post for the current user
	 */
	static async createPost(
		postData: Omit<TimelinePost, 'post_id' | 'person_id' | 'created_at'>
	): Promise<TimelinePost> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const newPost: TimelinePost = {
			...postData,
			post_id: `post_${Date.now()}`,
			person_id: currentUser.id?.toString() || '',
			created_at: new Date().toISOString(),
			reactions: [],
			comments: []
		};

		userPosts.push(newPost);
		return newPost;
	}

	/**
	 * Update an existing post
	 */
	static async updatePost(postId: string, updates: Partial<TimelinePost>): Promise<TimelinePost> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const postIndex = userPosts.findIndex(
			(post) => post.post_id === postId && post.person_id === currentUser.id?.toString()
		);

		if (postIndex === -1) {
			throw new Error('Post not found or access denied');
		}

		userPosts[postIndex] = { ...userPosts[postIndex], ...updates };
		return userPosts[postIndex];
	}

	/**
	 * Delete a post
	 */
	static async deletePost(postId: string): Promise<void> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const postIndex = userPosts.findIndex(
			(post) => post.post_id === postId && post.person_id === currentUser.id?.toString()
		);

		if (postIndex === -1) {
			throw new Error('Post not found or access denied');
		}

		userPosts.splice(postIndex, 1);
	}

	/**
	 * Get all properties for the current user
	 */
	static async getUserProperties(): Promise<Property[]> {
		// In a real app, this would fetch from your API with user authentication
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		return userProperties;
	}

	/**
	 * Create a new property for the current user
	 */
	static async createProperty(propertyData: Omit<Property, 'property_uid'>): Promise<Property> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const newProperty: Property = {
			...propertyData,
			property_uid: `prop_${Date.now()}`
		};

		userProperties.push(newProperty);
		return newProperty;
	}

	/**
	 * Update an existing property
	 */
	static async updateProperty(propertyId: string, updates: Partial<Property>): Promise<Property> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const propertyIndex = userProperties.findIndex(
			(property) => property.property_uid === propertyId
		);

		if (propertyIndex === -1) {
			throw new Error('Property not found');
		}

		userProperties[propertyIndex] = { ...userProperties[propertyIndex], ...updates };
		return userProperties[propertyIndex];
	}

	/**
	 * Delete a property
	 */
	static async deleteProperty(propertyId: string): Promise<void> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const propertyIndex = userProperties.findIndex(
			(property) => property.property_uid === propertyId
		);

		if (propertyIndex === -1) {
			throw new Error('Property not found');
		}

		userProperties.splice(propertyIndex, 1);
	}

	/**
	 * Get a specific post by ID
	 */
	static async getPostById(postId: string): Promise<TimelinePost | null> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const post = userPosts.find(
			(post) => post.post_id === postId && post.person_id === currentUser.id?.toString()
		);

		return post || null;
	}

	/**
	 * Get a specific property by ID
	 */
	static async getPropertyById(propertyId: string): Promise<Property | null> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const property = userProperties.find((property) => property.property_uid === propertyId);
		return property || null;
	}

	/**
	 * Get user's portfolio statistics
	 */
	static async getPortfolioStats(): Promise<{
		total_posts: number;
		total_properties: number;
		total_deal_size: number;
		average_irr: number;
	}> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const userPosts = await this.getUserPosts();
		const userProperties = await this.getUserProperties();

		const totalDealSize = userProperties.reduce((sum, prop) => sum + (prop.deal_size || 0), 0);
		const propertiesWithIRR = userProperties.filter((prop) => prop.irr !== undefined);
		const averageIRR =
			propertiesWithIRR.length > 0
				? propertiesWithIRR.reduce((sum, prop) => sum + (prop.irr || 0), 0) /
					propertiesWithIRR.length
				: 0;

		return {
			total_posts: userPosts.length,
			total_properties: userProperties.length,
			total_deal_size: totalDealSize,
			average_irr: averageIRR
		};
	}

	/**
	 * Upload image and return URL
	 * In a real app, this would upload to cloud storage
	 */
	static async uploadImage(file: File): Promise<string> {
		const currentUser = get(user);
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		// Simulate upload delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// In a real app, this would upload to S3, Cloudinary, etc.
		// For now, return a mock URL
		return URL.createObjectURL(file);
	}

	/**
	 * Validate post data
	 */
	static validatePostData(data: any): { isValid: boolean; errors: Record<string, string> } {
		const errors: Record<string, string> = {};

		if (!data.body_md?.trim()) {
			errors.body_md = 'Post content is required';
		}

		if (data.body_md && data.body_md.length > 1000) {
			errors.body_md = 'Post content must be less than 1000 characters';
		}

		if (!data.post_type) {
			errors.post_type = 'Post type is required';
		}

		if (!data.sentiment) {
			errors.sentiment = 'Sentiment is required';
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	}

	/**
	 * Validate property data
	 */
	static validatePropertyData(data: any): { isValid: boolean; errors: Record<string, string> } {
		const errors: Record<string, string> = {};

		if (!data.title?.trim()) {
			errors.title = 'Property title is required';
		}

		if (!data.address?.trim()) {
			errors.address = 'Property address is required';
		}

		if (!data.property_type) {
			errors.property_type = 'Property type is required';
		}

		if (data.deal_size && isNaN(Number(data.deal_size))) {
			errors.deal_size = 'Deal size must be a valid number';
		}

		if (data.irr && (isNaN(Number(data.irr)) || Number(data.irr) < 0 || Number(data.irr) > 100)) {
			errors.irr = 'IRR must be a valid percentage between 0 and 100';
		}

		if (
			data.completion_percentage &&
			(isNaN(Number(data.completion_percentage)) ||
				Number(data.completion_percentage) < 0 ||
				Number(data.completion_percentage) > 100)
		) {
			errors.completion_percentage = 'Completion percentage must be between 0 and 100';
		}

		if (!data.roles || data.roles.length === 0) {
			errors.roles = 'At least one role is required';
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	}
}
