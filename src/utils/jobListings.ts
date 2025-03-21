
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  salary?: string;
  postedDate: string;
  isRemote: boolean;
  relevanceScore?: number;
  isTopMatch?: boolean;
}

export const jobListings: JobListing[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'Join our team to build cutting-edge web applications using React and TypeScript.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'REST API'],
    salary: '$120,000 - $150,000',
    postedDate: '2023-08-15',
    isRemote: true
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'InnovateSoft',
    location: 'New York, NY',
    description: 'Looking for a full stack developer with experience in React, Node.js, and MongoDB.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'],
    salary: '$100,000 - $130,000',
    postedDate: '2023-08-10',
    isRemote: false
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'DataDriven',
    location: 'Austin, TX',
    description: 'Develop and maintain our backend services using Node.js, Express, and MongoDB.',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST API'],
    salary: '$90,000 - $120,000',
    postedDate: '2023-08-05',
    isRemote: true
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'DesignMasters',
    location: 'Los Angeles, CA',
    description: 'Create beautiful and intuitive user interfaces for our web and mobile applications.',
    requiredSkills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML/CSS', 'Prototyping'],
    salary: '$80,000 - $110,000',
    postedDate: '2023-08-01',
    isRemote: false
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudNative',
    location: 'Seattle, WA',
    description: 'Manage our cloud infrastructure and CI/CD pipelines using AWS, Docker, and Kubernetes.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    salary: '$110,000 - $140,000',
    postedDate: '2023-07-28',
    isRemote: true
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'Boston, MA',
    description: 'Lead the development of new products and features, working closely with engineering and design teams.',
    requiredSkills: ['Product Management', 'Agile', 'Scrum', 'User Research', 'Roadmapping'],
    salary: '$100,000 - $130,000',
    postedDate: '2023-07-25',
    isRemote: false
  },
  {
    id: '7',
    title: 'Data Scientist',
    company: 'DataAnalytics',
    location: 'Chicago, IL',
    description: 'Analyze large datasets to extract insights and build machine learning models using Python and related libraries.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics'],
    salary: '$90,000 - $120,000',
    postedDate: '2023-07-20',
    isRemote: true
  },
  {
    id: '8',
    title: 'Python Developer',
    company: 'CodeWizards',
    location: 'Denver, CO',
    description: 'Build backend services and data processing pipelines using Python and related frameworks.',
    requiredSkills: ['Python', 'Django', 'Flask', 'SQL', 'API Development'],
    salary: '$95,000 - $125,000',
    postedDate: '2023-07-18',
    isRemote: true
  }
];

/**
 * Calculate similarity between two strings
 * Higher score (closer to 1) means more similar
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1;
  
  // Check if one is contained within the other
  if (s1.includes(s2) || s2.includes(s1)) {
    const ratio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    return 0.7 + (ratio * 0.3); // Base similarity of 0.7 plus some factor of length ratio
  }
  
  // Calculate edit distance (simple version)
  const maxDistance = Math.max(s1.length, s2.length);
  if (maxDistance === 0) return 1;
  
  let distance = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] !== s2[i]) distance++;
  }
  
  distance += Math.abs(s1.length - s2.length); // Add remaining characters as distance
  
  return 1 - (distance / maxDistance);
};

export const calculateRelevance = (userSkills: string[], jobSkills: string[]): number => {
  if (!userSkills.length || !jobSkills.length) return 0;
  
  // For each job skill, find the best matching user skill and its similarity score
  const matchScores = jobSkills.map(jobSkill => {
    const scores = userSkills.map(userSkill => {
      return calculateStringSimilarity(jobSkill, userSkill);
    });
    
    return Math.max(...scores);
  });
  
  // Average of all match scores
  const totalScore = matchScores.reduce((sum, score) => sum + score, 0);
  return Math.round((totalScore / jobSkills.length) * 100);
};

export const getFilteredJobs = (
  skills: string[], 
  location?: string, 
  experience?: number
): JobListing[] => {
  if (!skills.length) return [];
  
  const filteredJobs = jobListings
    .map(job => {
      // Calculate relevance score
      const relevanceScore = calculateRelevance(skills, job.requiredSkills);
      const isTopMatch = relevanceScore >= 80;
      
      // Filter by location if provided
      if (location && !job.location.toLowerCase().includes(location.toLowerCase()) && 
          !(job.isRemote && location.toLowerCase().includes('remote'))) {
        return null;
      }

      // Return job with relevance score if there's any match
      if (relevanceScore > 0) {
        return {
          ...job,
          relevanceScore,
          isTopMatch
        };
      }
      
      return null;
    })
    .filter(Boolean) as JobListing[];
    
  // Sort by relevance score
  return filteredJobs.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};
