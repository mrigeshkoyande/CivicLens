// ─── Types ───────────────────────────────────────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyColor: string;
  image: string;
  education: string;
  university: string;
  criminalCases: number;
  criminalDetails?: string;
  manifesto: string;
  aiSummary: string;
  attendance: number;
  fundUtilization: number;
  termLabel: string;
  matchScore?: number;
  strengths?: string[];
  differences?: string[];
}

export interface PollingBooth {
  id: string;
  name: string;
  address: string;
  distance: string;
  walkTime: string;
  waitTime: number;
  waitLevel: "low" | "medium" | "high";
  hasWheelchairAccess: boolean;
  wheelchair: boolean; // alias for hasWheelchairAccess
  lat: number;
  lng: number;
  recommended?: boolean;
}

export interface ElectionEvent {
  id: string;
  title: string;
  date: string;
  type: "registration" | "voting" | "result" | "nomination" | "campaign";
  phase?: string;
  description: string;
}

export interface FactCheckResult {
  id: string;
  claim: string;
  verdict: "TRUE" | "MISLEADING" | "FALSE";
  confidence: number;
  reasoning: string;
  points: string[];
  references: string[];
  timestamp: string;
}

export interface TrendingClaim {
  id: string;
  claim: string;       // alias for snippet
  snippet: string;
  verdict: "TRUE" | "MISLEADING" | "FALSE";
  time: string;        // alias for timeAgo
  timeAgo: string;
}

// ─── Candidates ──────────────────────────────────────────────────────────────

export const CANDIDATES: Candidate[] = [
  {
    id: "arjun-desai",
    name: "Arjun Desai",
    party: "National Progress Party",
    partyColor: "#3b82f6",
    image: "",
    education: "Ph.D. Economics",
    university: "Delhi University",
    criminalCases: 0,
    manifesto:
      "Infrastructure development, local school construction, hospital expansion, monsoon flood prevention, small business tax relief.",
    aiSummary:
      "He wants to build more schools and a big hospital right in our district. He promises to fix the broken roads that flood every monsoon season before next year. He also wants to give small shop owners a break on their taxes so they don't have to close down. Basically: build local stuff and help small stores stay open.",
    attendance: 88,
    fundUtilization: 92,
    termLabel: "Current Term",
    matchScore: 92,
    strengths: ["Strong on Infrastructure", "Aligns with Economy views"],
  },
  {
    id: "meera-reddy",
    name: "Meera Reddy",
    party: "United Citizens Front",
    partyColor: "#f59e0b",
    image: "",
    education: "M.Tech Computer Sci.",
    university: "IIT Bombay",
    criminalCases: 1,
    criminalDetails: "1 Pending Case — Defamation suit (Civil)",
    manifesto:
      "Tech sector growth, free bus passes for college students, elevated train system, land subsidies for tech companies.",
    aiSummary:
      "She wants to focus entirely on bringing new tech jobs to the city by offering big companies cheaper land to build offices. She also plans to give free bus rides to all college students. Instead of fixing roads, she wants to build a new elevated train system to skip traffic. Basically: modernize the city and bring big tech jobs.",
    attendance: 95,
    fundUtilization: 64,
    termLabel: "Mayor Term",
    matchScore: 78,
    strengths: ["Strong on Education"],
    differences: ["Differs on Healthcare"],
  },
  {
    id: "vikram-singh",
    name: "Vikram Singh",
    party: "Local Alliance",
    partyColor: "#8b5cf6",
    image: "",
    education: "B.A. Political Science",
    university: "Pune University",
    criminalCases: 0,
    manifesto:
      "Rural connectivity, farmer support, local language education, cultural preservation.",
    aiSummary:
      "He wants to connect rural villages with better roads and internet. His main focus is helping farmers get better prices for their crops. He also wants kids to learn in their local language alongside English. Basically: help villages and farmers.",
    attendance: 72,
    fundUtilization: 81,
    termLabel: "Previous Term",
    matchScore: 45,
  },
];

export const DASHBOARD_CANDIDATES = CANDIDATES.slice(0, 3);

// ─── Polling Booths ───────────────────────────────────────────────────────────

