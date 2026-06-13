export type BankType = "Small Finance Bank" | "NBFC" | "Corporate FD" | "Public Sector Bank" | "Private Bank";

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  type: BankType;
  rating: string;
  ratingAgency: string;
  established: number;
  hq: string;
  description: string;
  isActive: boolean;
}

export const banks: Bank[] = [
  {
    id: "ujjivan-sfb",
    name: "Ujjivan Small Finance Bank",
    shortName: "Ujjivan SFB",
    logo: "/banks/ujjivan.png",
    type: "Small Finance Bank",
    rating: "AA-",
    ratingAgency: "ICRA",
    established: 2017,
    hq: "Bengaluru",
    description: "One of India's leading small finance banks with a focus on the financially underserved.",
    isActive: true,
  },
  {
    id: "suryoday-sfb",
    name: "Suryoday Small Finance Bank",
    shortName: "Suryoday SFB",
    logo: "/banks/suryoday.png",
    type: "Small Finance Bank",
    rating: "A+",
    ratingAgency: "CARE",
    established: 2017,
    hq: "Mumbai",
    description: "Focused on providing financial services to unbanked and underbanked segments.",
    isActive: true,
  },
  {
    id: "jana-sfb",
    name: "Jana Small Finance Bank",
    shortName: "Jana SFB",
    logo: "/banks/jana.png",
    type: "Small Finance Bank",
    rating: "A",
    ratingAgency: "CRISIL",
    established: 2018,
    hq: "Bengaluru",
    description: "Building a sustainable banking institution for the masses.",
    isActive: true,
  },
  {
    id: "shriram-finance",
    name: "Shriram Finance Ltd",
    shortName: "Shriram Finance",
    logo: "/banks/shriram.png",
    type: "NBFC",
    rating: "AA+",
    ratingAgency: "CRISIL",
    established: 1979,
    hq: "Chennai",
    description: "India's largest retail NBFC with a strong track record of wealth creation.",
    isActive: true,
  },
  {
    id: "bajaj-finance",
    name: "Bajaj Finance Ltd",
    shortName: "Bajaj Finance",
    logo: "/banks/bajaj.png",
    type: "NBFC",
    rating: "AAA",
    ratingAgency: "CRISIL",
    established: 1987,
    hq: "Pune",
    description: "One of India's most diversified NBFCs with a AAA-rated FD.",
    isActive: true,
  },
  {
    id: "mahindra-finance",
    name: "Mahindra Finance",
    shortName: "Mahindra Finance",
    logo: "/banks/mahindra.png",
    type: "NBFC",
    rating: "AAA",
    ratingAgency: "ICRA",
    established: 1991,
    hq: "Mumbai",
    description: "Part of the Mahindra Group, offering trusted investment options.",
    isActive: true,
  },
  {
    id: "hdfc-bank",
    name: "HDFC Bank",
    shortName: "HDFC Bank",
    logo: "/banks/hdfc.png",
    type: "Private Bank",
    rating: "AAA",
    ratingAgency: "CRISIL",
    established: 1994,
    hq: "Mumbai",
    description: "India's largest private sector bank.",
    isActive: true,
  },
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    logo: "/banks/sbi.png",
    type: "Public Sector Bank",
    rating: "AAA",
    ratingAgency: "CRISIL",
    established: 1955,
    hq: "Mumbai",
    description: "India's largest public sector bank and a Fortune 500 company.",
    isActive: true,
  },
];
