export interface TenureRate {
  tenureMonths: number;
  tenureLabel: string;
  regularRate: number;
  seniorRate: number;
}

export interface FDScheme {
  id: string;
  bankId: string;
  bankName: string;
  bankType: string;
  schemeName: string;
  minAmount: number;
  maxAmount: number | null;
  tenureRates: TenureRate[];
  compoundingFrequency: "Monthly" | "Quarterly" | "Half-Yearly" | "Annually" | "At Maturity";
  prematureWithdrawal: boolean;
  loanAgainstFD: boolean;
  autoRenewal: boolean;
  taxSaverFD: boolean;
  rating: string;
  ratingAgency: string;
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

export const fdSchemes: FDScheme[] = [
  {
    id: "ujjivan-regular-fd",
    bankId: "ujjivan-sfb",
    bankName: "Ujjivan Small Finance Bank",
    bankType: "Small Finance Bank",
    schemeName: "Regular Fixed Deposit",
    minAmount: 1000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 3, tenureLabel: "3 Months", regularRate: 4.50, seniorRate: 5.00 },
      { tenureMonths: 6, tenureLabel: "6 Months", regularRate: 5.50, seniorRate: 6.00 },
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 8.25, seniorRate: 8.75 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 8.50, seniorRate: 9.00 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 8.25, seniorRate: 8.75 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 8.00, seniorRate: 8.50 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 7.50, seniorRate: 8.00 },
    ],
    compoundingFrequency: "Quarterly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: false,
    rating: "AA-",
    ratingAgency: "ICRA",
    tags: ["High Interest", "Popular"],
    isActive: true,
    featuredOrder: 1,
  },
  {
    id: "suryoday-regular-fd",
    bankId: "suryoday-sfb",
    bankName: "Suryoday Small Finance Bank",
    bankType: "Small Finance Bank",
    schemeName: "Regular Fixed Deposit",
    minAmount: 1000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 3, tenureLabel: "3 Months", regularRate: 4.75, seniorRate: 5.25 },
      { tenureMonths: 6, tenureLabel: "6 Months", regularRate: 6.00, seniorRate: 6.50 },
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 9.10, seniorRate: 9.60 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 9.10, seniorRate: 9.60 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 8.60, seniorRate: 9.10 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 8.60, seniorRate: 9.10 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 8.25, seniorRate: 8.75 },
    ],
    compoundingFrequency: "Quarterly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: false,
    rating: "A+",
    ratingAgency: "CARE",
    tags: ["Highest Rate", "Top Pick"],
    isActive: true,
    featuredOrder: 2,
  },
  {
    id: "jana-regular-fd",
    bankId: "jana-sfb",
    bankName: "Jana Small Finance Bank",
    bankType: "Small Finance Bank",
    schemeName: "Regular Fixed Deposit",
    minAmount: 1000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 6, tenureLabel: "6 Months", regularRate: 6.25, seniorRate: 6.75 },
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 8.75, seniorRate: 9.25 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 8.75, seniorRate: 9.25 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 8.50, seniorRate: 9.00 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 8.25, seniorRate: 8.75 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 8.00, seniorRate: 8.50 },
    ],
    compoundingFrequency: "Quarterly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: false,
    rating: "A",
    ratingAgency: "CRISIL",
    tags: ["Good Returns"],
    isActive: true,
    featuredOrder: 3,
  },
  {
    id: "shriram-regular-fd",
    bankId: "shriram-finance",
    bankName: "Shriram Finance Ltd",
    bankType: "NBFC",
    schemeName: "Shriram Fixed Deposit",
    minAmount: 5000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 8.27, seniorRate: 8.77 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 8.51, seniorRate: 9.01 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 8.77, seniorRate: 9.27 },
      { tenureMonths: 48, tenureLabel: "48 Months", regularRate: 8.77, seniorRate: 9.27 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 9.00, seniorRate: 9.50 },
    ],
    compoundingFrequency: "Monthly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: false,
    taxSaverFD: false,
    rating: "AA+",
    ratingAgency: "CRISIL",
    tags: ["AA+ Rated", "Trusted Brand"],
    isActive: true,
    featuredOrder: 4,
  },
  {
    id: "bajaj-regular-fd",
    bankId: "bajaj-finance",
    bankName: "Bajaj Finance Ltd",
    bankType: "NBFC",
    schemeName: "Bajaj Finance FD",
    minAmount: 15000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 7.40, seniorRate: 7.65 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 7.65, seniorRate: 7.90 },
      { tenureMonths: 22, tenureLabel: "22 Months", regularRate: 8.05, seniorRate: 8.30 },
      { tenureMonths: 33, tenureLabel: "33 Months", regularRate: 8.05, seniorRate: 8.30 },
      { tenureMonths: 42, tenureLabel: "42 Months", regularRate: 8.10, seniorRate: 8.35 },
      { tenureMonths: 44, tenureLabel: "44 Months", regularRate: 8.10, seniorRate: 8.35 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 7.95, seniorRate: 8.20 },
    ],
    compoundingFrequency: "Monthly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: false,
    rating: "AAA",
    ratingAgency: "CRISIL",
    tags: ["AAA Rated", "Most Safe"],
    isActive: true,
    featuredOrder: 5,
  },
  {
    id: "mahindra-regular-fd",
    bankId: "mahindra-finance",
    bankName: "Mahindra Finance",
    bankType: "NBFC",
    schemeName: "Mahindra Finance FD",
    minAmount: 5000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 7.75, seniorRate: 8.00 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 7.90, seniorRate: 8.15 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 8.00, seniorRate: 8.25 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 8.05, seniorRate: 8.30 },
      { tenureMonths: 48, tenureLabel: "48 Months", regularRate: 8.10, seniorRate: 8.35 },
    ],
    compoundingFrequency: "Monthly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: false,
    rating: "AAA",
    ratingAgency: "ICRA",
    tags: ["AAA Rated"],
    isActive: true,
  },
  {
    id: "hdfc-regular-fd",
    bankId: "hdfc-bank",
    bankName: "HDFC Bank",
    bankType: "Private Bank",
    schemeName: "Regular Fixed Deposit",
    minAmount: 5000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 3, tenureLabel: "3 Months", regularRate: 3.00, seniorRate: 3.50 },
      { tenureMonths: 6, tenureLabel: "6 Months", regularRate: 4.50, seniorRate: 5.00 },
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 6.60, seniorRate: 7.10 },
      { tenureMonths: 18, tenureLabel: "18 Months", regularRate: 7.25, seniorRate: 7.75 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 7.00, seniorRate: 7.50 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 7.00, seniorRate: 7.50 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 7.00, seniorRate: 7.50 },
    ],
    compoundingFrequency: "Quarterly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: true,
    rating: "AAA",
    ratingAgency: "CRISIL",
    tags: ["Tax Saver Available"],
    isActive: true,
  },
  {
    id: "sbi-regular-fd",
    bankId: "sbi",
    bankName: "State Bank of India",
    bankType: "Public Sector Bank",
    schemeName: "SBI Fixed Deposit",
    minAmount: 1000,
    maxAmount: null,
    tenureRates: [
      { tenureMonths: 3, tenureLabel: "3 Months", regularRate: 3.50, seniorRate: 4.00 },
      { tenureMonths: 6, tenureLabel: "6 Months", regularRate: 5.50, seniorRate: 6.00 },
      { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 6.80, seniorRate: 7.30 },
      { tenureMonths: 24, tenureLabel: "24 Months", regularRate: 7.00, seniorRate: 7.50 },
      { tenureMonths: 36, tenureLabel: "36 Months", regularRate: 6.75, seniorRate: 7.25 },
      { tenureMonths: 60, tenureLabel: "5 Years", regularRate: 6.50, seniorRate: 7.50 },
    ],
    compoundingFrequency: "Quarterly",
    prematureWithdrawal: true,
    loanAgainstFD: true,
    autoRenewal: true,
    taxSaverFD: true,
    rating: "AAA",
    ratingAgency: "CRISIL",
    tags: ["Tax Saver Available", "Govt Backed"],
    isActive: true,
  },
];

export function getMaxRate(scheme: FDScheme, isSenior = false): number {
  return Math.max(...scheme.tenureRates.map(r => isSenior ? r.seniorRate : r.regularRate));
}

export function getRateForTenure(scheme: FDScheme, months: number, isSenior = false): number | null {
  const rate = scheme.tenureRates.find(r => r.tenureMonths === months);
  if (!rate) return null;
  return isSenior ? rate.seniorRate : rate.regularRate;
}
