export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  isFeatured?: boolean;
}

export interface CompanyValue {
  icon: string;
  title: string;
  desc: string;
}

export interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

export const jobOpenings: JobOpening[] = [
  {
    id: "jd-001",
    title: "Credit Analyst – Personal & MSME Loans",
    department: "Credit & Risk",
    location: "Mumbai, Maharashtra",
    type: "full-time",
    experience: "2 – 5 years",
    postedDate: "01 Jun 2025",
    description:
      "Evaluate loan applications for personal and MSME borrowers. Conduct financial analysis, risk assessment, and support the underwriting process.",
    responsibilities: [
      "Analyse financial statements, bank statements, and credit bureau reports",
      "Underwrite loan proposals within defined credit policies",
      "Prepare credit notes and present to approval committees",
      "Liaise with sales teams and resolve credit-related queries",
      "Monitor portfolio performance and flag early warning signals",
    ],
    requirements: [
      "CA / MBA Finance / B.Com with relevant experience",
      "2+ years in credit underwriting (NBFC or banking preferred)",
      "Proficiency in Excel and financial modelling",
      "Strong analytical and communication skills",
      "Knowledge of RBI guidelines on MSME lending is a plus",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "jd-002",
    title: "Relationship Manager – Business Loans",
    department: "Sales & Business Development",
    location: "Pune / Bengaluru / Ahmedabad",
    type: "full-time",
    experience: "3 – 7 years",
    postedDate: "28 May 2025",
    description:
      "Drive MSME and LAP loan disbursements by acquiring new clients, managing a portfolio of existing clients, and meeting monthly targets.",
    responsibilities: [
      "Identify and acquire MSME and LAP borrowers through referral networks and direct sourcing",
      "Conduct initial client meetings and guide through the loan application process",
      "Coordinate with credit and operations teams for quick disbursal",
      "Maintain strong client relationships post-disbursal",
      "Achieve monthly and quarterly disbursement targets",
    ],
    requirements: [
      "Graduate in any discipline; MBA preferred",
      "3+ years in MSME / SME lending or business banking",
      "Strong local market knowledge and existing network",
      "Target-driven with excellent interpersonal skills",
      "Own vehicle and willingness to travel",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "jd-003",
    title: "Full-Stack Developer (Next.js + Node.js)",
    department: "Technology",
    location: "Mumbai / Remote",
    type: "full-time",
    experience: "2 – 4 years",
    postedDate: "20 May 2025",
    description:
      "Build and maintain Vittodaya's customer-facing web application and internal admin tools. Work closely with product and design teams.",
    responsibilities: [
      "Develop features for the customer portal and admin dashboard using Next.js",
      "Build RESTful APIs with Node.js and PostgreSQL",
      "Integrate third-party services (bureau APIs, payment gateways, KYC providers)",
      "Ensure high performance, accessibility, and mobile responsiveness",
      "Write unit and integration tests; participate in code reviews",
    ],
    requirements: [
      "B.Tech / MCA in CS or related field",
      "2+ years with React / Next.js and Node.js",
      "Experience with PostgreSQL or MongoDB",
      "Familiarity with fintech APIs (CIBIL, Aadhaar, eSign) is a plus",
      "Strong understanding of web security best practices",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "jd-004",
    title: "Collections Executive",
    department: "Collections & Recovery",
    location: "Mumbai / Thane / Navi Mumbai",
    type: "full-time",
    experience: "1 – 3 years",
    postedDate: "15 May 2025",
    description:
      "Manage collections for overdue loan accounts through telephonic and field follow-ups, negotiating repayment plans and ensuring recoveries.",
    responsibilities: [
      "Follow up with delinquent borrowers via calls and field visits",
      "Negotiate settlement or repayment plans within company guidelines",
      "Maintain accurate records of collection activities in the system",
      "Achieve assigned monthly collection targets",
      "Escalate hard cases to senior recovery officers",
    ],
    requirements: [
      "Graduate in any discipline",
      "1+ year in loan collections or recovery (NBFC/bank preferred)",
      "Strong negotiation and persuasion skills",
      "Knowledge of local language (Marathi / Hindi / Gujarati)",
      "Own two-wheeler with valid driving licence",
    ],
    isActive: true,
  },
  {
    id: "jd-005",
    title: "Compliance & Regulatory Affairs Executive",
    department: "Legal & Compliance",
    location: "Mumbai, Maharashtra",
    type: "full-time",
    experience: "2 – 4 years",
    postedDate: "10 May 2025",
    description:
      "Ensure Vittodaya's operations remain compliant with RBI regulations, KYC/AML norms, and applicable laws. Support regulatory reporting and audit functions.",
    responsibilities: [
      "Monitor and implement RBI circulars and NBFC regulatory changes",
      "Prepare and file regulatory returns (FIU, NHB, MCA as applicable)",
      "Support internal and external audits",
      "Maintain KYC/AML records and conduct periodic reviews",
      "Draft and update company policies in line with regulatory requirements",
    ],
    requirements: [
      "LLB / CS / MBA with specialisation in compliance or finance",
      "2+ years in compliance role within NBFC or banking sector",
      "Sound knowledge of RBI Master Directions and PMLA",
      "Detail-oriented with strong documentation skills",
      "Experience with compliance management software is a plus",
    ],
    isActive: true,
  },
  {
    id: "jd-006",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Mumbai / Remote",
    type: "full-time",
    experience: "1 – 3 years",
    postedDate: "05 Jun 2025",
    description:
      "Drive digital customer acquisition through SEO, paid campaigns, and content marketing for Vittodaya's loan and investment products.",
    responsibilities: [
      "Plan and execute Google Ads, Meta Ads, and performance campaigns",
      "Manage SEO for the Vittodaya website and blog",
      "Create and publish content across social media channels",
      "Analyse campaign performance and optimise for CAC and ROI",
      "Coordinate with product and design teams for landing pages and creatives",
    ],
    requirements: [
      "Graduate in Marketing, Mass Communication, or related field",
      "1+ years in digital marketing (fintech experience preferred)",
      "Proficiency in Google Ads, Meta Business Manager, and GA4",
      "Basic knowledge of SEO tools (Ahrefs, SEMrush)",
      "Strong written communication in English and Hindi",
    ],
    isActive: true,
  },
  {
    id: "jd-007",
    title: "Summer Internship – Finance & Credit",
    department: "Credit & Risk",
    location: "Mumbai, Maharashtra",
    type: "internship",
    experience: "Fresher (MBA / CA Intermediate)",
    postedDate: "01 Jun 2025",
    description:
      "A 2-month summer internship for MBA Finance or CA Intermediate students to gain hands-on experience in NBFC credit underwriting and portfolio analysis.",
    responsibilities: [
      "Assist credit analysts with data collection and financial spreading",
      "Support portfolio monitoring activities",
      "Prepare research notes on industry sectors",
      "Participate in credit committee meetings as an observer",
    ],
    requirements: [
      "Currently pursuing MBA Finance (1st year) or CA Intermediate",
      "Strong interest in lending, credit, and financial services",
      "Proficiency in MS Excel",
      "Duration: June – July 2025 (8 weeks)",
    ],
    isActive: true,
  },
];

export const companyValues: CompanyValue[] = [
  { icon: "🤝", title: "Customer First", desc: "Every product and process is designed around the customer's needs and convenience." },
  { icon: "⚖️", title: "Integrity", desc: "We operate with complete transparency, fairness, and adherence to regulatory standards." },
  { icon: "🚀", title: "Innovation", desc: "We embrace technology and new ideas to constantly improve how we serve our customers." },
  { icon: "🌱", title: "Inclusion", desc: "We believe in financial inclusion — making credit and savings accessible to every Indian." },
  { icon: "👥", title: "People First", desc: "Our team is our greatest asset. We invest in growth, learning, and well-being." },
  { icon: "📈", title: "Ownership", desc: "We encourage a culture where every team member takes ownership of outcomes." },
];

export const benefits: Benefit[] = [
  { icon: "💰", title: "Competitive Compensation", desc: "Market-benchmarked salaries with performance-linked variable pay and annual increments." },
  { icon: "🏥", title: "Health Insurance", desc: "Comprehensive medical insurance covering self, spouse, children, and dependent parents." },
  { icon: "📚", title: "Learning & Development", desc: "Sponsored certifications, online courses, and access to industry conferences." },
  { icon: "🏠", title: "Flexible Working", desc: "Hybrid work options for eligible roles, with flexible working hours." },
  { icon: "🌴", title: "Leave Benefits", desc: "Generous leave policy including earned leave, sick leave, and paid maternity/paternity leave." },
  { icon: "🎉", title: "Employee Recognition", desc: "Quarterly awards, team outings, and a culture that celebrates wins big and small." },
];

export const departments = [
  "All Departments",
  "Credit & Risk",
  "Sales & Business Development",
  "Technology",
  "Collections & Recovery",
  "Legal & Compliance",
  "Marketing",
];

export function getActiveJobs(department?: string): JobOpening[] {
  const active = jobOpenings.filter(j => j.isActive);
  if (!department || department === "All Departments") return active;
  return active.filter(j => j.department === department);
}
