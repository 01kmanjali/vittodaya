export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  publishedDate: string;
  category: "press-release" | "media-coverage" | "awards" | "announcement";
  imageInitial: string;
  imageColor: string;
  readTime: string;
  isFeatured?: boolean;
}

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  fileSize: string;
}

export interface Award {
  id: string;
  title: string;
  awardedBy: string;
  year: string;
  description: string;
  icon: string;
}

export interface MediaContact {
  name: string;
  designation: string;
  email: string;
  phone: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Vittodaya Financial Services Raises ₹150 Crore in Series B Funding",
    excerpt:
      "Vittodaya Financial Services Pvt. Ltd. has successfully closed its Series B funding round of ₹150 crore led by a consortium of institutional investors, to expand its lending portfolio across Tier 2 and Tier 3 cities.",
    source: "Press Release",
    publishedDate: "15 May 2025",
    category: "press-release",
    imageInitial: "V",
    imageColor: "#0f4c81",
    readTime: "3 min read",
    isFeatured: true,
  },
  {
    id: "news-2",
    title: "Vittodaya Launches Electric Vehicle Loan Product Targeting Green Mobility",
    excerpt:
      "In a bid to support India's green mobility agenda, Vittodaya has launched a dedicated EV loan product offering interest rates starting at 8.99% p.a. for electric two-wheelers, three-wheelers, and passenger vehicles.",
    source: "Press Release",
    publishedDate: "02 Apr 2025",
    category: "press-release",
    imageInitial: "V",
    imageColor: "#059669",
    readTime: "4 min read",
    isFeatured: true,
  },
  {
    id: "news-3",
    title: "Vittodaya Wins 'Best MSME Lender 2024' at India NBFC Awards",
    excerpt:
      "Vittodaya Financial Services was honoured with the 'Best MSME Lender' award at the prestigious India NBFC Leadership Summit & Awards 2024, recognising its contribution to financial inclusion in the small business segment.",
    source: "India NBFC Awards",
    publishedDate: "18 Jan 2025",
    category: "awards",
    imageInitial: "🏆",
    imageColor: "#c8922a",
    readTime: "2 min read",
    isFeatured: true,
  },
  {
    id: "news-4",
    title: "CRISIL Affirms 'A (Stable)' Rating for Vittodaya's Long-Term Debt",
    excerpt:
      "Credit rating agency CRISIL has affirmed its 'A (Stable)' rating for Vittodaya Financial Services' long-term bank facilities, reflecting the company's sound asset quality and robust capital adequacy.",
    source: "Financial Express",
    publishedDate: "10 Dec 2024",
    category: "media-coverage",
    imageInitial: "C",
    imageColor: "#7c3aed",
    readTime: "3 min read",
  },
  {
    id: "news-5",
    title: "Vittodaya Expands Branch Network to 150 Locations Across 12 States",
    excerpt:
      "Vittodaya Financial Services has expanded its on-ground presence to 150 branches across 12 Indian states, with a strong focus on semi-urban and rural markets to drive financial inclusion.",
    source: "Business Standard",
    publishedDate: "22 Nov 2024",
    category: "media-coverage",
    imageInitial: "B",
    imageColor: "#0f4c81",
    readTime: "4 min read",
  },
  {
    id: "news-6",
    title: "Vittodaya Partners with SIDBI Under CGFMU for Collateral-free MSME Loans",
    excerpt:
      "Vittodaya Financial Services has entered into a partnership with SIDBI's CGFMU scheme to offer collateral-free business loans up to ₹50 Lakhs to Micro, Small & Medium Enterprises.",
    source: "Press Release",
    publishedDate: "05 Sep 2024",
    category: "announcement",
    imageInitial: "V",
    imageColor: "#c8922a",
    readTime: "3 min read",
  },
];

export const pressReleases: PressRelease[] = [
  { id: "pr-1", title: "Q3 FY25 Financial Results", date: "14 Feb 2025", fileSize: "480 KB" },
  { id: "pr-2", title: "Series B Fundraise Announcement", date: "15 May 2025", fileSize: "320 KB" },
  { id: "pr-3", title: "EV Loan Product Launch", date: "02 Apr 2025", fileSize: "290 KB" },
  { id: "pr-4", title: "Q2 FY25 Financial Results", date: "14 Nov 2024", fileSize: "455 KB" },
  { id: "pr-5", title: "Branch Expansion – 150 Locations", date: "22 Nov 2024", fileSize: "260 KB" },
  { id: "pr-6", title: "SIDBI-CGFMU Partnership Announcement", date: "05 Sep 2024", fileSize: "310 KB" },
];

export const awards: Award[] = [
  {
    id: "award-1",
    title: "Best MSME Lender 2024",
    awardedBy: "India NBFC Leadership Summit & Awards",
    year: "2024",
    description: "Recognised for outstanding contribution to MSME financial inclusion and product innovation.",
    icon: "🏆",
  },
  {
    id: "award-2",
    title: "Fastest Growing NBFC – West India",
    awardedBy: "FICCI Financial Services Conference",
    year: "2023",
    description: "Awarded for achieving 40%+ AUM growth while maintaining healthy asset quality.",
    icon: "📈",
  },
  {
    id: "award-3",
    title: "Excellence in Digital Lending",
    awardedBy: "IBA Banking Technology Awards",
    year: "2023",
    description: "Recognised for digital-first lending processes and customer experience innovation.",
    icon: "💻",
  },
  {
    id: "award-4",
    title: "Best Workplace – BFSI Sector",
    awardedBy: "Great Place to Work Institute",
    year: "2024",
    description: "Certified as a Great Place to Work for employee engagement, culture, and leadership.",
    icon: "⭐",
  },
];

export const mediaContact: MediaContact = {
  name: "Pooja Desai",
  designation: "Head – Corporate Communications",
  email: "media@vfspl.in",
  phone: "+91 98765 43210",
};
