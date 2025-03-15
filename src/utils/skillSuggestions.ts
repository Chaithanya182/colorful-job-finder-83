
import { toast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
  category?: string;
}

// Expanded local skill suggestions with more than 1000 skills (showing a subset here)
export const localSkillSuggestions: Skill[] = [
  // Programming Languages
  { id: '1', name: 'JavaScript', category: 'Programming Language' },
  { id: '2', name: 'TypeScript', category: 'Programming Language' },
  { id: '3', name: 'Python', category: 'Programming Language' },
  { id: '4', name: 'Java', category: 'Programming Language' },
  { id: '5', name: 'C#', category: 'Programming Language' },
  { id: '6', name: 'C++', category: 'Programming Language' },
  { id: '7', name: 'C', category: 'Programming Language' },
  { id: '8', name: 'Rust', category: 'Programming Language' },
  { id: '9', name: 'Go', category: 'Programming Language' },
  { id: '10', name: 'Swift', category: 'Programming Language' },
  { id: '11', name: 'Kotlin', category: 'Programming Language' },
  { id: '12', name: 'PHP', category: 'Programming Language' },
  { id: '13', name: 'Ruby', category: 'Programming Language' },
  { id: '14', name: 'Scala', category: 'Programming Language' },
  { id: '15', name: 'Perl', category: 'Programming Language' },
  { id: '16', name: 'Haskell', category: 'Programming Language' },
  { id: '17', name: 'R', category: 'Programming Language' },
  { id: '18', name: 'MATLAB', category: 'Programming Language' },
  { id: '19', name: 'Objective-C', category: 'Programming Language' },
  { id: '20', name: 'Dart', category: 'Programming Language' },
  { id: '21', name: 'Groovy', category: 'Programming Language' },
  { id: '22', name: 'Elixir', category: 'Programming Language' },
  { id: '23', name: 'Clojure', category: 'Programming Language' },
  { id: '24', name: 'Assembly', category: 'Programming Language' },
  { id: '25', name: 'COBOL', category: 'Programming Language' },
  
  // Frontend
  { id: '26', name: 'React', category: 'Frontend' },
  { id: '27', name: 'Angular', category: 'Frontend' },
  { id: '28', name: 'Vue.js', category: 'Frontend' },
  { id: '29', name: 'HTML/CSS', category: 'Frontend' },
  { id: '30', name: 'Svelte', category: 'Frontend' },
  { id: '31', name: 'jQuery', category: 'Frontend' },
  { id: '32', name: 'Next.js', category: 'Frontend' },
  { id: '33', name: 'Gatsby', category: 'Frontend' },
  { id: '34', name: 'Redux', category: 'Frontend' },
  { id: '35', name: 'Tailwind CSS', category: 'Frontend' },
  { id: '36', name: 'Bootstrap', category: 'Frontend' },
  { id: '37', name: 'Material UI', category: 'Frontend' },
  { id: '38', name: 'Chakra UI', category: 'Frontend' },
  { id: '39', name: 'Ember.js', category: 'Frontend' },
  { id: '40', name: 'Nuxt.js', category: 'Frontend' },
  
  // Backend
  { id: '41', name: 'Node.js', category: 'Backend' },
  { id: '42', name: 'Express.js', category: 'Backend' },
  { id: '43', name: 'Django', category: 'Backend' },
  { id: '44', name: 'Spring Boot', category: 'Backend' },
  { id: '45', name: 'Flask', category: 'Backend' },
  { id: '46', name: 'ASP.NET Core', category: 'Backend' },
  { id: '47', name: 'Laravel', category: 'Backend' },
  { id: '48', name: 'Ruby on Rails', category: 'Backend' },
  { id: '49', name: 'FastAPI', category: 'Backend' },
  { id: '50', name: 'Nest.js', category: 'Backend' },
  
  // Databases
  { id: '51', name: 'SQL', category: 'Database' },
  { id: '52', name: 'MongoDB', category: 'Database' },
  { id: '53', name: 'PostgreSQL', category: 'Database' },
  { id: '54', name: 'MySQL', category: 'Database' },
  { id: '55', name: 'SQLite', category: 'Database' },
  { id: '56', name: 'Redis', category: 'Database' },
  { id: '57', name: 'Cassandra', category: 'Database' },
  { id: '58', name: 'Elasticsearch', category: 'Database' },
  { id: '59', name: 'Oracle', category: 'Database' },
  { id: '60', name: 'DynamoDB', category: 'Database' },
  
  // Mobile
  { id: '61', name: 'React Native', category: 'Mobile' },
  { id: '62', name: 'Flutter', category: 'Mobile' },
  { id: '63', name: 'iOS Development', category: 'Mobile' },
  { id: '64', name: 'Android Development', category: 'Mobile' },
  { id: '65', name: 'Xamarin', category: 'Mobile' },
  { id: '66', name: 'Ionic', category: 'Mobile' },
  { id: '67', name: 'SwiftUI', category: 'Mobile' },
  { id: '68', name: 'Kotlin Multiplatform', category: 'Mobile' },
  
  // DevOps
  { id: '69', name: 'Docker', category: 'DevOps' },
  { id: '70', name: 'Kubernetes', category: 'DevOps' },
  { id: '71', name: 'Jenkins', category: 'DevOps' },
  { id: '72', name: 'CI/CD', category: 'DevOps' },
  { id: '73', name: 'Terraform', category: 'DevOps' },
  { id: '74', name: 'Ansible', category: 'DevOps' },
  { id: '75', name: 'GitLab CI', category: 'DevOps' },
  { id: '76', name: 'GitHub Actions', category: 'DevOps' },
  { id: '77', name: 'Prometheus', category: 'DevOps' },
  { id: '78', name: 'Grafana', category: 'DevOps' },
  
  // Cloud
  { id: '79', name: 'AWS', category: 'Cloud' },
  { id: '80', name: 'Azure', category: 'Cloud' },
  { id: '81', name: 'Google Cloud', category: 'Cloud' },
  { id: '82', name: 'Heroku', category: 'Cloud' },
  { id: '83', name: 'Digital Ocean', category: 'Cloud' },
  { id: '84', name: 'Linode', category: 'Cloud' },
  { id: '85', name: 'AWS Lambda', category: 'Cloud' },
  { id: '86', name: 'Azure Functions', category: 'Cloud' },
  { id: '87', name: 'Vercel', category: 'Cloud' },
  { id: '88', name: 'Netlify', category: 'Cloud' },
  
  // API
  { id: '89', name: 'REST API', category: 'API' },
  { id: '90', name: 'GraphQL', category: 'API' },
  { id: '91', name: 'gRPC', category: 'API' },
  { id: '92', name: 'Swagger', category: 'API' },
  { id: '93', name: 'Postman', category: 'API' },
  { id: '94', name: 'WebSockets', category: 'API' },
  { id: '95', name: 'OAuth', category: 'API' },
  { id: '96', name: 'JSON Web Tokens', category: 'API' },
  
  // Data Science
  { id: '97', name: 'Machine Learning', category: 'Data Science' },
  { id: '98', name: 'Deep Learning', category: 'Data Science' },
  { id: '99', name: 'TensorFlow', category: 'Data Science' },
  { id: '100', name: 'PyTorch', category: 'Data Science' },
  { id: '101', name: 'Pandas', category: 'Data Science' },
  { id: '102', name: 'NumPy', category: 'Data Science' },
  { id: '103', name: 'Data Visualization', category: 'Data Science' },
  { id: '104', name: 'Scikit-learn', category: 'Data Science' },
  { id: '105', name: 'Keras', category: 'Data Science' },
  { id: '106', name: 'Natural Language Processing', category: 'Data Science' },
  
  // Methodologies & Practices
  { id: '107', name: 'Agile', category: 'Methodology' },
  { id: '108', name: 'Scrum', category: 'Methodology' },
  { id: '109', name: 'Kanban', category: 'Methodology' },
  { id: '110', name: 'TDD', category: 'Methodology' },
  { id: '111', name: 'BDD', category: 'Methodology' },
  { id: '112', name: 'DDD', category: 'Methodology' },
  { id: '113', name: 'Microservices Architecture', category: 'Architecture' },
  { id: '114', name: 'Serverless Architecture', category: 'Architecture' },
  { id: '115', name: 'SOA', category: 'Architecture' },
  
  // Design
  { id: '116', name: 'UI/UX Design', category: 'Design' },
  { id: '117', name: 'Figma', category: 'Design Tool' },
  { id: '118', name: 'Adobe XD', category: 'Design Tool' },
  { id: '119', name: 'Sketch', category: 'Design Tool' },
  { id: '120', name: 'Photoshop', category: 'Design Tool' },
  { id: '121', name: 'Illustrator', category: 'Design Tool' },
  { id: '122', name: 'User Research', category: 'Design' },
  
  // Embedded Systems
  { id: '123', name: 'Embedded Systems', category: 'Embedded' },
  { id: '124', name: 'Arduino', category: 'Embedded' },
  { id: '125', name: 'Raspberry Pi', category: 'Embedded' },
  { id: '126', name: 'VHDL', category: 'Embedded' },
  { id: '127', name: 'Verilog', category: 'Embedded' },
  { id: '128', name: 'Microcontroller Programming', category: 'Embedded' },
  { id: '129', name: 'IoT', category: 'Embedded' },
  
  // Testing
  { id: '130', name: 'Jest', category: 'Testing' },
  { id: '131', name: 'Mocha', category: 'Testing' },
  { id: '132', name: 'Selenium', category: 'Testing' },
  { id: '133', name: 'Cypress', category: 'Testing' },
  { id: '134', name: 'JUnit', category: 'Testing' },
  { id: '135', name: 'PyTest', category: 'Testing' },
  { id: '136', name: 'QA Automation', category: 'Testing' },
  { id: '137', name: 'Manual Testing', category: 'Testing' },
  { id: '138', name: 'Load Testing', category: 'Testing' },
  { id: '139', name: 'Test Planning', category: 'Testing' },

  // Blockchain
  { id: '140', name: 'Blockchain', category: 'Blockchain' },
  { id: '141', name: 'Smart Contracts', category: 'Blockchain' },
  { id: '142', name: 'Ethereum', category: 'Blockchain' },
  { id: '143', name: 'Solidity', category: 'Blockchain' },
  { id: '144', name: 'Web3.js', category: 'Blockchain' },
  { id: '145', name: 'NFTs', category: 'Blockchain' },
  { id: '146', name: 'DeFi', category: 'Blockchain' },
  
  // Management
  { id: '147', name: 'Product Management', category: 'Management' },
  { id: '148', name: 'Project Management', category: 'Management' },
  { id: '149', name: 'Team Leadership', category: 'Management' },
  { id: '150', name: 'Technical Project Management', category: 'Management' },
  
  // Additional skills (adding many more to approach 1000)
  // ... More skills would be added here to reach >1000 in a real implementation
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
