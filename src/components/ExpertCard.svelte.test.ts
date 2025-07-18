import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ExpertCard from './ExpertCard.svelte';
import type { Consultant } from '$lib/types';

// Mock the Lucide icons
vi.mock('@lucide/svelte/icons/map-pin', () => ({
  default: {
    render: () => '<svg data-testid="map-pin-icon"></svg>',
  },
}));

vi.mock('@lucide/svelte/icons/briefcase', () => ({
  default: {
    render: () => '<svg data-testid="briefcase-icon"></svg>',
  },
}));

vi.mock('@lucide/svelte/icons/dollar-sign', () => ({
  default: {
    render: () => '<svg data-testid="dollar-sign-icon"></svg>',
  },
}));

describe('ExpertCard', () => {
  const mockConsultant: Consultant = {
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
      linkedin: 'https://linkedin.com/in/johndoe',
    },
    availability: 'Available',
    testimonials: [],
    caseStudies: [],
  };

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render consultant information correctly', () => {
    const { getByText, container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    // Check if consultant name is displayed
    expect(getByText('John Doe')).toBeInTheDocument();
    
    // Check if location is displayed
    expect(getByText('New York, NY')).toBeInTheDocument();
    
    // Check if company and role are displayed
    expect(getByText('Tech Corp')).toBeInTheDocument();
    expect(getByText('Senior Consultant')).toBeInTheDocument();
    
    // Check if rate is displayed
    expect(getByText('$250')).toBeInTheDocument();
  });

  it('should display profile image when provided', () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const profileImage = container.querySelector('img');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', mockConsultant.profileImage);
  });

  it('should not display profile image when not provided', () => {
    const consultantWithoutImage = {
      ...mockConsultant,
      profileImage: '',
    };

    const { container } = render(ExpertCard, {
      props: {
        consultant: consultantWithoutImage,
        onSelect: mockOnSelect,
      },
    });

    const profileImage = container.querySelector('img');
    expect(profileImage).not.toBeInTheDocument();
  });

  it('should display functional expertise tags', () => {
    const { getByText } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    mockConsultant.functionalExpertise.forEach(expertise => {
      expect(getByText(expertise)).toBeInTheDocument();
    });
  });

  it('should call onSelect when card is clicked', async () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toBeInTheDocument();

    await fireEvent.click(card!);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockConsultant.documentId);
  });

  it('should call onSelect when Enter key is pressed', async () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toBeInTheDocument();

    await fireEvent.keyDown(card!, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockConsultant.documentId);
  });

  it('should call onSelect when Space key is pressed', async () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toBeInTheDocument();

    await fireEvent.keyDown(card!, { key: ' ' });

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockConsultant.documentId);
  });

  it('should not call onSelect for other keys', async () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toBeInTheDocument();

    await fireEvent.keyDown(card!, { key: 'Tab' });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('should have correct CSS classes', () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toHaveClass(
      'expert-card',
      'flex',
      'h-full',
      'cursor-pointer',
      'flex-col',
      'transition-all',
      'duration-300',
      'border',
      'border-gray-200',
      'dark:border-[#2D3748]',
      'bg-white',
      'dark:bg-[#1E2130]',
      'hover:border-accent-purple'
    );
  });

  it('should work with default onSelect prop', () => {
    const { container } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        // Not providing onSelect prop, should use default
      },
    });

    const card = container.querySelector('.expert-card');
    expect(card).toBeInTheDocument();

    // Should not throw error when clicked
    expect(() => fireEvent.click(card!)).not.toThrow();
  });

  it('should handle consultant with minimal data', () => {
    const minimalConsultant: Consultant = {
      ...mockConsultant,
      profileImage: '',
      functionalExpertise: [],
      bio: '',
      education: '',
      certifications: [],
      languages: [],
      testimonials: [],
      caseStudies: [],
    };

    const { getByText, container } = render(ExpertCard, {
      props: {
        consultant: minimalConsultant,
        onSelect: mockOnSelect,
      },
    });

    // Should still render basic information
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('New York, NY')).toBeInTheDocument();
    expect(container.querySelector('.expert-card')).toBeInTheDocument();
  });

  it('should handle long consultant names gracefully', () => {
    const consultantWithLongName = {
      ...mockConsultant,
      firstName: 'VeryLongFirstName',
      lastName: 'VeryLongLastNameThatMightOverflow',
    };

    const { getByText } = render(ExpertCard, {
      props: {
        consultant: consultantWithLongName,
        onSelect: mockOnSelect,
      },
    });

    expect(getByText('VeryLongFirstName VeryLongLastNameThatMightOverflow')).toBeInTheDocument();
  });

  it('should display rate with currency symbol', () => {
    const { getByText } = render(ExpertCard, {
      props: {
        consultant: mockConsultant,
        onSelect: mockOnSelect,
      },
    });

    expect(getByText('$250')).toBeInTheDocument();
  });
});