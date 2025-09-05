import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxLength = 150, 
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }

  const displayText = isExpanded ? text : text.slice(0, maxLength) + '...';

  return (
    <div className={className}>
      <p>{displayText}</p>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-0 h-auto font-semibold text-primary hover:text-primary/80 mt-1"
      >
        {isExpanded ? 'See less' : 'See more'}
      </Button>
    </div>
  );
};

export default ExpandableText;