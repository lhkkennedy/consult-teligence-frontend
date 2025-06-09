export const consultants = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    location: 'New York, USA',
    company: 'Smith & Associates',
    currentRole: 'Senior Real Estate Consultant',
    functionalExpertise: [
      'Commercial Real Estate',
      'Property Valuation',
      'Investment Analysis'
    ],
    geographicalExpertise: 'North America',
    countryExpertise: 'USA',
    rate: 250,
    bio: 'John Smith is a seasoned real estate professional with over 15 years of experience in commercial real estate and property valuation. He specializes in investment analysis for institutional clients and has worked on projects valued at over $500 million throughout his career.',
    education: 'MBA in Real Estate Finance, Columbia University',
    certifications: ['Certified Commercial Investment Member (CCIM)', 'Member of the Appraisal Institute (MAI)'],
    languages: ['English', 'Spanish'],
    profileImage: '/experts/john-smith.jpg',
    contactInfo: {
      email: 'john.smith@example.com',
      phone: '+1 (212) 555-1234',
      linkedin: 'linkedin.com/in/johnsmith'
    },
    availability: 'Available for projects starting June 2025',
    testimonials: [
      {
        id: 1,
        name: 'Sarah Johnson',
        company: 'Global Investments Ltd',
        text: 'John provided exceptional insights for our commercial property acquisition in Manhattan. His valuation expertise saved us from a potentially costly mistake.'
      },
      {
        id: 2,
        name: 'Michael Chen',
        company: 'Pacific Development Group',
        text: 'Working with John was a pleasure. His deep knowledge of the New York market and analytical approach to investment opportunities proved invaluable.'
      }
    ],
    caseStudies: [
      {
        id: 1,
        title: 'Manhattan Office Complex Acquisition',
        description: 'Advised on the $120M acquisition of a multi-tenant office complex, identifying value-add opportunities that increased ROI by 22%.'
      },
      {
        id: 2,
        title: 'Brooklyn Mixed-Use Development',
        description: 'Provided comprehensive market analysis and financial modeling for a $85M mixed-use development project in Brooklyn.'
      }
    ]
  },
  {
    id: 2,
    firstName: 'Emma',
    lastName: 'Johnson',
    location: 'London, UK',
    company: 'Urban Development Partners',
    currentRole: 'Director of Residential Development',
    functionalExpertise: [
      'Residential Development',
      'Urban Planning',
      'Sustainability'
    ],
    geographicalExpertise: 'Europe',
    countryExpertise: 'UK',
    rate: 275,
    bio: 'Emma Johnson is a forward-thinking residential development expert with a passion for sustainable urban planning. With 12 years in the industry, she has led numerous successful residential projects across the UK, focusing on creating environmentally conscious living spaces that enhance community well-being.',
    education: 'Master\'s in Urban Planning, University College London',
    certifications: ['Member of the Royal Town Planning Institute (MRTPI)', 'LEED Accredited Professional'],
    languages: ['English', 'French'],
    profileImage: '/experts/emma-johnson.jpg',
    contactInfo: {
      email: 'emma.johnson@example.com',
      phone: '+44 20 7946 0523',
      linkedin: 'linkedin.com/in/emmajohnson'
    },
    availability: 'Limited availability - booking 3 months in advance',
    testimonials: [
      {
        id: 1,
        name: 'David Williams',
        company: 'Horizon Investments',
        text: 'Emma\'s expertise in sustainable residential development transformed our project in Manchester. Her innovative approach to community-focused design has become our new standard.'
      },
      {
        id: 2,
        name: 'Sophia Patel',
        company: 'Green Living Developments',
        text: 'Working with Emma on our eco-housing project was enlightening. Her knowledge of sustainable materials and energy-efficient design helped us achieve our environmental goals while maintaining profitability.'
      }
    ],
    caseStudies: [
      {
        id: 1,
        title: 'Riverside Eco-Community, Bristol',
        description: 'Led the planning and development of a 120-unit sustainable housing community that achieved carbon neutrality and won the National Housing Design Award.'
      },
      {
        id: 2,
        title: 'London Urban Regeneration Project',
        description: 'Transformed a former industrial site into a mixed-use development with 200 residential units, incorporating green spaces and community facilities.'
      }
    ]
  },
  {
    id: 3,
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    location: 'Madrid, Spain',
    company: 'Global Hospitality Advisors',
    currentRole: 'Head of Hospitality Investments',
    functionalExpertise: [
      'Hospitality Real Estate',
      'Tourism Development',
      'Asset Management'
    ],
    geographicalExpertise: 'Europe',
    countryExpertise: 'Spain',
    rate: 225,
    bio: 'Carlos Rodriguez is a hospitality real estate specialist with extensive experience across Europe and Latin America. He has advised on hotel acquisitions, resort developments, and tourism infrastructure projects worth over €300 million. His expertise lies in identifying emerging tourism markets and optimizing hospitality asset performance.',
    education: 'MBA in Hospitality Management, IE Business School',
    certifications: ['Certified Hotel Administrator (CHA)', 'Real Estate Investment Advisor'],
    languages: ['Spanish', 'English', 'Portuguese'],
    profileImage: '/experts/carlos-rodriguez.jpg',
    contactInfo: {
      email: 'carlos.rodriguez@example.com',
      phone: '+34 91 123 4567',
      linkedin: 'linkedin.com/in/carlosrodriguez'
    },
    availability: 'Available for consulting engagements',
    testimonials: [
      {
        id: 1,
        name: 'Isabella Moreno',
        company: 'Mediterranean Resorts Group',
        text: 'Carlos provided exceptional guidance during our expansion into the Spanish coastal market. His understanding of tourism trends and local regulations was invaluable.'
      },
      {
        id: 2,
        name: 'Antoine Dubois',
        company: 'European Hotel Investments',
        text: 'We\'ve worked with Carlos on multiple hotel acquisitions across Southern Europe. His market insights and negotiation skills have consistently delivered above-market returns.'
      }
    ],
    caseStudies: [
      {
        id: 1,
        title: 'Luxury Resort Development, Costa del Sol',
        description: 'Managed the development strategy for a €75M luxury resort, optimizing the concept to achieve 35% higher ADR than competing properties.'
      },
      {
        id: 2,
        title: 'Boutique Hotel Portfolio Acquisition',
        description: 'Advised on the €120M acquisition of a portfolio of boutique hotels across Spain and Portugal, implementing asset management strategies that increased EBITDA by 28%.'
      }
    ]
  }
];

