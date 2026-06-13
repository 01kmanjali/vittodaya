export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const faqCategories = [
  { id: "all", label: "All FAQs" },
  { id: "personal-loan", label: "Personal Loan" },
  { id: "msme-loan", label: "MSME / Business Loan" },
  { id: "ev-loan", label: "EV Loan" },
  { id: "lap", label: "Loan Against Property" },
  { id: "fd", label: "Fixed Deposits" },
  { id: "general", label: "General" },
];

export const faqs: FAQ[] = [
  // General
  {
    id: "g-1",
    question: "What is Vittodaya Financial Services?",
    answer:
      "Vittodaya Financial Services Pvt. Ltd. (VFSPL) is a Reserve Bank of India (RBI) registered Non-Banking Financial Company (NBFC) offering a range of financial products including Fixed Deposits, Personal Loans, MSME Loans, Electric Vehicle Loans, and Loans Against Property. We are committed to making credit and savings accessible for every Indian.",
    category: "general",
    order: 1,
  },
  {
    id: "g-2",
    question: "Is Vittodaya regulated by the RBI?",
    answer:
      "Yes. Vittodaya Financial Services Pvt. Ltd. is duly registered with the Reserve Bank of India as a Non-Banking Financial Company (NBFC). Our registration certificate is available for reference in the Investor Relations section of our website.",
    category: "general",
    order: 2,
  },
  {
    id: "g-3",
    question: "How can I contact Vittodaya's customer support?",
    answer:
      "You can reach us through multiple channels: Call our toll-free number 1800-XXX-XXXX (Mon–Sat, 9 AM–6 PM), email us at support@vfspl.in, or visit any of our 150+ branch offices across India. You can also raise a ticket through the 'Contact Us' page on our website.",
    category: "general",
    order: 3,
  },
  // Personal Loan
  {
    id: "pl-1",
    question: "Who is eligible for a Personal Loan from Vittodaya?",
    answer:
      "Both salaried employees and self-employed professionals are eligible. Key criteria: Age between 21–60 years, minimum monthly income of ₹15,000 (salaried) or ₹2 Lakhs annual income (self-employed), CIBIL score of 700 or above, and at least 1 year of work experience for salaried applicants.",
    category: "personal-loan",
    order: 1,
  },
  {
    id: "pl-2",
    question: "How much Personal Loan can I get?",
    answer:
      "You can get a Personal Loan ranging from ₹50,000 to ₹25 Lakhs. The exact loan amount depends on your income, credit profile, existing obligations, and repayment capacity as assessed by our credit team.",
    category: "personal-loan",
    order: 2,
  },
  {
    id: "pl-3",
    question: "What is the interest rate for a Personal Loan?",
    answer:
      "Personal Loan interest rates start from 10.5% per annum and go up to 24% p.a., depending on your credit score, income stability, loan tenure, and overall credit profile. A higher CIBIL score generally qualifies you for a lower rate.",
    category: "personal-loan",
    order: 3,
  },
  {
    id: "pl-4",
    question: "How long does it take to get a Personal Loan disbursed?",
    answer:
      "Once your application is complete and all documents are verified, loan approval typically takes 24–48 hours. Disbursement to your bank account happens within 24 hours of approval. For pre-approved customers, the turnaround can be as fast as 4 hours.",
    category: "personal-loan",
    order: 4,
  },
  {
    id: "pl-5",
    question: "Is there a penalty for early repayment of the Personal Loan?",
    answer:
      "There is no prepayment penalty after 6 months of the loan disbursal date. Partial or full prepayment before 6 months attracts a fee of 2% on the outstanding principal. We encourage borrowers to check the sanction letter for specific terms applicable to their loan.",
    category: "personal-loan",
    order: 5,
  },
  // MSME Loan
  {
    id: "ml-1",
    question: "What types of businesses are eligible for an MSME / Business Loan?",
    answer:
      "Proprietorships, partnership firms, private limited companies, and LLPs in manufacturing, trading, and service sectors are eligible. The business should have a minimum vintage of 2 years and annual turnover of ₹10 Lakhs or above.",
    category: "msme-loan",
    order: 1,
  },
  {
    id: "ml-2",
    question: "Can I get a Business Loan without collateral?",
    answer:
      "Yes. Under the Credit Guarantee Fund for Micro Units (CGFMU) scheme supported by SIDBI, we offer collateral-free business loans up to ₹50 Lakhs. For amounts above ₹50 Lakhs, collateral or co-applicant security may be required based on the credit assessment.",
    category: "msme-loan",
    order: 2,
  },
  {
    id: "ml-3",
    question: "What can I use an MSME Loan for?",
    answer:
      "MSME Loans from Vittodaya can be used for working capital requirements, purchase of machinery or equipment, business expansion, renovation of premises, inventory build-up, or any other business-related purpose. Funds cannot be used for speculative activities or personal consumption.",
    category: "msme-loan",
    order: 3,
  },
  {
    id: "ml-4",
    question: "What is the maximum tenure for an MSME Loan?",
    answer:
      "MSME Loans are available for tenures ranging from 12 months to 84 months (7 years). Working capital loans typically have shorter tenures (12–24 months), while term loans for machinery or expansion can go up to 84 months.",
    category: "msme-loan",
    order: 4,
  },
  // EV Loan
  {
    id: "ev-1",
    question: "Which types of electric vehicles are covered under the EV Loan?",
    answer:
      "Our EV Loan covers electric two-wheelers (e-scooters, e-bikes), electric three-wheelers (e-rickshaws, e-cargo), and electric four-wheelers (passenger cars). Both personal and commercial EV loans are available.",
    category: "ev-loan",
    order: 1,
  },
  {
    id: "ev-2",
    question: "Is the FAME II subsidy compatible with Vittodaya's EV Loan?",
    answer:
      "Yes. Our EV Loan structure is designed to be compatible with the Government of India's FAME II scheme and various state-level EV subsidy programmes. The subsidy amount is adjusted upfront, and the loan is structured on the net amount after subsidy deduction.",
    category: "ev-loan",
    order: 2,
  },
  {
    id: "ev-3",
    question: "What is the maximum Loan-to-Value (LTV) for EV Loans?",
    answer:
      "We finance up to 90% of the on-road price of the electric vehicle, including registration, insurance, and accessories. The remaining 10% is required as a down payment by the borrower.",
    category: "ev-loan",
    order: 3,
  },
  // LAP
  {
    id: "lap-1",
    question: "Which types of properties are accepted as collateral for a Loan Against Property?",
    answer:
      "We accept residential properties (apartments, independent houses, row houses), commercial properties (offices, shops, showrooms), and industrial properties as collateral. The property must have a clear, marketable title and should be legally approved by the competent authority.",
    category: "lap",
    order: 1,
  },
  {
    id: "lap-2",
    question: "How is the loan amount determined for a Loan Against Property?",
    answer:
      "The loan amount is typically up to 60% of the market value of the property, as assessed by our empanelled valuers. The final amount also depends on your income, repayment capacity, and credit profile.",
    category: "lap",
    order: 2,
  },
  {
    id: "lap-3",
    question: "Can I continue to use my property after mortgaging it?",
    answer:
      "Yes. Mortgaging your property to Vittodaya does not affect your right to use or occupy it. You can continue to live in or use the property as usual throughout the loan tenure. The mortgage is released automatically upon full repayment of the loan.",
    category: "lap",
    order: 3,
  },
  // Fixed Deposits
  {
    id: "fd-1",
    question: "Are deposits placed with Vittodaya safe?",
    answer:
      "Vittodaya Financial Services is a RBI-registered NBFC. While NBFC deposits are not covered under the DICGC (Deposit Insurance) scheme, we maintain a strong credit rating of A (Stable) from CRISIL, high capital adequacy, and a conservative investment portfolio to protect depositor funds.",
    category: "fd",
    order: 1,
  },
  {
    id: "fd-2",
    question: "What is the minimum amount to open an FD through Vittodaya?",
    answer:
      "The minimum investment amount varies by partner institution, starting from ₹1,000 for Small Finance Banks. For NBFCs listed on our platform, the minimum is ₹5,000–₹15,000. All options are clearly mentioned on the respective FD scheme page.",
    category: "fd",
    order: 2,
  },
  {
    id: "fd-3",
    question: "Can I get a loan against my Fixed Deposit?",
    answer:
      "Yes. Most FD schemes on the Vittodaya platform support a Loan Against FD (LAFD) facility, allowing you to borrow up to 85% of the FD value without breaking the deposit. This is a great option for short-term liquidity needs.",
    category: "fd",
    order: 3,
  },
  {
    id: "fd-4",
    question: "Do senior citizens get a higher interest rate?",
    answer:
      "Yes. Senior citizens (age 60 years and above) receive an additional 0.25% to 0.50% interest rate over the regular rate, depending on the partner institution. The senior citizen rate is clearly displayed on each FD scheme card.",
    category: "fd",
    order: 4,
  },
];

export function getFAQsByCategory(category: string): FAQ[] {
  if (category === "all") return faqs;
  return faqs.filter(f => f.category === category);
}
