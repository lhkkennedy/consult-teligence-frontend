import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ExpertSearchForm from './ExpertSearchForm.svelte';
import type { SearchFilters } from '../lib/types';

// Mock the Lucide icons
vi.mock('@lucide/svelte/icons/search', () => ({
	default: {
		render: () => '<svg data-testid="search-icon"></svg>'
	}
}));

// Mock the mock data
vi.mock('../lib/mockData.ts', () => ({
	regions: ['North America', 'Europe', 'Asia'],
	countries: {
		'North America': ['United States', 'Canada', 'Mexico'],
		Europe: ['United Kingdom', 'Germany', 'France'],
		Asia: ['Japan', 'China', 'India']
	}
}));

describe('ExpertSearchForm', () => {
	const mockSpecialties = ['Strategy', 'Operations', 'Technology', 'Finance'];
	const mockOnSearch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render all form fields', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		// Check if all form elements are present
		expect(screen.getByLabelText('Keyword Search')).toBeInTheDocument();
		expect(screen.getByLabelText('Regional Expertise')).toBeInTheDocument();
		expect(screen.getByLabelText('Country Expertise')).toBeInTheDocument();
		expect(screen.getByLabelText('Specialties')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Find Experts' })).toBeInTheDocument();
	});

	it('should render placeholder text correctly', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const keywordInput = screen.getByPlaceholderText('Name, company, or role');
		expect(keywordInput).toBeInTheDocument();
	});

	it('should render all specialty options', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		mockSpecialties.forEach((specialty) => {
			expect(screen.getByText(specialty)).toBeInTheDocument();
		});
	});

	it('should render region options', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		expect(screen.getByText('All Regions')).toBeInTheDocument();
		expect(screen.getByText('North America')).toBeInTheDocument();
		expect(screen.getByText('Europe')).toBeInTheDocument();
		expect(screen.getByText('Asia')).toBeInTheDocument();
	});

	it('should update keyword input value', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const keywordInput = screen.getByLabelText('Keyword Search');
		await fireEvent.input(keywordInput, { target: { value: 'test keyword' } });

		expect(keywordInput).toHaveValue('test keyword');
	});

	it('should update region selection', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const regionSelect = screen.getByLabelText('Regional Expertise');
		await fireEvent.change(regionSelect, { target: { value: 'North America' } });

		expect(regionSelect).toHaveValue('North America');
	});

	it('should show country options when region is selected', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const regionSelect = screen.getByLabelText('Regional Expertise');
		await fireEvent.change(regionSelect, { target: { value: 'North America' } });

		// Check if North American countries are available
		expect(screen.getByText('United States')).toBeInTheDocument();
		expect(screen.getByText('Canada')).toBeInTheDocument();
		expect(screen.getByText('Mexico')).toBeInTheDocument();
	});

	it('should disable country select when no region is selected', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const countrySelect = screen.getByLabelText('Country Expertise');
		expect(countrySelect).toBeDisabled();
	});

	it('should enable country select when region is selected', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const regionSelect = screen.getByLabelText('Regional Expertise');
		const countrySelect = screen.getByLabelText('Country Expertise');

		await fireEvent.change(regionSelect, { target: { value: 'North America' } });

		expect(countrySelect).not.toBeDisabled();
	});

	it('should reset country selection when region changes', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const regionSelect = screen.getByLabelText('Regional Expertise');
		const countrySelect = screen.getByLabelText('Country Expertise');

		// Select North America and a country
		await fireEvent.change(regionSelect, { target: { value: 'North America' } });
		await fireEvent.change(countrySelect, { target: { value: 'United States' } });

		expect(countrySelect).toHaveValue('United States');

		// Change region to Europe
		await fireEvent.change(regionSelect, { target: { value: 'Europe' } });

		// Country should be reset
		expect(countrySelect).toHaveValue('');
	});

	it('should call onSearch with empty filters when form is submitted with no values', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const submitButton = screen.getByRole('button', { name: 'Find Experts' });
		await fireEvent.click(submitButton);

		expect(mockOnSearch).toHaveBeenCalledTimes(1);
		expect(mockOnSearch).toHaveBeenCalledWith({});
	});

	it('should call onSearch with keyword filter', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const keywordInput = screen.getByLabelText('Keyword Search');
		const submitButton = screen.getByRole('button', { name: 'Find Experts' });

		await fireEvent.input(keywordInput, { target: { value: 'strategy consultant' } });
		await fireEvent.click(submitButton);

		expect(mockOnSearch).toHaveBeenCalledWith({
			keyword: 'strategy consultant'
		});
	});

	it('should call onSearch with region and country filters', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const regionSelect = screen.getByLabelText('Regional Expertise');
		const countrySelect = screen.getByLabelText('Country Expertise');
		const submitButton = screen.getByRole('button', { name: 'Find Experts' });

		await fireEvent.change(regionSelect, { target: { value: 'North America' } });
		await fireEvent.change(countrySelect, { target: { value: 'United States' } });
		await fireEvent.click(submitButton);

		expect(mockOnSearch).toHaveBeenCalledWith({
			region: 'North America',
			country: 'United States'
		});
	});

	it('should call onSearch with specialty filter', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const specialtySelect = screen.getByLabelText('Specialties');
		const submitButton = screen.getByRole('button', { name: 'Find Experts' });

		await fireEvent.change(specialtySelect, { target: { value: 'Strategy' } });
		await fireEvent.click(submitButton);

		expect(mockOnSearch).toHaveBeenCalledWith({
			specialties: 'Strategy'
		});
	});

	it('should call onSearch with all filters combined', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const keywordInput = screen.getByLabelText('Keyword Search');
		const regionSelect = screen.getByLabelText('Regional Expertise');
		const countrySelect = screen.getByLabelText('Country Expertise');
		const specialtySelect = screen.getByLabelText('Specialties');
		const submitButton = screen.getByRole('button', { name: 'Find Experts' });

		await fireEvent.input(keywordInput, { target: { value: 'senior consultant' } });
		await fireEvent.change(regionSelect, { target: { value: 'Europe' } });
		await fireEvent.change(countrySelect, { target: { value: 'United Kingdom' } });
		await fireEvent.change(specialtySelect, { target: { value: 'Operations' } });
		await fireEvent.click(submitButton);

		expect(mockOnSearch).toHaveBeenCalledWith({
			keyword: 'senior consultant',
			region: 'Europe',
			country: 'United Kingdom',
			specialties: 'Operations'
		});
	});

	it('should handle form submission via Enter key', async () => {
		render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const keywordInput = screen.getByLabelText('Keyword Search');
		await fireEvent.input(keywordInput, { target: { value: 'test' } });
		await fireEvent.keyDown(keywordInput, { key: 'Enter' });

		expect(mockOnSearch).toHaveBeenCalledWith({
			keyword: 'test'
		});
	});

	it('should work with default onSearch prop', () => {
		const { container } = render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties
				// Not providing onSearch prop, should use default
			}
		});

		const submitButton = screen.getByRole('button', { name: 'Find Experts' });

		// Should not throw error when clicked
		expect(() => fireEvent.click(submitButton)).not.toThrow();
	});

	it('should work with empty specialties array', () => {
		render(ExpertSearchForm, {
			props: {
				specialties: [],
				onSearch: mockOnSearch
			}
		});

		const specialtySelect = screen.getByLabelText('Specialties');
		expect(specialtySelect).toBeInTheDocument();
		expect(screen.getByText('All Specialities')).toBeInTheDocument();
	});

	it('should have correct CSS classes', () => {
		const { container } = render(ExpertSearchForm, {
			props: {
				specialties: mockSpecialties,
				onSearch: mockOnSearch
			}
		});

		const form = container.querySelector('form');
		expect(form).toHaveClass('rounded-lg', 'bg-secondary-bg', 'p-lg', 'py-sm');

		const submitButton = screen.getByRole('button', { name: 'Find Experts' });
		expect(submitButton).toHaveClass('btn', 'btn-primary', 'px-xl');
	});
});
