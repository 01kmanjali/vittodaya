export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive" | "pending";
export type KYCStatus = "verified" | "pending" | "rejected" | "not_started";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  panNumber?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isSeniorCitizen: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const users: User[] = [
  {
    id: "usr-001",
    name: "Anjali Sharma",
    email: "01kmanjali@gmail.com",
    phone: "9876543210",
    role: "user",
    status: "active",
    kycStatus: "verified",
    panNumber: "ABCPS1234D",
    dateOfBirth: "1990-05-15",
    address: "123, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isSeniorCitizen: false,
    createdAt: "2024-01-10",
    lastLogin: "2025-06-01",
  },
  {
    id: "usr-002",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "9123456780",
    role: "user",
    status: "active",
    kycStatus: "verified",
    panNumber: "FGHPK5678R",
    dateOfBirth: "1958-11-22",
    city: "Delhi",
    state: "Delhi",
    isSeniorCitizen: true,
    createdAt: "2024-02-14",
    lastLogin: "2025-05-28",
  },
  {
    id: "usr-003",
    name: "Priya Mehta",
    email: "priya@example.com",
    phone: "9988776655",
    role: "user",
    status: "active",
    kycStatus: "pending",
    dateOfBirth: "1985-03-08",
    city: "Bengaluru",
    state: "Karnataka",
    isSeniorCitizen: false,
    createdAt: "2024-03-20",
    lastLogin: "2025-06-05",
  },
  {
    id: "usr-004",
    name: "Suresh Patel",
    email: "suresh@example.com",
    phone: "9765432109",
    role: "user",
    status: "inactive",
    kycStatus: "not_started",
    city: "Ahmedabad",
    state: "Gujarat",
    isSeniorCitizen: false,
    createdAt: "2024-04-05",
  },
  {
    id: "adm-001",
    name: "Admin User",
    email: "admin@vfspl.in",
    phone: "9000000001",
    role: "admin",
    status: "active",
    kycStatus: "verified",
    isSeniorCitizen: false,
    createdAt: "2023-01-01",
    lastLogin: "2025-06-07",
  },
];

export const currentUser = users[0];
export const adminUser = users[4];
