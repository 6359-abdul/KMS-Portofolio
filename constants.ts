import { Brain, Code, Database, Globe, Layers, Server, Terminal, Workflow } from "lucide-react";

export const PERSONAL_INFO = {
  name: "Shaik Kareemulla Sha Abdul Latheef",
  role: "Machine Learning & AI Engineer",
  tagline: "Bridging Data Science and Intelligent Systems",
  description: "As a driven and passionate learner, I'm currently exploring the realm of Machine Learning and AI. With a strong foundation in Python and Data Analysis, I build robust predictive models and intelligent systems.",
  contact: {
    github: "https://github.com/6359-abdul",
    kaggle: "https://www.kaggle.com/kms_abdul",
    email: "mailto:contact@example.com" // Placeholder based on prompt
  }
};

export const SKILLS = [
  { name: "Python", category: "Language", level: 90, icon: Terminal },
  { name: "Machine Learning", category: "Core", level: 85, icon: Brain },
  { name: "PyTorch", category: "Framework", level: 80, icon: Layers },
  { name: "Data Analysis", category: "Core", level: 90, icon: Workflow },
  { name: "SQL & Databases", category: "Database", level: 85, icon: Database },
  { name: "Web Dev (Java)", category: "Dev", level: 75, icon: Globe },
  { name: "Power BI", category: "Tools", level: 85, icon: Server },
  { name: "Generative AI", category: "Core", level: 80, icon: Code },
];

export const PROJECTS = [
  {
    title: "Heart Disease Prediction",
    description: "A robust machine learning predictor focused on analyzing and predicting the likelihood of heart disease. Implemented using multiple algorithms with rigorous hyperparameter tuning.",
    tech: ["Python", "Scikit-Learn", "Pandas", "Healthcare AI"],
    stats: "Accuracy Optimized",
    link: "#"
  },
  {
    title: "MCB ERP System Integration",
    description: "Led data migration and system integration for educational institutions. Customized modules for academic workflows and ensured seamless onboarding.",
    tech: ["ERP", "Data Migration", "SQL", "Excel Automation"],
    stats: "Active Role",
    link: "#"
  }
];

export const EXPERIENCE = [
  {
    company: "MS Educational and Welfare Trust",
    role: "Data Analyst",
    period: "Feb 2025 - Present",
    location: "Hyderabad, India",
    details: [
      "Testing and analyzing complex datasets to support data-driven decision making.",
      "Uploading critical data into MCB ERP software.",
      "Ensuring seamless data migration and optimized reporting."
    ]
  },
  {
    company: "Adhoc Network Tech Company",
    role: "Project Intern",
    period: "Feb 2024 - July 2024",
    location: "Vishakhapatnam, India",
    details: [
      "Gained hands-on experience in cutting-edge technology projects.",
      "Collaborated with experienced developers to deliver high-quality solutions."
    ]
  },
  {
    company: "Java Fullstack Internship",
    role: "Intern",
    period: "Short-term",
    details: [
      "Focused on registration and database management.",
      "Gained insights into SDLC and database optimization."
    ]
  }
];

export const CERTIFICATIONS = [
  "Getting Started with Machine Learning with PyTorch",
  "Python for Data Science (IBM)",
  "Career Essentials in Generative AI (Microsoft & LinkedIn)"
];

export const EDUCATION = {
  degree: "Bachelor of Computer Applications (BCA)",
  school: "Aditya Degree College, Kakinada",
  year: "2021",
  specialization: "Computer Systems Networking and Telecommunications"
};