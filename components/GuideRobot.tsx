import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

interface GuideRobotProps {
  className?: string;
}

const sectionMessages = {
  hero: {
    title: "Welcome Aboard! 🚀",
    message: "I'm RoboGuide! Click me anytime for tips. Let's explore this amazing portfolio together!",
    tip: "Scroll down to discover more!"
  },
  about: {
    title: "About Section 📚",
    message: "Here you'll learn about Kareemulla's journey in Machine Learning and AI. Pretty impressive, right?",
    tip: "Click the robot avatar to see it spin!"
  },
  skills: {
    title: "Tech Arsenal 💪",
    message: "These are the technologies mastered! Hover over the skill bars to see them in action.",
    tip: "Python and ML skills are top-tier!"
  },
  projects: {
    title: "Projects Showcase 🎯",
    message: "Check out these amazing projects! Each one demonstrates real-world problem-solving.",
    tip: "Click the links to learn more!"
  },
  contact: {
    title: "Let's Connect! 🤝",
    message: "Ready to collaborate? These links will take you to GitHub, Kaggle, and email!",
    tip: "Don't be shy, reach out!"
  }
};

export const GuideRobot: React.FC<GuideRobotProps> = ({ className = "" }) => {
  const [currentSection, setCurrentSection] = useState<keyof typeof sectionMessages>('hero');
  const [showMessage, setShowMessage] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const robotRef = useRef<HTMLDivElement>(null);

  // Detect current section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition < windowHeight * 0.5) {
        setCurrentSection('hero');
      } else if (scrollPosition < windowHeight * 1.5) {
        setCurrentSection('about');
      } else if (scrollPosition < windowHeight * 2.5) {
        setCurrentSection('skills');
      } else if (scrollPosition < windowHeight * 3.5) {
        setCurrentSection('projects');
      } else {
        setCurrentSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-show message on section change
  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSection]);

  // Robot click handler
  const handleRobotClick = () => {
    setIsClicked(true);
    setShowMessage(true);
    setClickCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsClicked(false);
    }, 600);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 8000);
  };

  // Get click response message
  const getClickMessage = () => {
    const responses = [
      "Hey there! 👋 Keep exploring!",
      "You found me! 🎉 Click the sections above!",
      "Boop! 🤖 I'm here to help!",
      "Nice click! ⚡ Let's keep going!",
      "RoboGuide at your service! 🚀",
      "Beep boop! 💫 Loving the portfolio?"
    ];
    return responses[clickCount % responses.length];
  };

  const currentMessage = sectionMessages[currentSection];

  return (
    <>
      {/* Guide Robot */}
      <div
        ref={robotRef}
        className={`fixed bottom-8 right-8 z-50 cursor-pointer transform transition-all duration-300 hover:scale-110 ${
          isClicked ? 'scale-95' : ''
        } ${className}`}
        onClick={handleRobotClick}
        style={{
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        {/* Robot Character */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur-xl opacity-50 animate-pulse"></div>
          
          {/* Robot body */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-neon-blue shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-16 h-16"
              style={{
                transform: isClicked ? 'rotate(360deg)' : 'rotate(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Antenna */}
              <line x1="50" y1="15" x2="50" y2="5" stroke="#00f3ff" strokeWidth="3" />
              <circle cx="50" cy="5" r="4" fill="#ff0000" className="animate-pulse" />

              {/* Head */}
              <circle cx="50" cy="40" r="20" fill="#ffffff" />
              
              {/* Eyes */}
              <circle cx="42" cy="38" r="4" fill="#000000">
                <animate attributeName="cy" values="38;40;38" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="58" cy="38" r="4" fill="#000000">
                <animate attributeName="cy" values="38;40;38" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Smile */}
              <path d="M 40 45 Q 50 50 60 45" stroke="#000000" strokeWidth="2" fill="none" />
              
              {/* Body */}
              <rect x="35" y="60" width="30" height="25" rx="5" fill="#00f3ff" />
              
              {/* Arms */}
              <rect x="25" y="65" width="8" height="15" rx="4" fill="#ffffff" />
              <rect x="67" y="65" width="8" height="15" rx="4" fill="#ffffff" />
              
              {/* Legs */}
              <rect x="40" y="85" width="8" height="12" rx="2" fill="#00f3ff" />
              <rect x="52" y="85" width="8" height="12" rx="2" fill="#00f3ff" />
            </svg>
          </div>

          {/* Click indicator */}
          {!showMessage && (
            <div className="absolute -top-2 -right-2 bg-neon-purple rounded-full p-2 animate-bounce">
              <MessageCircle size={16} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Message Bubble */}
      {showMessage && (
        <div 
          className="fixed bottom-32 right-8 z-50 max-w-xs animate-slide-up"
          style={{
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div className="glass-panel p-4 rounded-xl border-2 border-neon-blue shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMessage(false);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Message content */}
            <div className="flex items-start gap-3">
              <Sparkles className="text-neon-blue flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  {clickCount > 0 ? "RoboGuide Says:" : currentMessage.title}
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  {clickCount > 0 ? getClickMessage() : currentMessage.message}
                </p>
                <p className="text-xs text-neon-blue font-mono">
                  💡 {currentMessage.tip}
                </p>
              </div>
            </div>

            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-gray-900 border-r-2 border-b-2 border-neon-blue transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
