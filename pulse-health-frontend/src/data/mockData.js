// ---------------------------------------------------------------------------
// Mock data layer. Replace with real API calls when a backend is connected.
// Every hospital dashboard reads only its own slice of this data (filtered
// by hospitalId). The admin dashboard reads across all hospitals.
// ---------------------------------------------------------------------------

export const seedHospitals = [
  {
    id: "hsp_001",
    name: "St. Xavier General",
    region: "Mumbai",
    address: "12 Marine Lines, Mumbai",
    contactEmail: "admin@stxaviergeneral.org",
    status: "Reporting",
    completeness: 98,
    lastActivity: "12 min ago",
    registeredAt: "2025-11-02",
  },
  {
    id: "hsp_002",
    name: "Thane Civic Hospital",
    region: "Thane",
    address: "4 Station Road, Thane",
    contactEmail: "ops@thanecivic.org",
    status: "Reporting",
    completeness: 91,
    lastActivity: "1 hr ago",
    registeredAt: "2025-09-14",
  },
  {
    id: "hsp_003",
    name: "Navi Mumbai Care Center",
    region: "Navi Mumbai",
    address: "22 Vashi Complex, Navi Mumbai",
    contactEmail: "info@nmcarecenter.org",
    status: "Delayed",
    completeness: 62,
    lastActivity: "9 hrs ago",
    registeredAt: "2026-01-20",
  },
  {
    id: "hsp_004",
    name: "Pune Metro Health",
    region: "Pune",
    address: "8 FC Road, Pune",
    contactEmail: "surveillance@punemetro.org",
    status: "Reporting",
    completeness: 100,
    lastActivity: "34 min ago",
    registeredAt: "2025-07-03",
  },
  {
    id: "hsp_005",
    name: "Nashik Regional",
    region: "Nashik",
    address: "3 College Road, Nashik",
    contactEmail: "contact@nashikregional.org",
    status: "Reporting",
    completeness: 87,
    lastActivity: "2 hrs ago",
    registeredAt: "2025-12-11",
  },
  {
    id: "hsp_006",
    name: "Aurangabad Health Center",
    region: "Aurangabad",
    address: "55 Central Avenue, Aurangabad",
    contactEmail: "helpdesk@aurangabadhealth.org",
    status: "Reporting",
    completeness: 92,
    lastActivity: "18 min ago",
    registeredAt: "2025-10-27",
  },
  {
    id: "hsp_007",
    name: "Solapur District Hospital",
    region: "Solapur",
    address: "12 Market Street, Solapur",
    contactEmail: "operations@solapurdistrict.org",
    status: "Delayed",
    completeness: 68,
    lastActivity: "5 hrs ago",
    registeredAt: "2026-02-09",
  },
  {
    id: "hsp_008",
    name: "Kolhapur Community Clinic",
    region: "Kolhapur",
    address: "9 Riverside Road, Kolhapur",
    contactEmail: "contact@kolhapurclinic.org",
    status: "Reporting",
    completeness: 95,
    lastActivity: "45 min ago",
    registeredAt: "2025-11-19",
  },
];

// Alerts keyed by hospitalId — each hospital only ever sees its own alerts.
export const seedAlertsByHospital = {
  hsp_001: [
    { id: "AL-1042", disease: "Dengue", probability: 81, risk: "High", window: "7–14 days", status: "Needs review", date: "2026-08-06" },
    { id: "AL-1038", disease: "Leptospirosis", probability: 39, risk: "Low", window: "10–14 days", status: "Normal", date: "2026-08-02" },
  ],
  hsp_002: [
    { id: "AL-1041", disease: "Chikungunya", probability: 58, risk: "Medium", window: "7–14 days", status: "Monitoring", date: "2026-08-05" },
    { id: "AL-1045", disease: "Malaria", probability: 42, risk: "Medium", window: "7–10 days", status: "Monitoring", date: "2026-08-03" },
  ],
  hsp_003: [
    { id: "AL-1035", disease: "Leptospirosis", probability: 46, risk: "Medium", window: "10–14 days", status: "Monitoring", date: "2026-08-04" },
    { id: "AL-1029", disease: "Dengue", probability: 33, risk: "Low", window: "14 days", status: "Normal", date: "2026-07-30" },
  ],
  hsp_004: [
    { id: "AL-1039", disease: "Influenza A", probability: 24, risk: "Low", window: "7–14 days", status: "Normal", date: "2026-08-05" },
  ],
  hsp_005: [
    { id: "AL-1048", disease: "Cholera", probability: 51, risk: "Medium", window: "5–9 days", status: "Monitoring", date: "2026-08-06" },
  ],
  hsp_006: [
    { id: "AL-1050", disease: "Dengue", probability: 74, risk: "High", window: "6–12 days", status: "Needs review", date: "2026-08-06" },
    { id: "AL-1052", disease: "Influenza B", probability: 29, risk: "Low", window: "7–14 days", status: "Normal", date: "2026-08-03" },
  ],
  hsp_007: [
    { id: "AL-1054", disease: "Malaria", probability: 62, risk: "High", window: "7–10 days", status: "Needs review", date: "2026-08-05" },
  ],
  hsp_008: [
    { id: "AL-1056", disease: "Chikungunya", probability: 48, risk: "Medium", window: "7–14 days", status: "Monitoring", date: "2026-08-04" },
  ],
};

