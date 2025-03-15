
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Briefcase, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/components/ui/use-toast';

interface IndeedJob {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  company?: string;
  location?: string;
}

const IndeedJobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<IndeedJob[]>([]);
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    if (!skills) {
      toast({
        title: "Skills required",
        description: "Please enter at least one skill to search for jobs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    const url = `https://www.indeed.com/rss?q=${skills.replace(' ', '+')}&l=${location.replace(' ', '+')}`;

    try {
      // Using AllOrigins to bypass CORS
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, 'text/xml');

      const jobItems = Array.from(xml.querySelectorAll('item')).map(item => {
        // Extract company and location from description if possible
        const description = item.querySelector('description')?.textContent || '';
        const titleElement = item.querySelector('title')?.textContent || '';
        
        // Parse company name - typically in format "Job Title - Company - Location"
        let company = '';
        let parsedLocation = '';
        
        const titleParts = titleElement.split(' - ');
        if (titleParts.length >= 2) {
          company = titleParts[1];
          if (titleParts.length >= 3) {
            parsedLocation = titleParts[2];
          }
        }
        
        return {
          title: titleParts[0] || titleElement,
          company,
          location: parsedLocation,
          link: item.querySelector('link')?.textContent || '',
          description,
          pubDate: item.querySelector('pubDate')?.textContent || ''
        };
      });

      setJobs(jobItems);
      
      if (jobItems.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try different skills or location",
          variant: "default"
        });
      } else {
        toast({
          title: "Jobs found",
          description: `Found ${jobItems.length} job listings`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error fetching jobs",
        description: "There was an error fetching jobs from Indeed. Please try again later.",
        variant: "destructive"
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract skills and location from description
  const extractSkillsFromDescription = (description: string): string[] => {
    const commonSkills = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS',
      'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 
      'Vue', 'Angular', 'AWS', 'Docker', 'Kubernetes', 'Git',
      'SQL', 'NoSQL', 'MongoDB', 'Firebase', 'GraphQL', 'REST'
    ];
    
    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
  };

  // Format the publication date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchJobs();
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 glassmorphism"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Search Real-Time Job Listings
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find job opportunities directly from Indeed's latest listings without API keys or complex setup.
          </p>
        </div>
        
        <Card className="glassmorphism mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Job Search</CardTitle>
            <CardDescription>
              Enter skills and optional location to find matching jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Skills (e.g., React Developer)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Location (Optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={fetchJobs} 
                disabled={isLoading || !skills}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Jobs
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Searching for jobs...</p>
                <p className="text-muted-foreground">This may take a moment</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try different skills or change your location
                </p>
              </div>
            ) : (
              <div>
                <div className="font-medium mb-4">
                  Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </div>
                
                {jobs.map((job, index) => {
                  const extractedSkills = extractSkillsFromDescription(job.description);
                  
                  return (
                    <Card 
                      key={index} 
                      className="mb-4 glassmorphism border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                        <CardDescription className="text-lg flex flex-wrap items-center gap-x-4 gap-y-2">
                          {job.company && (
                            <div className="flex items-center">
                              <Briefcase size={18} className="mr-2 text-muted-foreground" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          )}
                          
                          {job.location && (
                            <div className="flex items-center">
                              <MapPin size={18} className="mr-2 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          
                          {job.pubDate && (
                            <div className="text-sm text-muted-foreground">
                              Posted: {formatDate(job.pubDate)}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
                        </div>
                        
                        {extractedSkills.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Skills Mentioned:</h3>
                              <div className="flex flex-wrap gap-2">
                                {extractedSkills.map((skill, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="outline" 
                                    className="bg-gray-100 dark:bg-purple/20 border-gray-200 dark:border-purple/30 text-gray-800 dark:text-gray-200 py-1 px-3"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button asChild className="w-full sm:w-auto">
                          <a href={job.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            Apply on Indeed
                            <ExternalLink size={16} />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Data sourced from Indeed RSS feed. This is for demonstration purposes only.
          </p>
        </div>
      </div>
    </>
  );
};

export default IndeedJobSearch;
