
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobContext } from '@/context/JobContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, ExternalLink, Clock, LinkedinIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useToast } from '@/components/ui/use-toast';

const JobApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { filteredJobs } = useJobContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState(filteredJobs.find(job => job.id === id));
  const [linkedInUrl, setLinkedInUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Update job if filteredJobs changes
    setJob(filteredJobs.find(job => job.id === id));
    
    // If job not found, redirect to main page
    if (filteredJobs.length > 0 && !job) {
      navigate('/');
    }
  }, [id, filteredJobs, job, navigate]);
  
  useEffect(() => {
    const fetchLinkedInJobLink = async () => {
      if (!job) return;
      
      setIsLoading(true);
      try {
        console.log("Attempting to fetch LinkedIn job data...");
        
        // In a real implementation, this would be an API call to get LinkedIn job listings
        // For demo purposes, we'll simulate the API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a simulated LinkedIn URL based on job details
        const searchQuery = encodeURIComponent(`${job.title} ${job.company}`);
        const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`;
        setLinkedInUrl(linkedInSearchUrl);
        
        toast({
          title: "LinkedIn job link found",
          description: "You can now apply directly through LinkedIn",
          variant: "default"
        });
      } catch (error) {
        console.error('Error fetching LinkedIn job link:', error);
        toast({
          title: "LinkedIn integration notice",
          description: "In a production app, this would connect to LinkedIn's API for direct job links",
          variant: "default"
        });
        
        // Fallback to a generic LinkedIn search
        if (job) {
          const searchQuery = encodeURIComponent(`${job.title} ${job.company}`);
          setLinkedInUrl(`https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinkedInJobLink();
  }, [job, toast]);
  
  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Button onClick={() => navigate('/')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }
  
  const {
    title,
    company,
    location,
    description,
    requiredSkills,
    isRemote
  } = job;
  
  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/job/${id}`)}
            className="flex items-center gap-2 glassmorphism w-fit"
          >
            <ArrowLeft size={16} />
            Back to Job Details
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 glassmorphism w-fit"
          >
            <ArrowLeft size={16} />
            Back to All Jobs
          </Button>
        </div>
        
        <Card className="glassmorphism border-0 shadow-lg overflow-hidden mb-8">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isRemote && (
                <Badge variant="outline" className="border-blue-200 text-blue-600 dark:border-purple/30 dark:text-purple-light bg-blue-50 dark:bg-purple/10 px-2 py-0.5 text-xs">
                  Remote
                </Badge>
              )}
              <Badge variant="outline" className="border-green-200 text-green-600 dark:border-green-300/30 dark:text-green-300 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 text-xs">
                Ready to Apply
              </Badge>
            </div>
            
            <CardTitle className="text-3xl font-bold mb-2">{title}</CardTitle>
            
            <div className="text-lg flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Building size={18} className="mr-2 text-muted-foreground" />
                <span className="font-medium">{company}</span>
              </div>
              
              <div className="flex items-center">
                <Briefcase size={18} className="mr-2 text-muted-foreground" />
                <span>{location}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ready to Apply</h3>
              <p className="text-muted-foreground mb-4">
                You're just a few steps away from applying to this position. Review the job details below and click the 
                "Apply on LinkedIn" button to continue your application process.
              </p>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-4 text-center text-muted-foreground">Finding the best application link for you...</p>
                </div>
              ) : linkedInUrl ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h4 className="text-lg font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                    <LinkedinIcon size={20} /> 
                    LinkedIn Application
                  </h4>
                  <p className="mb-4 text-blue-700 dark:text-blue-400">
                    We've found a matching job posting on LinkedIn. Click below to continue with your application.
                  </p>
                  <a 
                    href={linkedInUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-[#0077B5] hover:bg-[#006699] text-white">
                      Apply on LinkedIn
                      <ExternalLink size={16} className="ml-2" />
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    We're having trouble connecting to LinkedIn. Please try again later or search for this job directly on LinkedIn.
                  </p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Summary</h3>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-gray-100 dark:bg-purple/20 border-gray-200 dark:border-purple/30 text-gray-800 dark:text-gray-200 py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Application Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Tailor your resume to highlight experience relevant to the required skills</li>
                <li>Prepare examples that demonstrate your expertise in {requiredSkills.slice(0, 3).join(', ')}</li>
                <li>Research {company} before your interview</li>
                <li>Follow up within one week if you don't hear back</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
            {linkedInUrl ? (
              <a 
                href={linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full bg-[#0077B5] hover:bg-[#006699] text-white">
                  Apply on LinkedIn
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </a>
            ) : (
              <Button className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Finding application link..." : "Apply Now"}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Disclaimer</h3>
          <p className="text-muted-foreground text-sm">
            This application process is for demonstration purposes only. In a production environment, 
            this would connect to LinkedIn's API to provide real job application functionality and track
            your application status.
          </p>
        </div>
      </div>
    </>
  );
};

export default JobApplication;
