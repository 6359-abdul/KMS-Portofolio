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
  role: "Python Full Stack Developer",
  period: "September (2025)- Present",
  location: "Hyderabad, India",
  details: [
    "Developing and maintaining full-stack ERP modules using modern frontend and backend technologies to support academic and administrative workflows.",
    "Designing responsive user interfaces for ERP dashboards and data-driven views to improve usability and operational efficiency.",
    "Building and integrating RESTful APIs to handle student data, authentication, and ERP business logic.",
    "Implementing backend services for data processing, validation, and secure storage within the ERP system.",
    "Working with relational databases to design schemas, write optimized queries, and ensure data integrity across ERP modules.",
    "Handling data migration, API integrations, and system configuration to ensure smooth ERP deployments and upgrades.",
    "Collaborating with stakeholders to gather requirements, implement feature enhancements, and provide ERP system training.",
    "Coordinating with ERP vendors to debug production issues, resolve data inconsistencies, and address security-related concerns."
  ]
  },
  {
  company: "MS Educational and Welfare Trust",
  role: "Data Analyst",
  period: "Feb 2025 - September 2025",
  location: "Hyderabad, India",
  details: [
    "Tested, analyzed, and validated complex student datasets to support data-driven academic and administrative decision-making.",
    "Managed the upload and maintenance of critical institutional data within MCB ERP, ensuring accuracy, consistency, and compliance with data standards.",
    "Executed seamless data migration processes, performing data validation and reconciliation to maintain data integrity and optimize reporting.",
    "Analyzed student data and developed visual reports and dashboards within the ERP system to track performance, enrollment, and operational metrics.",
    "Performed data cleaning, transformation, and de-duplication to improve data quality and reliability of analytical outputs.",
    "Collaborated with stakeholders to gather reporting requirements and delivered ERP training to enable effective, data-driven system usage.",
    "Coordinated with ERP vendors to investigate and resolve data discrepancies, system issues, and potential data security incidents."
  ]
  },
  

  {
  company: "Res-q Service Pvt. Ltd (Reliance Retail Industries)",
  role: "Data Analyst",
  period: "June 2025 - December 2025",
  location: "Kakinada, India",
  details: [
    "Analyzed large-scale customer service datasets across India to identify and filter customers within assigned local pin code regions.",
    "Performed data segmentation and location-based analysis to assign nearby service technicians for product installation and repair requests.",
    "Analyzed service demand data to estimate technician requirements and coordinated with Reliance Retail store vendors for workforce planning.",
    "Tracked service calls from initiation to closure, analyzing turnaround time (TAT), service efficiency, and resolution metrics.",
    "Generated and analyzed operational reports to evaluate service performance and support data-driven decision-making.",
    "Worked extensively with SAP CRM to manage customer records, service tickets, and reporting workflows.",
    "Ensured data accuracy and consistency while handling high-volume service and customer datasets."
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