export const regions = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Asia',
  'Middle East',
  'Oceania'
];

export const countries = {
  'North America': ['USA', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  'Europe': ['UK', 'France', 'Germany', 'Spain', 'Italy'],
  'Africa': ['South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco'],
  'Asia': ['China', 'Japan', 'India', 'Singapore', 'South Korea'],
  'Middle East': ['UAE', 'Saudi Arabia', 'Qatar', 'Israel', 'Turkey'],
  'Oceania': ['Australia', 'New Zealand', 'Fiji']
};

export const specialties = [
  'Residential Real Estate',
  'Commercial Real Estate',
  'Investment Analysis',
  'Property Development',
  'Urban Planning'
];

export const subSpecialties = {
  'Residential Real Estate': ['Luxury Homes', 'Multi-family', 'Affordable Housing', 'Vacation Properties'],
  'Commercial Real Estate': ['Office', 'Retail', 'Industrial', 'Hospitality', 'Mixed-Use'],
  'Investment Analysis': ['Market Research', 'Financial Modeling', 'Portfolio Management', 'Risk Assessment'],
  'Property Development': ['Land Acquisition', 'Project Management', 'Sustainability', 'Renovation'],
  'Urban Planning': ['Master Planning', 'Zoning', 'Public Spaces', 'Transportation']
};

export const articles = [
  {
    id: 1,
    title: 'The Future of Urban Living: Trends in 2025',
    summary: 'Explore how urban living spaces are evolving with technology integration and sustainability practices.',
    image: 'urban-living.jpg',
    author: 'Emma Johnson',
    date: '2025-05-15',
    category: 'Urban Planning'
  },
  {
    id: 2,
    title: 'Commercial Real Estate Recovery Post-Pandemic',
    summary: 'Analysis of how commercial properties are adapting to new work patterns and economic conditions.',
    image: 'commercial-recovery.jpg',
    author: 'John Smith',
    date: '2025-05-02',
    category: 'Commercial Real Estate'
  },
  {
    id: 3,
    title: 'Sustainable Development in Emerging Markets',
    summary: 'How green building practices are gaining momentum in rapidly developing urban centers worldwide.',
    image: 'sustainable-development.jpg',
    author: 'Maria Sanchez',
    date: '2025-04-28',
    category: 'Property Development'
  },
  {
    id: 4,
    title: 'Investment Opportunities in Global Real Estate',
    summary: 'Strategic insights into promising real estate markets and sectors for investors in the coming year.',
    image: 'investment-opportunities.jpg',
    author: 'Carlos Rodriguez',
    date: '2025-04-15',
    category: 'Investment Analysis'
  }
];

