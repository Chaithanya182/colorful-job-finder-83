
import React from 'react';
import { Link } from 'react-router-dom';
import { JobListing as JobListingType } from '../utils/jobListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Calendar, DollarSign, Medal, ArrowRight } from 'lucide-react';

interface JobListingProps {
  job: JobListingType;
  delay?: number;
}

const JobListing: React.FC<JobListingProps> = ({ job, delay = 0 }) => {
  const { 
    id,
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

  const relevanceColor = isTopMatch 
    ? 'bg-green-500 dark:bg-purple-light' 
    : relevanceScore && relevanceScore >= 60 
      ? 'bg-yellow-500 dark:bg-purple' 
      : 'bg-blue-500 dark:bg-purple-dark';

  // Truncate description if it's too long
  const truncatedDescription = description.length > 150 
    ? `${description.substring(0, 150)}...` 
    : description;

  return (
    <div 
      className="p-6 mb-4 glassmorphism rounded-2xl transition-all duration-300 hover:shadow-xl"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
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
          </div>
          
          <h3 className="text-xl font-medium mb-1">{title}</h3>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center mr-4 mb-2">
              <Briefcase size={14} className="mr-1" />
              <span>{company}</span>
            </div>
            
            <div className="flex items-center mr-4 mb-2">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
            
            {salary && (
              <div className="flex items-center mr-4 mb-2">
                <DollarSign size={14} className="mr-1" />
                <span>{salary}</span>
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <Calendar size={14} className="mr-1" />
              <span>Posted {formattedDate}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{truncatedDescription}</p>
          
          <div className="mt-3 mb-4">
            <div className="text-sm font-medium mb-2">Required Skills:</div>
            <div className="flex flex-wrap gap-1">
              {requiredSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-gray-100 dark:bg-purple/20 border-gray-200 dark:border-purple/30 text-gray-800 dark:text-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Link to={`/job/${id}`}>
              <Button variant="outline" className="text-sm group">
                View Details
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        {relevanceScore !== undefined && (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200 dark:text-gray-700" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className={`${relevanceColor} transition-all duration-1000 ease-in-out`}
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={`${251.2 * relevanceScore / 100} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm font-semibold">{relevanceScore}%</div>
              </div>
            </div>
            <div className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">Match</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;
