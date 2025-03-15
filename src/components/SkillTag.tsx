
import React from 'react';
import { X } from 'lucide-react';

interface SkillTagProps {
  name: string;
  onRemove: () => void;
}

const SkillTag: React.FC<SkillTagProps> = ({ name, onRemove }) => {
  return (
    <div className="skill-tag animate-scale-in" style={{ animationDuration: '0.2s' }}>
      <span className="mr-1">{name}</span>
      <button 
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
        aria-label={`Remove ${name} skill`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default SkillTag;
