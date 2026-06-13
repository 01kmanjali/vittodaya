export interface LoanFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface LoanEligibility {
  label: string;
  value: string;
}

export interface LoanDocument {
  category: string;
  items: string[];
}

export interface LoanProduct {
  id: string;
  type: "personal" | "msme" | "ev" | "lap";
  name: string;
  tagline: string;
  heroDesc: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  rateFrom: number;
  rateTo: number;
  processingFee: string;
  features: LoanFeature[];
  eligibility: LoanEligibility[];
  documents: LoanDocument[];
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

export const loanProducts: LoanProduct[] = [
  {
    id: "personal-loan",
    type: "personal",
    name: "Personal Loan",
    tagline: "Quick funds for every need",
    heroDesc:
      "Get instant personal loans up to ₹25 Lakhs at competitive interest rates with minimal documentation. Salaried and self-employed individuals both eligible.",
    minAmount: 50000,
    maxAmount: 2500000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    rateFrom: 10.5,
    rateTo: 24.0,
    processingFee: "Up to 2% of loan amount",
    features: [
      { icon: "⚡", title: "Instant Disbursal", desc: "Loan amount credited to your account within 24–48 hours of approval." },
      { icon: "📄", title: "Minimal Paperwork", desc: "Apply with just KYC, income proof, and bank statements. No collateral required." },
      { icon: "🔄", title: "Flexible Tenure", desc: "Choose repayment tenure from 12 to 60 months as per your convenience." },
      { icon: "💰", title: "No Hidden Charges", desc: "Transparent fee structure with no pre-payment penalty after 6 months." },
    ],
    eligibility: [
      { label: "Age", value: "21 – 60 years" },
      { label: "Employment", value: "Salaried / Self-employed" },
      { label: "Minimum Income (Salaried)", value: "₹15,000 per month" },
      { label: "Minimum Income (Self-employed)", value: "₹2 Lakhs per annum" },
      { label: "CIBIL Score", value: "700 and above" },
      { label: "Work Experience", value: "1 year (Salaried) / 2 years (Self-employed)" },
    ],
    documents: [
      {
        category: "Identity & Address Proof",
        items: ["Aadhaar Card", "PAN Card", "Passport / Voter ID / Driving Licence"],
      },
      {
        category: "Income Proof (Salaried)",
        items: ["Last 3 months salary slips", "Last 6 months bank statement", "Form 16 / ITR of last 2 years"],
      },
      {
        category: "Income Proof (Self-employed)",
        items: ["Last 2 years ITR with computation", "Last 12 months bank statement", "GST Returns (if applicable)"],
      },
    ],
    tags: ["No Collateral", "Quick Disbursal", "Flexible EMI"],
    isActive: true,
    featuredOrder: 1,
  },
  {
    id: "msme-loan",
    type: "msme",
    name: "MSME / Business Loan",
    tagline: "Fuel your business growth",
    heroDesc:
      "Customised business loan solutions for Micro, Small & Medium Enterprises. From working capital to machinery purchase — we fund your ambitions.",
    minAmount: 100000,
    maxAmount: 10000000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    rateFrom: 11.0,
    rateTo: 22.0,
    processingFee: "1% – 2% of loan amount",
    features: [
      { icon: "🏭", title: "Working Capital", desc: "Fund day-to-day operations, inventory purchase, and business expenses." },
      { icon: "⚙️", title: "Machinery & Equipment", desc: "Expand production capacity with easy equipment financing." },
      { icon: "🏗️", title: "Business Expansion", desc: "Open new outlets, renovate premises, or scale operations across cities." },
      { icon: "📈", title: "Collateral-free Options", desc: "Loans up to ₹50 Lakhs without collateral under CGFMU guarantee." },
    ],
    eligibility: [
      { label: "Entity Type", value: "Proprietorship / Partnership / Pvt Ltd / LLP" },
      { label: "Business Vintage", value: "Minimum 2 years in operation" },
      { label: "Annual Turnover", value: "₹10 Lakhs and above" },
      { label: "Age of Promoter", value: "25 – 65 years" },
      { label: "CIBIL / CRIF Score", value: "680 and above" },
      { label: "GST Registration", value: "Mandatory for loans above ₹20 Lakhs" },
    ],
    documents: [
      {
        category: "Business Proof",
        items: ["GST Registration Certificate", "Shop & Establishment Certificate", "Partnership Deed / MOA & AOA", "Udyam Registration (MSME Certificate)"],
      },
      {
        category: "Financial Documents",
        items: ["Last 2 years ITR with P&L and Balance Sheet", "Last 12 months bank statement", "GST Returns for last 12 months"],
      },
      {
        category: "KYC Documents",
        items: ["Aadhaar & PAN of all promoters", "Address proof of business premises"],
      },
    ],
    tags: ["Collateral-free Option", "CGFMU Covered", "Flexible Repayment"],
    isActive: true,
    featuredOrder: 2,
  },
  {
    id: "ev-loan",
    type: "ev",
    name: "Electric Vehicle Loan",
    tagline: "Drive green, save more",
    heroDesc:
      "Finance your electric two-wheeler, three-wheeler, or four-wheeler with attractive interest rates. Go green while saving on fuel and maintenance costs.",
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    rateFrom: 8.99,
    rateTo: 16.0,
    processingFee: "0.5% – 1.5% of loan amount",
    features: [
      { icon: "🌿", title: "Green Vehicle Finance", desc: "Special interest rates for electric 2W, 3W, and 4W vehicles." },
      { icon: "🔋", title: "Battery Replacement Cover", desc: "Optional financing for battery replacement after warranty period." },
      { icon: "🏛️", title: "Government Subsidy Linked", desc: "Loan structure compatible with FAME II / state EV subsidies." },
      { icon: "🚗", title: "High LTV Ratio", desc: "Finance up to 90% of the on-road price of your EV." },
    ],
    eligibility: [
      { label: "Age", value: "21 – 65 years" },
      { label: "Employment", value: "Salaried / Self-employed / Business owner" },
      { label: "Minimum Income", value: "₹12,000 per month" },
      { label: "CIBIL Score", value: "650 and above" },
      { label: "Driving Licence", value: "Valid driving licence mandatory" },
    ],
    documents: [
      {
        category: "KYC Documents",
        items: ["Aadhaar Card", "PAN Card", "Valid Driving Licence"],
      },
      {
        category: "Income Documents",
        items: ["Last 3 months salary slips or ITR", "Last 6 months bank statement"],
      },
      {
        category: "Vehicle Documents",
        items: ["Pro-forma invoice from authorised EV dealer", "Vehicle insurance quotation"],
      },
    ],
    tags: ["Low Interest", "FAME II Compatible", "90% LTV"],
    isActive: true,
    featuredOrder: 3,
  },
  {
    id: "lap-loan",
    type: "lap",
    name: "Loan Against Property",
    tagline: "Unlock the value of your property",
    heroDesc:
      "Leverage your residential or commercial property to get high-value loans at lower interest rates. Ideal for business expansion, medical emergencies, or education funding.",
    minAmount: 500000,
    maxAmount: 50000000,
    minTenureMonths: 24,
    maxTenureMonths: 180,
    rateFrom: 9.5,
    rateTo: 15.5,
    processingFee: "0.5% – 1% of loan amount",
    features: [
      { icon: "🏠", title: "High Loan Value", desc: "Get up to 60% of your property's market value as loan amount." },
      { icon: "📅", title: "Long Tenure", desc: "Comfortable repayment tenure up to 15 years for lower EMIs." },
      { icon: "🔑", title: "Property Ownership Retained", desc: "Continue to use your property while it serves as collateral." },
      { icon: "💼", title: "Multi-purpose Use", desc: "Use funds for business, education, medical, or any personal need." },
    ],
    eligibility: [
      { label: "Age", value: "25 – 65 years" },
      { label: "Property Type", value: "Residential / Commercial / Industrial" },
      { label: "Employment", value: "Salaried / Self-employed / Business owner" },
      { label: "LTV Ratio", value: "Up to 60% of property value" },
      { label: "CIBIL Score", value: "650 and above" },
      { label: "Property Title", value: "Clear and marketable title required" },
    ],
    documents: [
      {
        category: "Property Documents",
        items: ["Sale deed / Title deed", "Property tax receipts", "Approved building plan", "NOC from society (if applicable)"],
      },
      {
        category: "Income Documents",
        items: ["Last 2 years ITR", "Last 12 months bank statement", "Salary slips / Business financials"],
      },
      {
        category: "KYC Documents",
        items: ["Aadhaar Card", "PAN Card", "Address proof"],
      },
    ],
    tags: ["Low Interest Rate", "High Loan Value", "Long Tenure"],
    isActive: true,
    featuredOrder: 4,
  },
];

export function getLoanByType(type: LoanProduct["type"]): LoanProduct | undefined {
  return loanProducts.find(l => l.type === type);
}

export function getActiveLoanProducts(): LoanProduct[] {
  return loanProducts.filter(l => l.isActive);
}
