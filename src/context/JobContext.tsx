
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JobListing, getFilteredJobs } from '../utils/jobListings';

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
  setHasSubmittedForm: () => {}
});

export const useJobContext = () => useContext(JobContext);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  
  const isProfileComplete = !!userProfile && 
    userProfile.fullName.trim() !== '' && 
    userProfile.email.trim() !== '' &&
    userProfile.skills.length > 0;
  
  const filteredJobs = userProfile 
    ? getFilteredJobs(
        userProfile.skills,
        userProfile.preferredLocation,
        userProfile.yearsOfExperience
      ) 
    : [];
  
  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    // Store in localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };
  
  // Load profile from localStorage on initial render
  React.useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfileState(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
  }, []);
  
  return (
    <JobContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile, 
        filteredJobs, 
        isProfileComplete,
        hasSubmittedForm,
        setHasSubmittedForm
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