export const POLLING_BOOTHS: PollingBooth[] = [
  {
    id: "booth-1",
    name: "St. Mary's High School",
    address: "Room 4, Ground Floor, Sector 12, Main Road.",
    distance: "450m",
    walkTime: "6 mins",
    waitTime: 5,
    waitLevel: "low",
    hasWheelchairAccess: true,
    wheelchair: true,
    lat: 28.6139,
    lng: 77.209,
    recommended: true,
  },
  {
    id: "booth-2",
    name: "Community Center West",
    address: "Hall A, Block C, Park Avenue.",
    distance: "1.2km",
    walkTime: "15 mins",
    waitTime: 15,
    waitLevel: "medium",
    hasWheelchairAccess: false,
    wheelchair: false,
    lat: 28.6119,
    lng: 77.207,
  },
  {
    id: "booth-3",
    name: "Municipal Office Hall",
    address: "Govt Complex, Station Road.",
    distance: "2.4km",
    walkTime: "30 mins",
    waitTime: 45,
    waitLevel: "high",
    hasWheelchairAccess: true,
    wheelchair: true,
    lat: 28.609,
    lng: 77.211,
  },
  {
    id: "booth-4",
    name: "DPS School, Sector 4",
    address: "Block B, Near Metro, Sector 4.",
    distance: "3.1km",
    walkTime: "40 mins",
    waitTime: 10,
    waitLevel: "low",
    hasWheelchairAccess: true,
    wheelchair: true,
    lat: 28.615,
    lng: 77.2,
  },
];

// ─── Election Timeline ────────────────────────────────────────────────────────

export const ELECTION_EVENTS: ElectionEvent[] = [
  {
    id: "evt-1",
    title: "Voter Registration Deadline",
    date: "2024-04-15",
    type: "registration",
    description: "Last date to register as a voter or update voter ID details.",
  },
  {
    id: "evt-2",
    title: "Nomination Filing Begins",
    date: "2024-04-20",
    type: "nomination",
    description: "Candidates can start filing their nomination papers.",
  },
  {
    id: "evt-3",
    title: "Campaign Period Starts",
    date: "2024-04-22",
    type: "campaign",
    description: "Official campaign period begins. Rallies and public events allowed.",
  },
  {
    id: "evt-4",
    title: "Phase 1 Voting",
    date: "2024-04-26",
    type: "voting",
    phase: "Phase 1",
    description: "Voting for 102 constituencies across 21 states.",
  },
  {
    id: "evt-5",
    title: "Phase 2 Voting",
    date: "2024-04-29",
    type: "voting",
    phase: "Phase 2",
    description: "Voting for 89 constituencies.",
  },
  {
    id: "evt-6",
    title: "Phase 3 Voting",
    date: "2024-05-07",
    type: "voting",
    phase: "Phase 3",
    description: "Voting for 94 constituencies.",
  },
  {
    id: "evt-7",
    title: "Phase 4 Voting",
    date: "2024-05-13",
    type: "voting",
    phase: "Phase 4",
    description: "Voting for 96 constituencies.",
  },
  {
    id: "evt-8",
    title: "Phase 5 Voting",
    date: "2024-05-20",
    type: "voting",
    phase: "Phase 5",
    description: "Voting for 49 constituencies.",
  },
  {
    id: "evt-9",
    title: "Phase 6 Voting",
    date: "2024-05-25",
    type: "voting",
    phase: "Phase 6",
    description: "Voting for 58 constituencies.",
  },
  {
    id: "evt-10",
    title: "Phase 7 Voting",
    date: "2024-06-01",
    type: "voting",
    phase: "Phase 7",
    description: "Final phase voting for 57 constituencies.",
  },
  {
    id: "evt-11",
    title: "Vote Counting Day",
    date: "2024-06-04",
    type: "result",
    description: "Counting of votes begins. Results declared.",
  },
];

// ─── Trending Fact-Checks ─────────────────────────────────────────────────────

