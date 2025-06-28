import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Heart, Code, Coffee, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const [heartBeat, setHeartBeat] = useState(false);
  const [hover, setHover] = useState('');
  
  // Create heartbeat animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartBeat(true);
      setTimeout(() => setHeartBeat(false), 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={cn("px-4 py-3 text-center text-sm text-muted-foreground transition-all duration-200", className)}>
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        <span>Designed & Developed with</span>
        
        <div 
          className="group relative cursor-pointer"
          onMouseEnter={() => setHover('code')}
          onMouseLeave={() => setHover('')}
        >
          <div className="transition-transform hover:scale-125">
            <Code 
              className="inline h-4 w-4 mx-1 text-blue-500"
            />
          </div>
          {hover === 'code' && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground py-1 px-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Code
            </div>
          )}
        </div>
        
        <span>and</span>
        
        <div 
          className="group relative cursor-pointer"
          onMouseEnter={() => setHover('heart')}
          onMouseLeave={() => setHover('')}
        >
          <div className={cn(
            "transition-all", 
            heartBeat ? "scale-150" : "hover:scale-125", 
            "duration-300"
          )}>
            <Heart 
              className="inline h-4 w-4 mx-1 text-red-500 fill-red-500"
              fill={heartBeat ? "currentColor" : undefined}
            />
          </div>
          {hover === 'heart' && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground py-1 px-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Passion
            </div>
          )}
        </div>
        
        <div 
          className="group relative cursor-pointer"
          onMouseEnter={() => setHover('coffee')}
          onMouseLeave={() => setHover('')}
        >
          <div className="transition-transform hover:scale-125">
            <Coffee
              className="inline h-4 w-4 mx-1 text-amber-700"
            />
          </div>
          {hover === 'coffee' && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground py-1 px-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Coffee
            </div>
          )}
        </div>
        
        <span>by</span>
        
        <a 
          href="https://github.com/anandpinisetti"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative font-medium text-primary hover:text-primary/80 transition-colors duration-200 flex items-center"
          onMouseEnter={() => setHover('name')}
          onMouseLeave={() => setHover('')}
        >
          Mr. Anand Pinisetty
          <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
          
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex gap-2 -mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <a 
              href="https://github.com/anandpinisetti" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-1 transition-colors"
            >
              <Github className="h-3 w-3" />
            </a>
            <a 
              href="https://linkedin.com/in/anandpinisetti" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-1 transition-colors"
            >
              <Linkedin className="h-3 w-3" />
            </a>
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
