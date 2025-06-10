  import type { PageLoad } from '$lib/types.ts';
  
  export const load: PageLoad = async ({ fetch }) => {
    console.log('STRAPI_URL=', import.meta.env.VITE_STRAPI_URL);
    console.log('STRAPI_TOKEN=', import.meta.env.VITE_STRAPI_TOKEN);
    console.log('STRAPI_UPLOAD_PATH=', import.meta.env.VITE_STRAPI_UPLOAD_PATH);
    const base = import.meta.env.VITE_STRAPI_URL;
    const token = import.meta.env.VITE_STRAPI_TOKEN;
    const url = `${base}/api/consultants?populate=*&sort[0]=id:ASC`
    const res = await fetch(url,{
        headers: {
            Authorization: `Bearer ${token}`
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
        profileImage:      item.profileImage?.url ? `${base}${item.profileImage.url}` : '/default-avatar.png',
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
