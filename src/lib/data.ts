export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  displayRole: string;
  roleWordAccent: string;
  homeQuote: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  timeZone: string;
  resumeSummary: string;
  shortBio: string;
  github: string;
  linkedin: string;
  leetcode: string;
  resumePath: string;
  currentStatus: string;
  studentId: string;
  department: string;
  validTill: string;
  institution: string;
  cgpa: string;
  interpersonalSkills: string[];
  interests: string[];
}

export interface NavItem {
  id: string;
  label: string;
  index: string;
  href: string;
}

export interface SkillItem {
  atomicNumber: number;
  symbol: string;
  name: string;
  family: 'Languages' | 'Concepts' | 'Databases' | 'Cloud' | 'Tools' | 'Interpersonal';
  isBrand: boolean;
  logoKey?: string;
  description: string;
  projects: string[];
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  technologies: string[];
  githubUrl: string;
  repoName: string;
  mockupType: 'email-classifier' | 'library-management' | 'instruction-simulator';
}

export interface CertificationItem {
  id: string;
  number: string;
  title: string;
  code: string;
  issuer: string;
  year: string;
  description: string;
  imageUrl?: string;
  pdfUrl?: string;
  verificationCode?: string;
  verificationUrl?: string;
  issueDate?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  grade: string;
  gradeType: 'CGPA' | 'Percentage';
  details: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  place: string;
  detail: string;
  category: 'education' | 'achievement' | 'next';
  highlight?: boolean;
}

export interface AchievementItem {
  id: string;
  index: string;
  metric?: string;
  numericTarget?: number;
  suffix?: string;
  label: string;
  platform: string;
  logoKey: string;
  brandColor: string;
  detail: string;
  images?: string[];
  imageCaptions?: string[];
  imageType?: 'certificate' | 'photo';
  imageTypes?: ('certificate' | 'photo')[];
}

export const PROFILE: Profile = {
  name: 'Saanvi Aggarwal',
  firstName: 'Saanvi',
  lastName: 'Aggarwal',
  initials: 'SA',
  role: 'Computer Science & Engineering (AI) Student',
  displayRole: 'Computer Science and Engineering (AI) student with a passion for software development and Artificial Intelligence.',
  roleWordAccent: 'student',
  homeQuote: 'Building with curiosity, solving with logic, growing with every challenge.',
  email: 'saanviaggarwal62@gmail.com',
  phone: '+91 8679400062',
  phoneHref: 'tel:+918679400062',
  location: 'Chandigarh, India',
  timeZone: 'Asia/Kolkata',
  resumeSummary:
    'Computer Science and Engineering (AI) student with a strong foundation in C++, Python, Data Structures and Algorithms, SQL, and Artificial Intelligence. Interested in software development and AI, with hands-on experience building AI-driven applications and solving real-world problems.',
  shortBio:
    'Interested in software development and AI, with hands-on experience building AI-driven applications and solving real-world problems.',
  github: 'https://github.com/saanvi-aggarwal',
  linkedin: 'https://www.linkedin.com/in/saanvi-aggarwal019/',
  leetcode: 'https://leetcode.com/u/Saanvi-Aggarwal/',
  resumePath: '/Saanvi_Aggarwal_Resume.pdf',
  currentStatus: 'B.E. CSE (AI) · Chandigarh University · CGPA 9.37',
  studentId: '25BAI10045',
  department: 'Computer Science & Engineering (AI)',
  validTill: '2029',
  institution: 'Chandigarh University, Mohali, Punjab',
  cgpa: '9.37',
  interpersonalSkills: [
    'Leadership',
    'Critical Thinking',
    'Quick Learner',
    'Goal-Oriented',
    'Collaboration',
    'Adaptability',
  ],
  interests: ['Writing', 'Dancing', 'Travelling'],
};

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  file: string;
  date?: string;
  topics?: string[];
}