export const trendData = [
  { day: "Mon", cases: 12 }, { day: "Tue", cases: 15 }, { day: "Wed", cases: 14 },
  { day: "Thu", cases: 19 }, { day: "Fri", cases: 24 }, { day: "Sat", cases: 27 },
  { day: "Sun", cases: 31 },
];

export const regionalRisk = [
  { region: "Mumbai", risk: 81 },
  { region: "Thane", risk: 64 },
  { region: "Navi Mumbai", risk: 58 },
  { region: "Pune", risk: 24 },
  { region: "Nashik", risk: 12 },
  { region: "Aurangabad", risk: 72 },
  { region: "Solapur", risk: 55 },
  { region: "Kolhapur", risk: 38 },
];

export const regionalThreats = [
  { region: "Mumbai", disease: "Dengue", risk: "High", note: "Outbreak potential remains elevated in coastal wards." },
  { region: "Thane", disease: "Chikungunya", risk: "Medium", note: "Monitor vector control and hospital admissions." },
  { region: "Navi Mumbai", disease: "Leptospirosis", risk: "Medium", note: "Heavy rainfall has raised contamination risk." },
  { region: "Pune", disease: "Influenza A", risk: "Low", note: "Seasonal cases are stable with no major spikes." },
  { region: "Nashik", disease: "Cholera", risk: "Medium", note: "Water-borne illness reports are increasing slightly." },
  { region: "Aurangabad", disease: "Dengue", risk: "High", note: "Vector surveys indicate rising transmission." },
  { region: "Solapur", disease: "Malaria", risk: "Medium", note: "Surveillance teams are tracking new cases." },
  { region: "Kolhapur", disease: "Chikungunya", risk: "Low", note: "Community alerts are in place." },
];

export const evidenceFactors = [
  ["Recent disease activity", 90],
  ["Hospital admissions", 78],
  ["Regional activity", 62],
  ["Rainfall", 55],
  ["Humidity", 48],
];

export const notificationUsers = [
  {
    id: "usr_001",
    name: "Dr. Maya Deshpande",
    role: "Hospital Admin",
    email: "admin@stxaviergeneral.org",
    avatar: "/avatars/default.jpg",
    hospitalId: "hsp_001",
  },
  {
    id: "usr_002",
    name: "Mr. Anand Patil",
    role: "Surveillance Lead",
    email: "ops@thanecivic.org",
    avatar: "/avatars/default.jpg",
    hospitalId: "hsp_002",
  },
  {
    id: "usr_003",
    name: "Dr. Sanya Rao",
    role: "Clinical Director",
    email: "info@nmcarecenter.org",
    avatar: "/avatars/default.jpg",
    hospitalId: "hsp_003",
  },
  {
    id: "usr_004",
    name: "Ms. Priya Nair",
    role: "Nurse Manager",
    email: "surveillance@punemetro.org",
    avatar: "/avatars/default.jpg",
    hospitalId: "hsp_004",
  },
  {
    id: "usr_005",
    name: "Mr. Rohit Sharma",
    role: "Outbreak Response",
    email: "contact@nashikregional.org",
    avatar: "/avatars/default.jpg",
    hospitalId: "hsp_005",
  },
  {
    id: "usr_006",
    name: "Ms. Leena Kulkarni",
    role: "Network Operations",
    email: "ops@healthnet.org",
    avatar: "/avatars/default.jpg",
    hospitalId: null,
  },
  {
    id: "usr_007",
    name: "Mr. Rohan Joshi",
    role: "Public Health Analyst",
    email: "alerts@healthnet.org",
    avatar: "/avatars/default.jpg",
    hospitalId: null,
  },
    {
      id: "usr_008",
      name: "Dr. Aisha Khan",
      role: "Epidemiology Lead",
      email: "lead@stxaviergeneral.org",
    avatar: "/avatars/default.jpg",
      hospitalId: "hsp_001",
    },
    {
      id: "usr_009",
      name: "Mr. Vikram Singh",
      role: "Data Analyst",
      email: "analytics@thanecivic.org",
    avatar: "/avatars/default.jpg",
      hospitalId: "hsp_002",
    },
    {
      id: "usr_010",
      name: "Ms. Priya Sharma",
      role: "Public Relations",
      email: "pr@nmcarecenter.org",
    avatar: "/avatars/default.jpg",
      hospitalId: "hsp_003",
    },
    {
      id: "usr_011",
      name: "Dr. Rahul Mehta",
      role: "Infection Control",
      email: "infection@punemetro.org",
    avatar: "/avatars/default.jpg",
      hospitalId: "hsp_004",
    },
    {
      id: "usr_012",
      name: "Ms. Ananya Patel",
      role: "Logistics Coordinator",
      email: "logistics@aurangabad.org",
      hospitalId: "hsp_006",
    },
    {
      id: "usr_013",
      name: "Mr. Sameer Joshi",
      role: "Research Scientist",
      email: "research@kolhapurclinic.org",
      hospitalId: "hsp_008",
    },
    {
      id: "usr_014",
      name: "Dr. Neha Singh",
      role: "Chief Medical Officer",
      email: "cmo@stxaviergeneral.org",
      hospitalId: "hsp_001",
    },
  ];

export function flattenAllAlerts(hospitals, alertsByHospital) {
  const hospitalById = Object.fromEntries(hospitals.map((h) => [h.id, h]));
  return Object.entries(alertsByHospital).flatMap(([hospitalId, list]) =>
    list.map((a) => ({ ...a, hospitalId, hospitalName: hospitalById[hospitalId]?.name || "Unknown" }))
  );
}
