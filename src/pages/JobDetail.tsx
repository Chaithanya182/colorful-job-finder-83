
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobContext } from '@/context/JobContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, MapPin, Calendar, DollarSign, Share2, ExternalLink, Building, Clock, Medal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/components/ui/use-toast';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { filteredJobs } = useJobContext();
  const navigate = useNavigate();
  const [job, setJob] = useState(filteredJobs.find(job => job.id === id));
  
  useEffect(() => {
    // Update job if filteredJobs changes
    setJob(filteredJobs.find(job => job.id === id));
    
    // If job not found, redirect to main page
    if (filteredJobs.length > 0 && !job) {
      navigate('/');
    }
  }, [id, filteredJobs, job, navigate]);
  
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
    salary,
    postedDate,
    isRemote,
    relevanceScore,
    isTopMatch
  } = job;
  
  const formattedDate = new Date(postedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate time since posted
  const getTimeSincePosted = () => {
    const posted = new Date(postedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    return `${diffMonths} months ago`;
  };
  
  // Handle job sharing functionality
  const handleShareJob = async () => {
    const jobUrl = window.location.href;
    const shareData = {
      title: `Job Opportunity: ${title} at ${company}`,
      text: `Check out this job opportunity: ${title} at ${company}`,
      url: jobUrl
    };
    
    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile devices)
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "The job has been shared",
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share this job opportunity",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing this job",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 glassmorphism"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Button>
        
        <Card className="glassmorphism border-0 shadow-lg overflow-hidden mb-8">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isTopMatch && (
                <Badge className="bg-green-500 dark:bg-purple-light text-white border-none px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                  <Medal size={12} className="mr-1" />
                  Top Match
                </Badge>
              )}
              {isRemote && (
                <Badge variant="outline" className="border-blue-200 text-blue-600 dark:border-purple/30 dark:text-purple-light bg-blue-50 dark:bg-purple/10 px-2 py-0.5 text-xs">
                  Remote
                </Badge>
              )}
              {relevanceScore !== undefined && (
                <Badge variant="outline" className="border-green-200 text-green-600 dark:border-green-300/30 dark:text-green-300 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 text-xs">
                  {relevanceScore}% Match
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-3xl font-bold mb-2">{title}</CardTitle>
            
            <CardDescription className="text-lg flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Building size={18} className="mr-2 text-muted-foreground" />
                <span className="font-medium">{company}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin size={18} className="mr-2 text-muted-foreground" />
                <span>{location}</span>
              </div>
              
              {salary && (
                <div className="flex items-center">
                  <DollarSign size={18} className="mr-2 text-muted-foreground" />
                  <span>{salary}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-muted-foreground" />
                <span>{getTimeSincePosted()}</span>
              </div>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
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
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Posted</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="font-medium">Full-time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link to={`/job/${id}/apply`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Apply Now
                <ExternalLink size={16} className="ml-2" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleShareJob}
            >
              Share Job
              <Share2 size={16} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Disclaimer</h3>
          <p className="text-muted-foreground text-sm">
            This job listing is for demonstration purposes only. In a production environment, 
            this would connect to real job APIs and provide actual application functionality.
          </p>
        </div>
      </div>
    </>
  );
};

export default JobDetail;
