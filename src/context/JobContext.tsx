
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { JobListing, getFilteredJobs } from '../utils/jobListings';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  fullName: string;
  email: string;
  skills: string[];
  yearsOfExperience: number;
  preferredLocation: string;
}

interface JobContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  filteredJobs: JobListing[];
  isProfileComplete: boolean;
  hasSubmittedForm: boolean;
  setHasSubmittedForm: (value: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  fullName: '',
  email: '',
  skills: [],
  yearsOfExperience: 0,
  preferredLocation: ''
};

const JobContext = createContext<JobContextType>({
  userProfile: null,
  setUserProfile: () => {},
  filteredJobs: [],
  isProfileComplete: false,
  hasSubmittedForm: false,
  setHasSubmittedForm: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
  isLoading: false
});

export const useJobContext = () => useContext(JobContext);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isProfileComplete = !!userProfile && 
    userProfile.fullName.trim() !== '' && 
    userProfile.email.trim() !== '' &&
    userProfile.skills.length > 0;
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Load profile and theme from localStorage on initial render
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfileState(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
    
    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Check if user has previously set a theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  // Fetch jobs when user profile changes
  useEffect(() => {
    if (!userProfile || !userProfile.skills.length) return;
    
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        // First try to fetch from Indeed API
        const indeedJobs = await fetchJobsFromIndeed(userProfile);
        if (indeedJobs.length > 0) {
          setFilteredJobs(indeedJobs);
        } else {
          // Fallback to local data
          const localJobs = getFilteredJobs(
            userProfile.skills,
            userProfile.preferredLocation,
            userProfile.yearsOfExperience
          );
          setFilteredJobs(localJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Couldn't connect to job service",
          description: "Using local job data instead",
          variant: "destructive"
        });
        
        // Use local data as fallback
        const localJobs = getFilteredJobs(
          userProfile.skills,
          userProfile.preferredLocation,
          userProfile.yearsOfExperience
        );
        setFilteredJobs(localJobs);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (hasSubmittedForm) {
      fetchJobs();
    }
  }, [userProfile, hasSubmittedForm]);
  
  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    // Store in localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };
  
  // Function to fetch jobs from Indeed API
  const fetchJobsFromIndeed = async (profile: UserProfile): Promise<JobListing[]> => {
    try {
      const skillsQuery = profile.skills.join(' OR ');
      const locationQuery = profile.preferredLocation || '';
      
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.indeed.com/ads/apisearch?publisher=YOUR_PUBLISHER_ID&q=${encodeURIComponent(skillsQuery)}&l=${encodeURIComponent(locationQuery)}&format=json&v=2`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs from Indeed');
      }
      
      const data = await response.json();
      
      // Transform Indeed data to our JobListing interface
      if (data && Array.isArray(data.results)) {
        return data.results.map((job: any, index: number) => {
          // Extract skills from job description
          const description = job.snippet || '';
          const extractedSkills = extractSkillsFromDescription(description, profile.skills);
          
          // Calculate relevance
          const relevanceScore = calculateRelevanceScore(profile.skills, extractedSkills);
          
          return {
            id: `indeed-${job.jobkey || index}`,
            title: job.jobtitle || 'Unknown Title',
            company: job.company || 'Unknown Company',
            location: job.formattedLocation || job.city || 'Unknown Location',
            description: description,
            requiredSkills: extractedSkills,
            salary: job.formattedRelativeTime || '',
            postedDate: new Date().toISOString(),
            isRemote: description.toLowerCase().includes('remote'),
            relevanceScore,
            isTopMatch: relevanceScore >= 80
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching Indeed jobs:', error);
      return [];
    }
  };
  
  // Function to extract skills from job description
  const extractSkillsFromDescription = (description: string, userSkills: string[]): string[] => {
    const skills: string[] = [];
    const descLower = description.toLowerCase();
    
    // Check if user skills are mentioned in description
    userSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    // Add some common skills that might be in the description
    ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS'].forEach(skill => {
      if (descLower.includes(skill.toLowerCase()) && !skills.includes(skill)) {
        skills.push(skill);
      }
    });
    
    return skills.length > 0 ? skills : ['General'];
  };
  
  // Calculate relevance score
  const calculateRelevanceScore = (userSkills: string[], jobSkills: string[]): number => {
    if (!userSkills.length || !jobSkills.length) return 0;
    
    const matchingSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    ).length;
    
    return Math.round((matchingSkills / jobSkills.length) * 100);
  };
  
  return (
    <JobContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile, 
        filteredJobs, 
        isProfileComplete,
        hasSubmittedForm,
        setHasSubmittedForm,
        darkMode,
        toggleDarkMode,
        isLoading
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