export const NAV: NavItem[] = [
  { id: 'home', label: 'Home', index: '00', href: '/' },
  { id: 'about', label: 'About', index: '01', href: '/about' },
  { id: 'skills', label: 'Skills', index: '02', href: '/skills' },
  { id: 'work', label: 'Work', index: '03', href: '/work' },
  { id: 'education', label: 'Education', index: '04', href: '/education' },
  { id: 'achievements', label: 'Achievements', index: '05', href: '/achievements' },
  { id: 'coa', label: 'COA', index: '06', href: '/coa' },
  { id: 'contact', label: 'Contact', index: '07', href: '/contact' },
];

export const ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'coa-assignment-1',
    title: 'COA Assignment 1',
    subject: 'Computer Organization & Architecture',
    description:
      'Foundations of computer organization spanning single-board computing, cloud data center infrastructure, processor microarchitectures, and hardware acceleration across CPUs, GPUs, and TPUs.',
    file: '/assignments/coa-assignment-1.pdf',
    topics: [
      'Raspberry Pi SBC',
      'AI Summit & Yotta Data Centers',
      'Intel Core i5-1334U Specs',
      'Hardware Acceleration (CPU vs GPU vs TPU)',
      'Turing Award in Architecture',
      'Stampeding Herd Problem',
      'Intel & AMD Foundations',
      'General Register Organization',
    ],
  },
];

export function getNextRoute(pathname: string): { label: string; href: string } {
  const normalizedPath = pathname.startsWith('/coa') ? '/coa' : pathname;
  const currentIndex = NAV.findIndex((item) => item.href === normalizedPath);
  if (currentIndex === -1 || currentIndex === NAV.length - 1) {
    return { label: NAV[1].label, href: NAV[1].href };
  }
  const nextItem = NAV[currentIndex + 1];
  return { label: nextItem.label, href: nextItem.href };
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Technical Competencies',
    skills: ['C', 'C++', 'Python', 'SQL', 'Java'],
  },
  {
    name: 'Core Concepts',
    skills: [
      'Data Structures and Algorithms (DSA)',
      'Object-Oriented Programming (OOP)',
      'Machine Learning',
      'Natural Language Processing (NLP)',
      'Database Management Systems',
      'Computer Organization & Architecture',
    ],
  },
  {
    name: 'Tools & Platforms',
    skills: ['MySQL', 'Microsoft Azure', 'Git', 'GitHub', 'Workflow Automation'],
  },
  {
    name: 'Interpersonal Skills',
    skills: [
      'Leadership',
      'Critical Thinking',
      'Quick Learner',
      'Goal-Oriented',
      'Collaboration',
      'Adaptability',
    ],
  },
];

