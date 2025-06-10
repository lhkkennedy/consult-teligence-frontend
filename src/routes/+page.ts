import type { PageLoad } from '$lib/types.ts';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/consultants?populate=*`, {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`
  }
  });
  if (!res.ok) {
  const text = await res.text();
  console.error('Strapi error:', text);
  throw new Error(`Could not load consultants (status ${res.status})`);
  }
  const { data } = (await res.json()) as ConsultantsResponse;

  console.log(await data)

  // Map to front-end shape
  const consultants: Consultant[] = data.map((item: RawConsultant) => ({
      id:                item.id,
      firstName:         item.firstName,
      lastName:          item.lastName,
      location:          item.location,
      company:           item.company,
      currentRole:       item.currentRole,
      functionalExpertise: item.functionalExpertise,
      geographicalExpertise: item.geographicalExpertise,
      countryExpertise:  item.countryExpertise,
      rate:              item.rate,
      bio:               item.bio,
      education:         item.education,
      certifications:    item.certifications,
      languages:         item.languages,
      availability:      item.availability,
      profileImage:      item.profileImage?.url ? `${import.meta.env.VITE_STRAPI_URL}${item.profileImage.url}` : '/default-avatar.png',
      contactInfo: {
      email:    item.contactInfo.Email,
      phone:    item.contactInfo.Phone,
      linkedin: item.contactInfo.LinkedIn
      },
      testimonials:      item.testimonials,
      caseStudies:       item.caseStudies
  }));

  return { consultants };
}
