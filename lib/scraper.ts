export interface LinkedInScraperOptions {
  includeFollowerAndConnection?: boolean;
  includeExperiences?: boolean;
  includeSkills?: boolean;
  includeCertifications?: boolean;
  includePublications?: boolean;
  includeEducations?: boolean;
  includeVolunteers?: boolean;
  includeHonors?: boolean;
  includeInterests?: boolean;
  includeBio?: boolean;
}

/**
 * Scrapes LinkedIn profile data using RapidAPI
 * @param username - LinkedIn username (e.g., "williamhgates")
 * @param options - Optional configuration for which profile sections to include
 * @returns Raw JSON object from the API
 */
export async function scrapeLinkedInProfile(
  username: string,
  options: LinkedInScraperOptions = {}
): Promise<unknown> {
  const url = "https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user/profile";
  
  // Default all options to true
  const {
    includeFollowerAndConnection = true,
    includeExperiences = true,
    includeSkills = true,
    includeCertifications = true,
    includePublications = true,
    includeEducations = true,
    includeVolunteers = true,
    includeHonors = true,
    includeInterests = true,
    includeBio = true,
  } = options;

  const queryParams = new URLSearchParams({
    username: username,
    include_follower_and_connection: includeFollowerAndConnection.toString(),
    include_experiences: includeExperiences.toString(),
    include_skills: includeSkills.toString(),
    include_certifications: includeCertifications.toString(),
    include_publications: includePublications.toString(),
    include_educations: includeEducations.toString(),
    include_volunteers: includeVolunteers.toString(),
    include_honors: includeHonors.toString(),
    include_interests: includeInterests.toString(),
    include_bio: includeBio.toString(),
  });

  const headers = {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
    "x-rapidapi-host": "fresh-linkedin-scraper-api.p.rapidapi.com"
  };

  const response = await fetch(`${url}?${queryParams}`, {
    method: "GET",
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`Failed to scrape LinkedIn profile: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}