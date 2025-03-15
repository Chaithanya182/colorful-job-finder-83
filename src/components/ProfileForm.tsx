
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SkillTag from './SkillTag';
import { useJobContext } from '@/context/JobContext';
import { searchSkills } from '@/utils/skillSuggestions';
import { User, Mail, MapPin, Calendar, Search, X } from 'lucide-react';

// Define the Skill interface to match the one from skillSuggestions.ts
interface Skill {
  id: string;
  name: string;
  category?: string;
}

const ProfileForm: React.FC = () => {
  const { setUserProfile, setHasSubmittedForm } = useJobContext();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [preferredLocation, setPreferredLocation] = useState('');
  
  const [skillSuggestions, setSkillSuggestions] = useState<Skill[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  
  // Validate form
  useEffect(() => {
    const isFormValid = 
      fullName.trim() !== '' && 
      email.trim() !== '' && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
      skills.length > 0;
    
    setIsValid(isFormValid);
  }, [fullName, email, skills]);
  
  // Handle clickaway from suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) && 
          skillInputRef.current && !skillInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch skill suggestions when input changes
  useEffect(() => {
    const fetchSkillSuggestions = async () => {
      if (skillInput.trim() === '') {
        setSkillSuggestions([]);
        return;
      }
      
      try {
        const results = await searchSkills(skillInput);
        setSkillSuggestions(results);
      } catch (error) {
        console.error('Error fetching skill suggestions:', error);
        setSkillSuggestions([]);
      }
    };
    
    // Debounce the API call
    const timer = setTimeout(() => {
      fetchSkillSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [skillInput]);
  
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSuggestions(true);
  };
  
  const handleAddSkill = (skill: string) => {
    if (skill.trim() !== '' && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
      setShowSuggestions(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      handleAddSkill(skillInput);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    const userProfile = {
      fullName,
      email,
      skills,
      yearsOfExperience,
      preferredLocation
    };
    
    setUserProfile(userProfile);
    setHasSubmittedForm(true);
  };
  
  const formFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      value: fullName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value),
      placeholder: 'Enter your full name',
      icon: <User className="text-gray-400" size={18} />,
      type: 'text',
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      placeholder: 'Enter your email address',
      icon: <Mail className="text-gray-400" size={18} />,
      type: 'email',
      required: true
    },
    {
      id: 'experience',
      label: 'Years of Experience',
      value: yearsOfExperience,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setYearsOfExperience(Number(e.target.value)),
      placeholder: '0',
      icon: <Calendar className="text-gray-400" size={18} />,
      type: 'number',
      min: 0,
      required: false
    },
    {
      id: 'location',
      label: 'Preferred Location',
      value: preferredLocation,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPreferredLocation(e.target.value),
      placeholder: 'Enter your preferred location',
      icon: <MapPin className="text-gray-400" size={18} />,
      type: 'text',
      required: false
    }
  ];
  
  return (
    <Card className="w-full max-w-md mx-auto glassmorphism overflow-hidden animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-display tracking-tight">Create Your Profile</CardTitle>
        <CardDescription>Tell us about yourself to find the perfect job match</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formFields.map((field, index) => (
            <div key={field.id} className="space-y-2 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {field.icon}
                </div>
                
                <Input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  className="pl-10 h-11 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
                  required={field.required}
                  min={field.min}
                />
              </div>
            </div>
          ))}
          
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: '320ms' }}>
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills <span className="text-red-500">*</span>
            </Label>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400" size={18} />
              </div>
              
              <Input
                id="skills"
                ref={skillInputRef}
                type="text"
                value={skillInput}
                onChange={handleSkillInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Add your skills..."
                className="pl-10 h-11 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
              />
              
              {showSuggestions && skillSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 glassmorphism rounded-xl py-2 shadow-lg animate-fade-in"
                >
                  {skillSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleAddSkill(suggestion.name)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {suggestion.name}
                      {suggestion.category && (
                        <span className="text-xs text-gray-500 ml-2">
                          {suggestion.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap mt-2 min-h-8">
              {skills.map((skill, index) => (
                <SkillTag 
                  key={index} 
                  name={skill} 
                  onRemove={() => handleRemoveSkill(skill)} 
                />
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!isValid}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-medium transition-all duration-300 ease-in-out animate-slide-up"
            style={{ animationDelay: '400ms' }}
          >
            Find Matching Jobs
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
