export interface AnnualReport {
  id: string;
  year: string;
  title: string;
  fileSize: string;
  publishedDate: string;
}

export interface FinancialResult {
  id: string;
  quarter: string;
  period: string;
  revenue: string;
  netProfit: string;
  npa: string;
  publishedDate: string;
  type: "quarterly" | "annual";
}

export interface BoardMember {
  id: string;
  name: string;
  designation: string;
  experience: string;
  qualification: string;
  bio: string;
  imageInitial: string;
}

export interface Shareholding {
  category: string;
  percentage: number;
  color: string;
}

export interface CorporateGovernance {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  type: "policy" | "code" | "charter";
}

export const annualReports: AnnualReport[] = [
  { id: "ar-2024", year: "2023–24", title: "Annual Report 2023–24", fileSize: "4.2 MB", publishedDate: "30 Jun 2024" },
  { id: "ar-2023", year: "2022–23", title: "Annual Report 2022–23", fileSize: "3.8 MB", publishedDate: "28 Jun 2023" },
  { id: "ar-2022", year: "2021–22", title: "Annual Report 2021–22", fileSize: "3.5 MB", publishedDate: "30 Jun 2022" },
  { id: "ar-2021", year: "2020–21", title: "Annual Report 2020–21", fileSize: "3.1 MB", publishedDate: "30 Jun 2021" },
];

export const financialResults: FinancialResult[] = [
  {
    id: "q3-fy25",
    quarter: "Q3 FY25",
    period: "Oct – Dec 2024",
    revenue: "₹48.6 Cr",
    netProfit: "₹9.2 Cr",
    npa: "1.8%",
    publishedDate: "14 Feb 2025",
    type: "quarterly",
  },
  {
    id: "q2-fy25",
    quarter: "Q2 FY25",
    period: "Jul – Sep 2024",
    revenue: "₹45.1 Cr",
    netProfit: "₹8.5 Cr",
    npa: "1.9%",
    publishedDate: "14 Nov 2024",
    type: "quarterly",
  },
  {
    id: "q1-fy25",
    quarter: "Q1 FY25",
    period: "Apr – Jun 2024",
    revenue: "₹41.8 Cr",
    netProfit: "₹7.8 Cr",
    npa: "2.1%",
    publishedDate: "14 Aug 2024",
    type: "quarterly",
  },
  {
    id: "fy24-annual",
    quarter: "FY 2023–24",
    period: "Apr 2023 – Mar 2024",
    revenue: "₹168.4 Cr",
    netProfit: "₹31.6 Cr",
    npa: "2.3%",
    publishedDate: "30 Apr 2024",
    type: "annual",
  },
];

export const boardMembers: BoardMember[] = [
  {
    id: "bm-1",
    name: "Rajesh Kumar Sharma",
    designation: "Chairman & Managing Director",
    experience: "30+ years in Banking & Financial Services",
    qualification: "MBA (Finance), IIM Ahmedabad | CA",
    bio: "Mr. Sharma has spent over three decades in the financial services industry, having led senior roles at leading PSU banks and NBFCs. Under his leadership, Vittodaya has grown from a regional lender to a multi-product financial services company.",
    imageInitial: "R",
  },
  {
    id: "bm-2",
    name: "Sunita Mehta",
    designation: "Executive Director & CFO",
    experience: "22 years in Finance & Risk Management",
    qualification: "CFA | MBA (Finance), XLRI",
    bio: "Ms. Mehta oversees financial strategy, treasury operations, and risk management. She has previously held CFO positions at two publicly listed NBFCs and brings deep expertise in capital markets and regulatory compliance.",
    imageInitial: "S",
  },
  {
    id: "bm-3",
    name: "Dr. Anand Prakash",
    designation: "Independent Director",
    experience: "25 years in Banking Regulation & Policy",
    qualification: "Ph.D. (Economics) | Retd. IAS Officer",
    bio: "Dr. Prakash served as Additional Secretary in the Ministry of Finance and has been on the boards of multiple financial institutions. He provides strategic guidance on regulatory affairs and government policy.",
    imageInitial: "A",
  },
  {
    id: "bm-4",
    name: "Priya Nair",
    designation: "Independent Director",
    experience: "18 years in Technology & Digital Finance",
    qualification: "B.Tech, IIT Bombay | MBA, ISB Hyderabad",
    bio: "Ms. Nair is a fintech entrepreneur and digital transformation expert. She advises Vittodaya on technology strategy and digital lending practices, having built two successful fintech startups.",
    imageInitial: "P",
  },
];

export const shareholdingPattern: Shareholding[] = [
  { category: "Promoter & Promoter Group", percentage: 62.4, color: "#0f4c81" },
  { category: "Institutional Investors (FII/DII)", percentage: 18.7, color: "#c8922a" },
  { category: "HNI / Corporate Bodies", percentage: 11.2, color: "#059669" },
  { category: "Retail Individual Investors", percentage: 7.7, color: "#7c3aed" },
];

export const corporateGovernanceDocs: CorporateGovernance[] = [
  {
    id: "cg-1",
    title: "Code of Conduct for Board & Senior Management",
    description: "Comprehensive code outlining ethical standards and conduct expected of directors and senior leaders.",
    publishedDate: "01 Apr 2024",
    type: "code",
  },
  {
    id: "cg-2",
    title: "Whistleblower Policy",
    description: "Policy enabling employees and stakeholders to report unethical behaviour or compliance violations.",
    publishedDate: "01 Apr 2024",
    type: "policy",
  },
  {
    id: "cg-3",
    title: "Related Party Transaction Policy",
    description: "Framework for identification, review, and approval of related party transactions.",
    publishedDate: "01 Apr 2024",
    type: "policy",
  },
  {
    id: "cg-4",
    title: "Audit Committee Charter",
    description: "Charter defining the role, responsibilities, and composition of the Audit Committee of the Board.",
    publishedDate: "01 Apr 2023",
    type: "charter",
  },
];

export const keyFinancialHighlights = [
  { label: "Total AUM", value: "₹1,250 Cr", change: "+22% YoY" },
  { label: "Net Worth", value: "₹320 Cr", change: "+18% YoY" },
  { label: "Capital Adequacy Ratio", value: "19.8%", change: "Well above 15% norm" },
  { label: "Net NPA", value: "1.8%", change: "Improved from 2.3%" },
  { label: "Return on Equity", value: "14.2%", change: "+1.5% YoY" },
  { label: "Credit Rating", value: "A (Stable)", change: "CRISIL Affirmed" },
];