export const TRENDING_CLAIMS: TrendingClaim[] = [
  {
    id: "tc-1",
    snippet: "Polling stations in Sector 4 will remain open an extra hour due to morning delays.",
    claim:   "Polling stations in Sector 4 will remain open an extra hour due to morning delays.",
    verdict: "TRUE",
    timeAgo: "2h ago",
    time:    "2h ago",
  },
  {
    id: "tc-2",
    snippet: "Candidate X caught distributing cash in leaked midnight footage.",
    claim:   "Candidate X caught distributing cash in leaked midnight footage.",
    verdict: "FALSE",
    timeAgo: "5h ago",
    time:    "5h ago",
  },
  {
    id: "tc-3",
    snippet: "New tax policy will immediately reduce local business margins by 20%.",
    claim:   "New tax policy will immediately reduce local business margins by 20%.",
    verdict: "MISLEADING",
    timeAgo: "1d ago",
    time:    "1d ago",
  },
  {
    id: "tc-4",
    snippet: "EVM machines are connected to external WiFi networks during polling.",
    claim:   "EVM machines are connected to external WiFi networks during polling.",
    verdict: "FALSE",
    timeAgo: "2d ago",
    time:    "2d ago",
  },
];

// ─── Onboarding Checklist ─────────────────────────────────────────────────────

export function generateChecklist(
  age: number,
  state: string,
  voterStatus: string
) {
  const items = [];

  if (age >= 18) {
    if (voterStatus === "not-registered") {
      items.push({
        id: "register",
        task: "Register on voters.eci.gov.in",
        priority: "high",
        link: "https://voters.eci.gov.in",
      });
    } else {
      items.push({
        id: "verify",
        task: "Verify your voter registration details",
        priority: "medium",
        link: "https://electoralsearch.eci.gov.in",
      });
    }
    items.push(
      { id: "id", task: "Keep your Voter ID / Aadhaar Card handy", priority: "high" },
      { id: "booth", task: "Find your nearest polling booth", priority: "medium" },
      { id: "date", task: "Note down your constituency's voting date", priority: "high" },
      { id: "compare", task: "Compare candidates in your constituency", priority: "medium" },
      { id: "factcheck", task: "Fact-check any claims you've seen on social media", priority: "low" }
    );
  } else {
    items.push(
      { id: "age", task: `You'll be eligible to vote at age 18 (${18 - age} years away)`, priority: "info" },
      { id: "learn", task: "Learn how the election process works", priority: "medium" },
      { id: "awareness", task: "Explore candidates and issues in your area", priority: "low" }
    );
  }

  return items;
}

// ─── AI Explainer FAQs ────────────────────────────────────────────────────────

export const EXPLAINER_SUGGESTIONS: Record<string, string[]> = {
  English: [
    "How does India's voting system work?",
    "What is EVM and is it safe?",
    "How are winning candidates decided?",
    "What is the role of the Election Commission?",
    "How can I register to vote?",
    "What documents do I need at the polling booth?",
  ],
  Hindi: [
    "भारत का मतदान प्रणाली कैसे काम करती है?",
    "EVM क्या है और क्या यह सुरक्षित है?",
    "जीतने वाले उम्मीदवार का निर्धारण कैसे होता है?",
    "मतदाता के रूप में कैसे पंजीकरण करें?",
    "चुनाव आयोग की क्या भूमिका है?",
  ],
  Marathi: [
    "भारताची मतदान प्रणाली कशी काम करते?",
    "EVM म्हणजे काय आणि ते सुरक्षित आहे का?",
    "विजेत्या उमेदवाराचे निर्धारण कसे होते?",
    "मतदार म्हणून नोंदणी कशी करावी?",
    "निवडणूक आयोगाची भूमिका काय आहे?",
  ],
};

// ─── Sample AI Responses (fallback) ──────────────────────────────────────────

export const FALLBACK_RESPONSES: Record<string, string> = {
  "How does India's voting system work?":
    "India uses a **First-Past-The-Post (FPTP)** system. The country is divided into 543 Lok Sabha constituencies. Each constituency elects one Member of Parliament (MP). On voting day, you go to your assigned polling booth, verify your identity, and press the button next to your chosen candidate on the Electronic Voting Machine (EVM). The candidate who gets the most votes in a constituency wins — even if they don't get more than half the votes.",
  default:
    "Great question! India's democratic system is one of the largest in the world, with over 970 million eligible voters. Elections are conducted by the independent Election Commission of India (ECI), which ensures free and fair elections. Feel free to ask me anything specific about the voting process, candidates, or your rights as a voter!",
};
