
import React, { useEffect, useState } from 'react';
import ProfileForm from '@/components/ProfileForm';
import JobListing from '@/components/JobListing';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useJobContext } from '@/context/JobContext';
import { JobProvider } from '@/context/JobContext';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, X } from 'lucide-react';

const JobBoard: React.FC = () => {
  const { userProfile, filteredJobs, hasSubmittedForm, setHasSubmittedForm } = useJobContext();
  const [showJobs, setShowJobs] = useState(false);
  
  useEffect(() => {
    // Show jobs with a slight delay after form submission for a smoother transition
    if (hasSubmittedForm) {
      const timer = setTimeout(() => {
        setShowJobs(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [hasSubmittedForm]);
  
  const handleReset = () => {
    setShowJobs(false);
    setHasSubmittedForm(false);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 px-6 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-fade-in text-blue-600 dark:text-blue-400 text-sm font-medium">
          <Briefcase className="mr-2" size={16} />
          The Invisible Job Board
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight animate-slide-down">
          {!showJobs 
            ? "Discover Your Perfect Job Match" 
            : "Here are your personalized job matches"}
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in">
          {!showJobs 
            ? "Create your profile to unlock personalized job recommendations tailored to your skills and preferences."
            : `Based on your skills: ${userProfile?.skills.join(', ')}`}
        </p>
      </div>
      
      <div className="flex justify-center">
        {!showJobs ? (
          <div className="w-full max-w-md">
            <ProfileForm />
          </div>
        ) : (
          <div className="w-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="font-medium">
                {filteredJobs.length === 0 
                  ? "No jobs found matching your skills" 
                  : `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} matching your skills`}
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2 glassmorphism hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={16} />
                <span>Reset</span>
              </Button>
            </div>
            
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adding different skills or changing your preferences
                </p>
                <Button onClick={handleReset}>
                  Update Skills
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
                  <div 
                    key={job.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <JobListing job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <>
      <AnimatedBackground />
      <JobProvider>
        <JobBoard />
      </JobProvider>
    </>
  );
};

export default Index;
