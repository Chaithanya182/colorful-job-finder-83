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
  locationNotAvailable: boolean;
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
  isLoading: false,
  locationNotAvailable: false
});

export const useJobContext = () => useContext(JobContext);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationNotAvailable, setLocationNotAvailable] = useState(false);
  
  const isProfileComplete = !!userProfile && 
    userProfile.fullName.trim() !== '' && 
    userProfile.email.trim() !== '' &&
    userProfile.skills.length > 0;
  
  const toggleDarkMode = () => {
    if (!darkMode) {
      document.documentElement.classList.add('transitioning-to-dark');
      setTimeout(() => {
        setDarkMode(true);
        document.documentElement.classList.remove('transitioning-to-dark');
      }, 50);
    } else {
      document.documentElement.classList.add('transitioning-to-light');
      setTimeout(() => {
        setDarkMode(false);
        document.documentElement.classList.remove('transitioning-to-light');
      }, 50);
    }
  };
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfileState(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  useEffect(() => {
    if (!userProfile || !userProfile.skills.length) return;
    
    const fetchJobs = async () => {
      setIsLoading(true);
      setLocationNotAvailable(false);
      
      try {
        console.log("Attempting to fetch real-time job data...");
        console.log("Note: In a production environment, API calls would be made through a secure backend.");
        
        const indeedJobs = await fetchJobsFromIndeed(userProfile);
        if (indeedJobs.length > 0) {
          setFilteredJobs(indeedJobs);
          checkLocationAvailability(indeedJobs, userProfile.preferredLocation);
        } else {
          console.log("No jobs found from API or API call failed. Using local data instead.");
          fetchLocalJobs();
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Using local job data",
          description: "Real-time job data unavailable. For a production app, a secure backend would handle API requests.",
          variant: "default"
        });
        
        fetchLocalJobs();
      } finally {
        setIsLoading(false);
      }
    };
    
    const checkLocationAvailability = (jobs: JobListing[], preferredLocation?: string) => {
      if (!preferredLocation) return;
      
      const jobsInPreferredLocation = jobs.filter(job => 
        job.location.toLowerCase().includes(preferredLocation.toLowerCase()) || 
        (job.isRemote && preferredLocation.toLowerCase().includes('remote'))
      );
      
      if (jobsInPreferredLocation.length === 0 && jobs.length > 0) {
        setLocationNotAvailable(true);
      }
    };
    
    const fetchLocalJobs = () => {
      const allMatchingJobs = getFilteredJobs(
        userProfile.skills,
        "",
        userProfile.yearsOfExperience
      );
      
      if (userProfile.preferredLocation) {
        const locationSpecificJobs = getFilteredJobs(
          userProfile.skills,
          userProfile.preferredLocation,
          userProfile.yearsOfExperience
        );
        
        if (locationSpecificJobs.length === 0 && allMatchingJobs.length > 0) {
          setLocationNotAvailable(true);
          setFilteredJobs(allMatchingJobs);
        } else {
          setFilteredJobs(locationSpecificJobs);
        }
      } else {
        setFilteredJobs(allMatchingJobs);
      }
    };
    
    if (hasSubmittedForm) {
      fetchJobs();
    }
  }, [userProfile, hasSubmittedForm]);
  
  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };
  
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
      
      if (data && Array.isArray(data.results)) {
        return data.results.map((job: any, index: number) => {
          const description = job.snippet || '';
          const extractedSkills = extractSkillsFromDescription(description, profile.skills);
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
  
  const extractSkillsFromDescription = (description: string, userSkills: string[]): string[] => {
    const skills: string[] = [];
    const descLower = description.toLowerCase();
    
    userSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS'].forEach(skill => {
      if (descLower.includes(skill.toLowerCase()) && !skills.includes(skill)) {
        skills.push(skill);
      }
    });
    
    return skills.length > 0 ? skills : ['General'];
  };
  
  const calculateRelevanceScore = (userSkills: string[], jobSkills: string[]): number => {
    return calculateRelevance(userSkills, jobSkills);
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
        isLoading,
        locationNotAvailable
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