export const SKILLS: SkillItem[] = [
  {
    atomicNumber: 1,
    symbol: 'Py',
    name: 'Python',
    family: 'Languages',
    isBrand: true,
    logoKey: 'python',
    description: 'Applied in Machine Learning and NLP for text preprocessing and email classification algorithms.',
    projects: ['AI Email Classifier'],
  },
  {
    atomicNumber: 2,
    symbol: 'Cp',
    name: 'C++',
    family: 'Languages',
    isBrand: true,
    logoKey: 'cpp',
    description: 'Used for STL stack-based CPU instruction simulation and high-performance algorithms.',
    projects: ['Instruction Set Simulator', '150+ LeetCode Solutions'],
  },
  {
    atomicNumber: 3,
    symbol: 'C',
    name: 'C',
    family: 'Languages',
    isBrand: true,
    logoKey: 'c',
    description: 'Used to implement core system functions, memory structures, dynamic arrays, and persistent file I/O.',
    projects: ['Library Management System'],
  },
  {
    atomicNumber: 4,
    symbol: 'Sq',
    name: 'SQL',
    family: 'Languages',
    isBrand: true,
    logoKey: 'sql',
    description: 'Relational query language used for database modeling, record querying, and data persistence.',
    projects: ['Library Management System', 'Database Labs'],
  },
  {
    atomicNumber: 5,
    symbol: 'Ja',
    name: 'Java',
    family: 'Languages',
    isBrand: true,
    logoKey: 'java',
    description: 'Object-oriented programming language utilized for robust software engineering and modular application structures.',
    projects: ['Object-Oriented Programming'],
  },
  {
    atomicNumber: 6,
    symbol: 'Ds',
    name: 'Data Structures & Algorithms',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'dsa',
    description: 'Deep problem-solving proficiency across stacks, queues, trees, graphs, and dynamic programming.',
    projects: ['Instruction Set Simulator', '150+ LeetCode Solutions', 'Library Management System'],
  },
  {
    atomicNumber: 7,
    symbol: 'Ca',
    name: 'Computer Architecture',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'dsa',
    description: 'Instruction formats (3/2/1/0-address), accumulator cycles, stack machines, and operand evaluation mechanisms.',
    projects: ['Instruction Set Simulator'],
  },
  {
    atomicNumber: 8,
    symbol: 'Oo',
    name: 'Object-Oriented Programming',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'oop',
    description: 'Modular software design adhering to encapsulation, inheritance, polymorphism, and abstraction.',
    projects: ['AI Email Classifier', 'Instruction Set Simulator'],
  },
  {
    atomicNumber: 9,
    symbol: 'Ml',
    name: 'Machine Learning',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'ml',
    description: 'Feature extraction, supervised learning model architectures, training, and predictive classification.',
    projects: ['AI Email Classifier', 'SARTHI AI (Bharat Buildathon)'],
  },
  {
    atomicNumber: 10,
    symbol: 'Nl',
    name: 'Natural Language Processing',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'nlp',
    description: 'Text preprocessing, tokenization, stop-word elimination, vectorization, and semantics extraction.',
    projects: ['AI Email Classifier'],
  },
  {
    atomicNumber: 11,
    symbol: 'Db',
    name: 'Database Management Systems',
    family: 'Concepts',
    isBrand: false,
    logoKey: 'dbms',
    description: 'Relational schemas, normalization, ACID properties, indexing, and transactional integrity.',
    projects: ['Library Management System'],
  },
  {
    atomicNumber: 12,
    symbol: 'My',
    name: 'MySQL',
    family: 'Databases',
    isBrand: true,
    logoKey: 'mysql',
    description: 'Open-source relational database management system for structured data storage.',
    projects: ['Database Management Systems'],
  },
  {
    atomicNumber: 13,
    symbol: 'Az',
    name: 'Microsoft Azure',
    family: 'Cloud',
    isBrand: true,
    logoKey: 'azure',
    description: 'Cloud infrastructure and AI fundamentals certified under Microsoft AZ-900 & AI-900 credentials.',
    projects: ['AZ-900 Certification', 'AI-900 Certification'],
  },
  {
    atomicNumber: 14,
    symbol: 'Gt',
    name: 'Git',
    family: 'Tools',
    isBrand: true,
    logoKey: 'git',
    description: 'Distributed version control system for atomic commits, branching workflows, and code hygiene.',
    projects: ['Instruction Set Simulator', 'AI Email Classifier', 'Library Management System'],
  },
  {
    atomicNumber: 15,
    symbol: 'Gh',
    name: 'GitHub',
    family: 'Tools',
    isBrand: true,
    logoKey: 'github',
    description: 'Repository hosting, collaborative code reviews, remote tracking, and versioned releases.',
    projects: ['Instruction Set Simulator', 'AI Email Classifier', 'Library Management System'],
  },
  {
    atomicNumber: 16,
    symbol: 'Wa',
    name: 'Workflow Automation',
    family: 'Tools',
    isBrand: false,
    logoKey: 'automation',
    description: 'Orchestrating repetitive pipelines and streamlining operational engineering workflows.',
    projects: ['AI-Driven Systems'],
  },
  {
    atomicNumber: 17,
    symbol: 'Ld',
    name: 'Leadership',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'leadership',
    description: 'Leading project teams during collegiate hackathons and coordinating technical initiatives.',
    projects: ['Bharat Buildathon (1st Runner-Up)', 'ByteBuild 1.0 (Top 10)', 'HERizon 1.0'],
  },
  {
    atomicNumber: 18,
    symbol: 'Ct',
    name: 'Critical Thinking',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'critical-thinking',
    description: 'Evaluating edge cases and algorithm efficiencies under stringent time/space bounds.',
    projects: ['Instruction Set Simulator', '150+ LeetCode Solutions'],
  },
  {
    atomicNumber: 19,
    symbol: 'Ql',
    name: 'Quick Learner',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'learner',
    description: 'Rapidly assimilating new frameworks, cloud APIs, and specialized domain paradigms.',
    projects: ['AZ-900 & AI-900 Certifications'],
  },
  {
    atomicNumber: 20,
    symbol: 'Go',
    name: 'Goal-Oriented',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'goal',
    description: 'Driven to ship working software solutions and achieve competitive hackathon milestones.',
    projects: ['Bharat Buildathon', 'Green Mobility Ideathon'],
  },
  {
    atomicNumber: 21,
    symbol: 'Cb',
    name: 'Collaboration',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'collaboration',
    description: 'Cohesive teamwork and clear technical communication in cross-functional hackathon squads.',
    projects: ['ByteBuild 1.0', 'Tekathon 5.0 SIH', 'PSB IDEA 2.0'],
  },
  {
    atomicNumber: 22,
    symbol: 'Ad',
    name: 'Adaptability',
    family: 'Interpersonal',
    isBrand: false,
    logoKey: 'adaptability',
    description: 'Flexibility transitioning across system programming in C, simulation in C++, and applied AI in Python.',
    projects: ['Instruction Set Simulator', 'AI Email Classifier', 'Library Management System'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'instruction-set-simulator',
    number: '01',
    title: 'Instruction Set Simulator',
    kicker: 'C++ · STL Stack · Computer Architecture',
    description:
      'Developed a C++-based simulator that converts arithmetic expressions from infix to postfix notation using stack-based processing and validates user input. Generated equivalent 3-address, 2-address, 1-address, and 0-address CPU instructions, simulating different instruction formats and operand-handling mechanisms. Compared instruction counts across all four formats, demonstrating the relationship between instruction architecture, register/accumulator usage, and execution steps.',
    features: [
      'Infix to postfix conversion using STL stack processing and input syntax validation',
      'Generates equivalent 3-address, 2-address, 1-address (accumulator), and 0-address (stack) instructions',
      'Simulates different instruction formats and operand-handling mechanisms',
      'Compares instruction counts across all four formats, analyzing CPU execution steps and register efficiency',
    ],
    technologies: ['C++', 'STL Stack', 'Computer Architecture', 'Assembly', 'Git'],
    githubUrl: 'https://github.com/saanvi-aggarwal/Instruction-Set-Simulator.git',
    repoName: 'Instruction-Set-Simulator',
    mockupType: 'instruction-simulator',
  },
  {
    id: 'ai-email-classifier',
    number: '02',
    title: 'AI Email Classifier',
    kicker: 'Python · Machine Learning · NLP',
    description:
      'Developed a machine learning system to automatically classify and organize emails based on their content. Applied NLP preprocessing and feature extraction to convert text into machine-readable representations for classification.',
    features: [
      'Automated email classification and categorization by subject & content semantics',
      'NLP preprocessing pipeline with text tokenization and stop-word filtering',
      'Feature extraction techniques to create machine-readable vectors',
      'Trained model inference for accurate sorting into custom inbox categories',
    ],
    technologies: ['Python', 'Machine Learning', 'NLP', 'Git', 'GitHub'],
    githubUrl: 'https://github.com/saanvi-aggarwal/AI-Email-Classifier.git',
    repoName: 'AI-Email-Classifier',
    mockupType: 'email-classifier',
  },
  {
    id: 'library-management-system',
    number: '03',
    title: 'Library Management System',
    kicker: 'C · Data Structures · File Handling',
    description:
      'Developed a console-based Library Management System to manage book records, issue and return operations, and user information. Implemented core functionalities using functions, arrays, structures, and file handling in C. Designed menu-driven operations to simplify book management and improve record accessibility.',
    features: [
      'Console-based book cataloguing with real-time record lookup',
      'Issue and return management with automatic status updates',
      'Core functionalities structured with custom C structs and file handling',
      'Intuitive menu-driven operations simplifying inventory accessibility',
    ],
    technologies: ['C', 'Structures', 'File Handling', 'Arrays', 'Git'],
    githubUrl: 'https://github.com/saanvi-aggarwal/25BAI10045-library-management.git',
    repoName: '25BAI10045-library-management',
    mockupType: 'library-management',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'az-900',
    number: '01',
    title: 'Microsoft Azure Fundamentals',
    code: 'AZ-900',
    issuer: 'Microsoft',
    year: '2025',
    issueDate: 'November 19, 2025',
    description:
      'Foundational validation of cloud services, security, privacy, compliance, Azure architecture, and cloud computing principles.',
    imageUrl: '/certificates/azure-az900.png',
    pdfUrl: '/certificates/azure-az900.pdf',
  },
  {
    id: 'ai-900',
    number: '02',
    title: 'Microsoft Azure AI Fundamentals',
    code: 'AI-900',
    issuer: 'Microsoft',
    year: '2026',
    issueDate: 'April 28, 2026',
    description:
      'Demonstrated knowledge of Machine Learning workloads, Computer Vision, Natural Language Processing, and Conversational AI solutions on Azure.',
    imageUrl: '/certificates/azure-ai-fundamentals.png',
    pdfUrl: '/certificates/azure-ai-fundamentals.pdf',
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Engineering – Computer Science and Engineering (AI)',
    institution: 'Chandigarh University, Mohali, Punjab',
    period: '2025 – 2029',
    grade: 'CGPA: 9.37',
    gradeType: 'CGPA',
    details:
      'Specializing in Artificial Intelligence with core coursework in C++, Python, Java, Data Structures & Algorithms, SQL, and Machine Learning.',
  },
  {
    degree: 'Senior Secondary (Class XII) – CBSE',
    institution: "St. Luke's Senior Secondary School, Solan",
    period: '2024 – 2025',
    grade: '93.6%',
    gradeType: 'Percentage',
    details: 'Completed senior secondary education under CBSE board with distinction in science and mathematics.',
  },
  {
    degree: 'Secondary (Class X) – CBSE',
    institution: "St. Luke's Senior Secondary School, Solan",
    period: '2022 – 2023',
    grade: '90.8%',
    gradeType: 'Percentage',
    details: 'Completed secondary schooling under CBSE curriculum with high academic honors.',
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 't-1',
    year: '2022 – 2023',
    title: 'Secondary (Class X) – CBSE',
    place: "St. Luke's Senior Secondary School, Solan",
    detail: 'Achieved 90.8% in CBSE Class X board examinations.',
    category: 'education',
  },
  {
    id: 't-2',
    year: '2024 – 2025',
    title: 'Senior Secondary (Class XII) – CBSE',
    place: "St. Luke's Senior Secondary School, Solan",
    detail: 'Graduated with 93.6% in CBSE Class XII board examinations.',
    category: 'education',
  },
  {
    id: 't-3',
    year: '2025 – 2029',
    title: 'B.E. Computer Science and Engineering (AI)',
    place: 'Chandigarh University, Mohali, Punjab',
    detail: 'Pursuing undergraduate degree in CSE (AI) with a 9.37 CGPA. Deepening focus in computer architecture, C++, algorithms, and AI.',
    category: 'education',
    highlight: true,
  },
  {
    id: 't-9',
    year: 'Future',
    title: 'Next — Your team?',
    place: 'Software & AI Engineering',
    detail: 'Open for Software Development, Machine Learning, and Engineering internships. Ready to contribute code from day one.',
    category: 'next',
    highlight: true,
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    index: '01 / 06',
    metric: '1',
    numericTarget: 1,
    suffix: 'st Runner-Up',
    label: 'Bharat Buildathon: Data to Quest (2026)',
    platform: 'Bharat Buildathon',
    logoKey: 'ideathon',
    brandColor: '#f59e0b',
    detail: 'Developed SARTHI AI, an AI-powered platform for improving access to and understanding of government schemes.',
    images: [
      '/achievements/bharat-buildathon-1.jpg',
      '/achievements/bharat-buildathon-2.jpg',
    ],
    imageCaptions: [
      '1st Runner-Up Trophy Presentation',
      'Team Felicitation with Faculty Mentors',
    ],
    imageType: 'photo',
  },
  {
    id: 'ach-2',
    index: '02 / 06',
    metric: '10',
    numericTarget: 10,
    suffix: ' (Top 10)',
    label: 'Top 10 — ByteBuild 1.0',
    platform: 'ByteBuild Hackathon',
    logoKey: 'ideathon',
    brandColor: '#8b5cf6',
    detail: 'Secured a Top 10 position in a 24-hour hackathon and presented the developed solution to a panel of judges.',
    images: [
      '/achievements/bytebuild-1.jpg',
      '/achievements/bytebuild-2.jpg',
    ],
    imageCaptions: [
      'Certificate of Participation (Byte Build 1.0)',
      'Live SAAR Project Pitch in front of Judges',
    ],
    imageTypes: ['certificate', 'photo'],
  },
  {
    id: 'ach-3',
    index: '03 / 06',
    metric: '3',
    numericTarget: 3,
    suffix: 'rd Position',
    label: 'Integrated Green Mobility Ideathon 2026',
    platform: 'Ideathon 2026',
    logoKey: 'ideathon',
    brandColor: '#10b981',
    detail: 'Designed a Hybrid Smart Road Energy System combining regenerative speed breakers and micro energy harvesting.',
    images: [
      '/achievements/integrated-ideathon-1.jpg',
      '/achievements/integrated-ideathon-2.jpg',
    ],
    imageCaptions: [
      'Stage Award Ceremony with Dignitaries',
      'Team Members with Certificates of Achievement',
    ],
    imageType: 'photo',
  },
  {
    id: 'ach-4',
    index: '04 / 06',
    label: 'Tekathon 5.0 — SIH Internal Round',
    platform: 'Smart India Hackathon',
    logoKey: 'cu',
    brandColor: '#ea580c',
    detail: 'Competed in the Smart India Hackathon internal round, advancing through the PPT stage with an AI IP & regulatory guidance solution.',
  },
  {
    id: 'ach-5',
    index: '05 / 06',
    label: 'PSB Hackathon IDEA 2.0 (AI-CSPARC)',
    platform: 'PSB Hackathon',
    logoKey: 'psb',
    brandColor: '#2563eb',
    detail: 'AI-powered innovation for customer security, privacy, assurance, reliance, and convenience.',
  },
  {
    id: 'ach-6',
    index: '06 / 06',
    metric: 'IEEE Council',
    label: 'HERizon 1.0 Hackathon',
    platform: 'Chandigarh University',
    logoKey: 'cu',
    brandColor: '#e11d48',
    detail: 'Participated as part of team Quad X at Chandigarh University in collaboration with IEEE India Council to develop a technology-driven solution.',
    images: ['/achievements/herizon-1.jpg'],
    imageCaptions: [
      'Certificate of Participation (HERizon 2026 · IEEE India Council)',
    ],
    imageType: 'certificate',
  },
];
