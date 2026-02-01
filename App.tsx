import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { GalaxyScene } from './components/GalaxyScene';
import { GuideRobot } from './components/GuideRobot';
import { PERSONAL_INFO, SKILLS, PROJECTS, EXPERIENCE, CERTIFICATIONS, EDUCATION } from './constants';
import { Brain, Cpu, Database, ChevronDown, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';

const LoadingScreen = () => (
  <div className="flex items-center justify-center w-full h-screen bg-black text-neon-blue">
    <div className="text-2xl font-mono animate-pulse">Initializing Neural Interface...</div>
  </div>
);

// Mini Avatar Component for Headings - OPTIMIZED to prevent "Context Lost" crash
// Using a 3D Canvas here creates too many WebGL contexts. Using a stylized CSS animation instead.
const MiniAvatar = () => {
  const [rotation, setRotation] = useState(0);

  const activate = () => {
    setRotation(prev => prev + 1080); // Spin 3 times (360 * 3)
  };

  return (
    <div
      onClick={activate}
      className="w-16 h-16 flex items-center justify-center relative cursor-pointer hover:scale-110"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-md animate-pulse"></div>
      <div className="relative z-10 p-1 border border-teal-400/50 rounded-full bg-black/60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-10 h-10 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          {/* Antenna */}
          <line x1="50" y1="20" x2="50" y2="5" stroke="gray" strokeWidth="3" />
          <circle cx="50" cy="5" r="5" fill="#ff0000" />

          {/* Ears/Knobs */}
          <path d="M15 55 Q 10 55 10 65 Q 10 75 15 75" fill="gray" />
          <path d="M85 55 Q 90 55 90 65 Q 90 75 85 75" fill="gray" />

          {/* Body/Head */}
          <circle cx="50" cy="55" r="35" fill="#008080" />

          {/* Visor/Forehead */}
          <path d="M30 45 Q 50 30 70 45" stroke="black" strokeWidth="3" fill="none" />

          {/* Eyes */}
          <circle cx="38" cy="55" r="10" fill="white" />
          <circle cx="38" cy="55" r="4" fill="black" />

          <circle cx="62" cy="55" r="10" fill="white" />
          <circle cx="62" cy="55" r="4" fill="black" />
        </svg>
      </div>
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section = ({ children, className = "", id = "" }: SectionProps) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center p-6 md:p-20 ${className}`}>
    {children}
  </section>
);

interface SkillBarProps {
  name: string;
  level: number;
  icon: any;
}

const SkillBar = ({ name, level, icon: Icon }: SkillBarProps) => (
  <div className="mb-4 group">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2 text-gray-300 group-hover:text-neon-blue transition-colors">
        <Icon size={16} />
        <span className="font-mono text-sm">{name}</span>
      </div>
      <span className="text-xs text-gray-500">{level}%</span>
    </div>
    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000 ease-out"
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);

interface ProjectCardProps {
  project: any;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <div className="glass-panel p-6 rounded-xl hover:neon-border transition-all duration-300 transform hover:-translate-y-2">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white">{project.title}</h3>
      <a href={project.link} className="text-neon-blue hover:text-white transition-colors">
        <ExternalLink size={20} />
      </a>
    </div>
    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
      {project.description}
    </p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.tech.map((t: string) => (
        <span key={t} className="px-2 py-1 text-xs font-mono border border-neon-blue/30 rounded text-neon-blue/80">
          {t}
        </span>
      ))}
    </div>
    <div className="text-xs font-mono text-neon-green">
      STATUS: {project.stats}
    </div>
  </div>
);

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="flex items-center gap-4 mb-6 md:mb-10">
    <MiniAvatar />
    <h2 className="text-4xl font-bold flex items-center gap-3">
      {Icon && <Icon className="text-neon-purple" />}
      {children}
    </h2>
  </div>
);


const UIContent = () => {
  const scroll = useScroll();
  const [opacity, setOpacity] = useState(1);

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <Section className="items-start">
        <div className="max-w-4xl">
          <div className="inline-block px-3 py-1 mb-4 border border-neon-blue/50 rounded-full bg-neon-blue/10">
            <span className="text-xs font-mono text-neon-blue">SYSTEM ONLINE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              SHAIK
              <br />
              KAREEMULLA SHA
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue bg-[length:200%_auto] animate-[gradient_5s_ease-in-out_infinite]">
              ABDUL LATHEEF
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl font-light">
            {PERSONAL_INFO.role} & <span className="text-neon-purple">Data Strategist</span>.
            <br />
            {PERSONAL_INFO.tagline}.
          </p>

          <div className="flex gap-4">
            <a href="#projects" className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-neon-blue hover:text-black transition-all">
              View Work
            </a>
            <a href="#contact" className="px-8 py-3 border border-white/20 text-white font-bold rounded hover:border-neon-purple hover:text-neon-purple transition-all">
              Contact
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
          <ChevronDown size={12} />
        </div>
      </Section>

      {/* About Section */}
      <Section className="items-center">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full">
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full -mr-16 -mt-16"></div>

            <SectionHeading icon={Brain}>About Me</SectionHeading>

            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {PERSONAL_INFO.description}
            </p>
            <div className="p-4 bg-white/5 rounded-lg border-l-4 border-neon-blue">
              <p className="text-sm font-mono text-gray-400">
                "Transitioning from Python foundations to advanced AI architecture."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-neon-blue">Education</h3>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">{EDUCATION.degree}</span>
                <span className="text-sm text-gray-400">{EDUCATION.school} | {EDUCATION.year}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{EDUCATION.specialization}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-neon-blue">Certifications</h3>
              <ul className="space-y-3">
                {CERTIFICATIONS.map((cert, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section>
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex justify-center mb-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-4">
                <MiniAvatar />
                <h2 className="text-4xl font-bold">
                  Technical <span className="text-neon-blue">Arsenal</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-mono mb-6 text-gray-400 flex items-center gap-2">
                <Cpu size={20} /> CORE TECH
              </h3>
              {SKILLS.filter(s => s.category === 'Core' || s.category === 'Language').map(skill => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} icon={skill.icon} />
              ))}
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-mono mb-6 text-gray-400 flex items-center gap-2">
                <Database size={20} /> DATA & TOOLS
              </h3>
              {SKILLS.filter(s => s.category === 'Database' || s.category === 'Tools').map(skill => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} icon={skill.icon} />
              ))}
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-mono mb-6 text-gray-400 flex items-center gap-2">
                <Brain size={20} /> AI & FRAMEWORKS
              </h3>
              {SKILLS.filter(s => s.category === 'Framework' || s.category === 'AI').map(skill => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} icon={skill.icon} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Experience & Projects */}
      <Section id="projects">
        <div className="max-w-6xl w-full mx-auto">
          <div className="mb-20">
            <div className="border-b border-gray-800 pb-4 mb-10">
              <SectionHeading>Experience Log</SectionHeading>
            </div>
            <div className="space-y-8">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
                  <div className="md:w-1/4">
                    <div className="text-neon-blue font-bold text-lg">{exp.company}</div>
                    <div className="text-sm text-gray-500">{exp.period}</div>
                    {exp.location && <div className="text-xs text-gray-600 mt-1">{exp.location}</div>}
                  </div>
                  <div className="md:w-3/4">
                    <h4 className="text-xl font-semibold mb-2">{exp.role}</h4>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      {exp.details.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="border-b border-gray-800 pb-4 mb-10">
              <SectionHeading>Key Projects</SectionHeading>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {PROJECTS.map((proj, i) => (
                <ProjectCard key={i} project={proj} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="items-center text-center">
        <div className="glass-panel p-12 rounded-3xl max-w-3xl w-full border border-neon-blue/20">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-4">
              <MiniAvatar />
              <h2 className="text-5xl font-bold">Let's <span className="text-neon-purple">Collaborate</span></h2>
            </div>
          </div>

          <p className="text-xl text-gray-300 mb-10">
            Ready to embark on the next chapter in Machine Learning and AI Engineering.
            Available for opportunities.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={PERSONAL_INFO.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all hover:scale-105"
            >
              <Github className="text-white" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.contact.kaggle}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all hover:scale-105"
            >
              <div className="font-bold">K</div>
              <span>Kaggle</span>
            </a>
            <a
              href={PERSONAL_INFO.contact.email}
              className="flex items-center gap-3 px-6 py-4 bg-neon-blue text-black font-bold rounded-lg hover:bg-cyan-300 transition-all hover:scale-105"
            >
              <Mail />
              <span>Contact Me</span>
            </a>
          </div>
        </div>
        <footer className="absolute bottom-4 text-xs text-gray-600 font-mono">
          SYSTEM_VERSION_2.0 // SHAIK_KAREEMULLA
        </footer>
      </Section>
    </div>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="h-screen w-full bg-dark-bg text-white overflow-hidden relative">
      {/* Main Portfolio - Hidden during intro */}
      {!showIntro && (
        <>
          {/* The 3D Canvas Background */}
          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
            >
              <GalaxyScene />
            </Canvas>
          </div>

          <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scroll-smooth">
            <UIContent />
          </div>

          {/* Interactive Guide Robot */}
          <GuideRobot />
        </>
      )}
    </div>
  );
}

export default App;
