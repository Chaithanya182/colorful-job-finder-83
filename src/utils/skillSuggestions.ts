
import { toast } from "@/components/ui/use-toast";

interface Skill {
  id: string;
  name: string;
  category?: string;
}

// Backup local data in case API fails
export const localSkillSuggestions: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend' },
  { id: '2', name: 'TypeScript', category: 'Programming Language' },
  { id: '3', name: 'Node.js', category: 'Backend' },
  { id: '4', name: 'JavaScript', category: 'Programming Language' },
  { id: '5', name: 'HTML/CSS', category: 'Frontend' },
  { id: '6', name: 'Python', category: 'Programming Language' },
  { id: '7', name: 'Java', category: 'Programming Language' },
  { id: '8', name: 'C#', category: 'Programming Language' },
  { id: '9', name: 'SQL', category: 'Database' },
  { id: '10', name: 'MongoDB', category: 'Database' },
  { id: '11', name: 'GraphQL', category: 'API' },
  { id: '12', name: 'REST API', category: 'API' },
  { id: '13', name: 'Docker', category: 'DevOps' },
  { id: '14', name: 'Kubernetes', category: 'DevOps' },
  { id: '15', name: 'AWS', category: 'Cloud' },
  { id: '16', name: 'Azure', category: 'Cloud' },
  { id: '17', name: 'Google Cloud', category: 'Cloud' },
  { id: '18', name: 'Git', category: 'Version Control' },
  { id: '19', name: 'Agile', category: 'Methodology' },
  { id: '20', name: 'Scrum', category: 'Methodology' },
  { id: '21', name: 'UI/UX Design', category: 'Design' },
  { id: '22', name: 'Figma', category: 'Design Tool' },
  { id: '23', name: 'Adobe XD', category: 'Design Tool' },
  { id: '24', name: 'Product Management', category: 'Management' },
  { id: '25', name: 'Project Management', category: 'Management' }
];

export const searchSkills = async (query: string): Promise<Skill[]> => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  try {
    // First try to fetch from O*NET API
    const response = await fetch(`https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(normalizedQuery)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch skills from O*NET');
    }
    
    const data = await response.json();
    
    // Transform O*NET data to our Skill interface
    if (data && Array.isArray(data.occupation)) {
      const skills = data.occupation.slice(0, 5).map((occ: any, index: number) => ({
        id: `onet-${index}`,
        name: occ.title,
        category: occ.code
      }));
      
      return skills;
    }
    
    throw new Error('Invalid response from O*NET');
  } catch (error) {
    console.error('Error fetching skills from O*NET:', error);
    
    // Fallback to local data
    return localSkillSuggestions
      .filter(skill => skill.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 5);
  }
};
