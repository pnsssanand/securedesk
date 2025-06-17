
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key } from 'lucide-react';

interface IntroAnimationProps {
  onAnimationComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => setStage(4), 3500);
    const timer5 = setTimeout(() => onAnimationComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center security-gradient overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Shield animation */}
        <div className="mb-8 relative">
          <div 
            className={`transition-all duration-1000 ${
              stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <div className="relative">
              <Shield 
                className={`w-24 h-24 mx-auto text-white transition-all duration-1000 ${
                  stage >= 2 ? 'animate-pulse' : ''
                }`} 
              />
              {stage >= 2 && (
                <>
                  <Lock 
                    className="w-8 h-8 text-blue-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <Key 
                    className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin"
                    style={{ animationDelay: '1s' }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Text animation */}
        <div className="space-y-4">
          <h1 
            className={`text-5xl md:text-7xl font-bold text-white transition-all duration-1000 ${
              stage >= 3 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
          >
            Secure<span className="text-blue-300">Desk</span>
          </h1>
          
          <p 
            className={`text-xl md:text-2xl text-blue-100 transition-all duration-1000 ${
              stage >= 4 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
            style={{ transitionDelay: '0.5s' }}
          >
            Securing Your Digital Life, One Password at a Time
          </p>

          {stage >= 4 && (
            <div className="mt-8 animate-pulse">
              <div className="w-16 h-1 bg-white/50 mx-auto rounded-full">
                <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
