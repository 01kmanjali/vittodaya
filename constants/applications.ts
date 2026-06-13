export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "active"
  | "matured"
  | "cancelled"
  | "rejected";

export interface FDApplication {
  id: string;
  userId: string;
  userName: string;
  schemeId: string;
  schemeName: string;
  bankId: string;
  bankName: string;
  principalAmount: number;
  tenureMonths: number;
  tenureLabel: string;
  interestRate: number;
  maturityAmount: number;
  isSeniorCitizen: boolean;
  compoundingFrequency: string;
  status: ApplicationStatus;
  appliedAt: string;
  approvedAt?: string;
  startDate?: string;
  maturityDate?: string;
  fdNumber?: string;
  remarks?: string;
}

export const applications: FDApplication[] = [
  {
    id: "app-001",
    userId: "usr-001",
    userName: "Anjali Sharma",
    schemeId: "ujjivan-regular-fd",
    schemeName: "Regular Fixed Deposit",
    bankId: "ujjivan-sfb",
    bankName: "Ujjivan Small Finance Bank",
    principalAmount: 100000,
    tenureMonths: 12,
    tenureLabel: "12 Months",
    interestRate: 8.25,
    maturityAmount: 108592,
    isSeniorCitizen: false,
    compoundingFrequency: "Quarterly",
    status: "active",
    appliedAt: "2025-01-10",
    approvedAt: "2025-01-12",
    startDate: "2025-01-15",
    maturityDate: "2026-01-15",
    fdNumber: "UJJ/FD/2025/001",
  },
  {
    id: "app-002",
    userId: "usr-001",
    userName: "Anjali Sharma",
    schemeId: "bajaj-regular-fd",
    schemeName: "Bajaj Finance FD",
    bankId: "bajaj-finance",
    bankName: "Bajaj Finance Ltd",
    principalAmount: 50000,
    tenureMonths: 22,
    tenureLabel: "22 Months",
    interestRate: 8.05,
    maturityAmount: 57694,
    isSeniorCitizen: false,
    compoundingFrequency: "Monthly",
    status: "active",
    appliedAt: "2024-12-05",
    approvedAt: "2024-12-07",
    startDate: "2024-12-10",
    maturityDate: "2026-10-10",
    fdNumber: "BJF/FD/2024/458",
  },
  {
    id: "app-003",
    userId: "usr-002",
    userName: "Rajesh Kumar",
    schemeId: "suryoday-regular-fd",
    schemeName: "Regular Fixed Deposit",
    bankId: "suryoday-sfb",
    bankName: "Suryoday Small Finance Bank",
    principalAmount: 200000,
    tenureMonths: 18,
    tenureLabel: "18 Months",
    interestRate: 9.60,
    maturityAmount: 230192,
    isSeniorCitizen: true,
    compoundingFrequency: "Quarterly",
    status: "active",
    appliedAt: "2024-11-20",
    approvedAt: "2024-11-22",
    startDate: "2024-11-25",
    maturityDate: "2026-05-25",
    fdNumber: "SUR/FD/2024/221",
  },
  {
    id: "app-004",
    userId: "usr-003",
    userName: "Priya Mehta",
    schemeId: "shriram-regular-fd",
    schemeName: "Shriram Fixed Deposit",
    bankId: "shriram-finance",
    bankName: "Shriram Finance Ltd",
    principalAmount: 75000,
    tenureMonths: 36,
    tenureLabel: "36 Months",
    interestRate: 8.77,
    maturityAmount: 99156,
    isSeniorCitizen: false,
    compoundingFrequency: "Monthly",
    status: "under_review",
    appliedAt: "2025-06-01",
    remarks: "KYC verification pending",
  },
  {
    id: "app-005",
    userId: "usr-001",
    userName: "Anjali Sharma",
    schemeId: "hdfc-regular-fd",
    schemeName: "Regular Fixed Deposit",
    bankId: "hdfc-bank",
    bankName: "HDFC Bank",
    principalAmount: 150000,
    tenureMonths: 60,
    tenureLabel: "5 Years",
    interestRate: 7.00,
    maturityAmount: 212938,
    isSeniorCitizen: false,
    compoundingFrequency: "Quarterly",
    status: "matured",
    appliedAt: "2020-06-01",
    approvedAt: "2020-06-03",
    startDate: "2020-06-05",
    maturityDate: "2025-06-05",
    fdNumber: "HDFC/FD/2020/789",
  },
];

export function getApplicationsByUser(userId: string) {
  return applications.filter(a => a.userId === userId);
}

export function getApplicationStats() {
  return {
    total: applications.length,
    active: applications.filter(a => a.status === "active").length,
    underReview: applications.filter(a => a.status === "under_review").length,
    matured: applications.filter(a => a.status === "matured").length,
    totalInvested: applications.reduce((sum, a) => sum + a.principalAmount, 0),
    totalMaturity: applications.reduce((sum, a) => sum + a.maturityAmount, 0),
  };
}
