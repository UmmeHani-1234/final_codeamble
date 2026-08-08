// seed.js — populates every Pulse Health collection with demo data.
// Run once:  node seed.js
// Re-run:    node seed.js  (safe — drops collections first)

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const Hospital             = require('./models/Hospital');
const Admin                = require('./models/Admin');
const Alert                = require('./models/Alert');
const SurveillanceSubmission = require('./models/SurveillanceSubmission');
const NotificationUser     = require('./models/NotificationUser');
const RegionalRisk         = require('./models/RegionalRisk');
const RiskSnapshot         = require('./models/RiskSnapshot');
const Notification         = require('./models/Notification');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const daysAgo  = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(0,0,0,0); return d; };
const hoursAgo = (n) => new Date(Date.now() - n * 3600 * 1000);
const hash     = (pw) => bcrypt.hashSync(pw, 10);
const clamp    = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

async function drop(model) {
  await model.deleteMany({});
  console.log(`  ✓ cleared ${model.modelName}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HOSPITALS
// ─────────────────────────────────────────────────────────────────────────────
const hospitalDefs = [
  { name: 'St. Xavier General',        region: 'Mumbai',      address: '12 Marine Lines, Mumbai',       email: 'admin@stxaviergeneral.org',    completeness: 98, status: 'Reporting', lastActivity: '12 min ago',  hoursAgo: 0.2 },
  { name: 'Thane Civic Hospital',       region: 'Thane',       address: '4 Station Road, Thane',         email: 'ops@thanecivic.org',            completeness: 91, status: 'Reporting', lastActivity: '1 hr ago',    hoursAgo: 1   },
  { name: 'Navi Mumbai Care Center',    region: 'Navi Mumbai', address: '22 Vashi Complex, Navi Mumbai', email: 'info@nmcarecenter.org',         completeness: 62, status: 'Delayed',   lastActivity: '9 hrs ago',   hoursAgo: 9   },
  { name: 'Pune Metro Health',          region: 'Pune',        address: '8 FC Road, Pune',               email: 'surveillance@punemetro.org',    completeness:100, status: 'Reporting', lastActivity: '34 min ago',  hoursAgo: 0.6 },
  { name: 'Nashik Regional',            region: 'Nashik',      address: '3 College Road, Nashik',        email: 'contact@nashikregional.org',    completeness: 87, status: 'Reporting', lastActivity: '2 hrs ago',   hoursAgo: 2   },
  { name: 'Aurangabad Health Center',   region: 'Aurangabad',  address: '55 Central Avenue, Aurangabad', email: 'helpdesk@aurangabadhealth.org', completeness: 92, status: 'Reporting', lastActivity: '18 min ago',  hoursAgo: 0.3 },
  { name: 'Solapur District Hospital',  region: 'Solapur',     address: '12 Market Street, Solapur',     email: 'operations@solapurdistrict.org',completeness: 68, status: 'Delayed',   lastActivity: '5 hrs ago',   hoursAgo: 5   },
  { name: 'Kolhapur Community Clinic',  region: 'Kolhapur',    address: '9 Riverside Road, Kolhapur',    email: 'contact@kolhapurclinic.org',    completeness: 95, status: 'Reporting', lastActivity: '45 min ago',  hoursAgo: 0.8 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. ALERTS (per hospital)
// ─────────────────────────────────────────────────────────────────────────────
const alertDefs = {
  'St. Xavier General': [
    { alertCode: 'AL-1042', disease: 'Dengue',        probability: 81, risk: 'High',   window: '7–14 days',  status: 'Needs review', daysAgo: 3,
      evidenceFactors: [
        { label: 'Recent disease activity', score: 90 },
        { label: 'Hospital admissions',     score: 78 },
        { label: 'Regional activity',       score: 62 },
        { label: 'Rainfall',                score: 55 },
        { label: 'Humidity',                score: 48 },
      ],
      aiExplanation: 'Pulse identified a combination of rising disease activity, hospital admission trends, and seasonal environmental conditions consistent with increased transmission risk at your site.' },
    { alertCode: 'AL-1038', disease: 'Leptospirosis', probability: 39, risk: 'Low',    window: '10–14 days', status: 'Normal',        daysAgo: 7,
      evidenceFactors: [{ label: 'Recent disease activity', score: 30 }, { label: 'Rainfall', score: 60 }],
      aiExplanation: 'Low-level signal detected. Seasonal rainfall raises background leptospirosis risk but hospital admissions remain within normal range.' },
  ],
  'Thane Civic Hospital': [
    { alertCode: 'AL-1041', disease: 'Chikungunya',   probability: 58, risk: 'Medium', window: '7–14 days',  status: 'Monitoring',    daysAgo: 4,
      evidenceFactors: [{ label: 'Recent disease activity', score: 55 }, { label: 'Hospital admissions', score: 60 }, { label: 'Regional activity', score: 50 }],
      aiExplanation: 'Vector surveillance indicates moderate chikungunya transmission risk in the Thane region. Hospital admission patterns are consistent with seasonal elevation.' },
    { alertCode: 'AL-1045', disease: 'Malaria',        probability: 42, risk: 'Medium', window: '7–10 days',  status: 'Monitoring',    daysAgo: 6,
      evidenceFactors: [{ label: 'Recent disease activity', score: 40 }, { label: 'Humidity', score: 55 }],
      aiExplanation: 'Malaria risk is moderately elevated. Humidity and recent case counts contribute to the signal but remain below high-risk threshold.' },
  ],
  'Navi Mumbai Care Center': [
    { alertCode: 'AL-1035', disease: 'Leptospirosis', probability: 46, risk: 'Medium', window: '10–14 days', status: 'Monitoring',    daysAgo: 5,
      evidenceFactors: [{ label: 'Rainfall', score: 80 }, { label: 'Regional activity', score: 55 }],
      aiExplanation: 'Flooding in adjacent districts has elevated leptospirosis background risk. Patient admission data is lagging — submission is recommended.' },
    { alertCode: 'AL-1029', disease: 'Dengue',        probability: 33, risk: 'Low',    window: '14 days',    status: 'Normal',        daysAgo: 10,
      evidenceFactors: [{ label: 'Recent disease activity', score: 28 }, { label: 'Humidity', score: 40 }],
      aiExplanation: 'Current dengue risk remains low. Monitor mosquito breeding sites as monsoon season progresses.' },
  ],
  'Pune Metro Health': [
    { alertCode: 'AL-1039', disease: 'Influenza A',   probability: 24, risk: 'Low',    window: '7–14 days',  status: 'Normal',        daysAgo: 4,
      evidenceFactors: [{ label: 'Recent disease activity', score: 22 }, { label: 'Hospital admissions', score: 18 }],
      aiExplanation: 'Influenza A activity is at baseline. No significant deviation from historical seasonal patterns observed at this facility.' },
  ],
  'Nashik Regional': [
    { alertCode: 'AL-1048', disease: 'Cholera',        probability: 51, risk: 'Medium', window: '5–9 days',   status: 'Monitoring',    daysAgo: 3,
      evidenceFactors: [{ label: 'Recent disease activity', score: 48 }, { label: 'Regional activity', score: 60 }],
      aiExplanation: 'Water-borne disease reports are rising in Nashik. Cholera risk is moderately elevated — confirm water supply data and case reports.' },
  ],
  'Aurangabad Health Center': [
    { alertCode: 'AL-1050', disease: 'Dengue',        probability: 74, risk: 'High',   window: '6–12 days',  status: 'Needs review',  daysAgo: 3,
      evidenceFactors: [{ label: 'Recent disease activity', score: 85 }, { label: 'Hospital admissions', score: 72 }, { label: 'Regional activity', score: 68 }, { label: 'Humidity', score: 60 }],
      aiExplanation: 'Vector surveys confirm high Aedes mosquito density in Aurangabad. Combined with rising admissions and regional spread, dengue risk is high.' },
    { alertCode: 'AL-1052', disease: 'Influenza B',   probability: 29, risk: 'Low',    window: '7–14 days',  status: 'Normal',        daysAgo: 6,
      evidenceFactors: [{ label: 'Recent disease activity', score: 25 }],
      aiExplanation: 'Influenza B activity remains within normal range. No action required at this time.' },
  ],
  'Solapur District Hospital': [
    { alertCode: 'AL-1054', disease: 'Malaria',        probability: 62, risk: 'High',   window: '7–10 days',  status: 'Needs review',  daysAgo: 4,
      evidenceFactors: [{ label: 'Recent disease activity', score: 65 }, { label: 'Regional activity', score: 70 }, { label: 'Humidity', score: 58 }],
      aiExplanation: 'Malaria case counts in Solapur have exceeded the seasonal threshold. Submission data is delayed — immediate update recommended for model accuracy.' },
  ],
  'Kolhapur Community Clinic': [
    { alertCode: 'AL-1056', disease: 'Chikungunya',   probability: 48, risk: 'Medium', window: '7–14 days',  status: 'Monitoring',    daysAgo: 5,
      evidenceFactors: [{ label: 'Recent disease activity', score: 45 }, { label: 'Regional activity', score: 50 }],
      aiExplanation: 'Community alerts for chikungunya are in place across Kolhapur. Hospital admissions are within expected seasonal range.' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGIONAL RISK
// ─────────────────────────────────────────────────────────────────────────────
const regionalRiskDefs = [
  { region: 'Mumbai',      risk: 81, disease: 'Dengue',        note: 'Outbreak potential remains elevated in coastal wards.',              rainfall: 72, humidity: 80 },
  { region: 'Thane',       risk: 64, disease: 'Chikungunya',   note: 'Monitor vector control and hospital admissions.',                   rainfall: 60, humidity: 68 },
  { region: 'Navi Mumbai', risk: 58, disease: 'Leptospirosis', note: 'Heavy rainfall has raised contamination risk.',                     rainfall: 85, humidity: 75 },
  { region: 'Pune',        risk: 24, disease: 'Influenza A',   note: 'Seasonal cases are stable with no major spikes.',                   rainfall: 30, humidity: 40 },
  { region: 'Nashik',      risk: 12, disease: 'Cholera',       note: 'Water-borne illness reports are increasing slightly.',              rainfall: 20, humidity: 35 },
  { region: 'Aurangabad',  risk: 72, disease: 'Dengue',        note: 'Vector surveys indicate rising transmission.',                      rainfall: 65, humidity: 70 },
  { region: 'Solapur',     risk: 55, disease: 'Malaria',       note: 'Surveillance teams are tracking new cases.',                       rainfall: 50, humidity: 58 },
  { region: 'Kolhapur',    risk: 38, disease: 'Chikungunya',   note: 'Community alerts are in place.',                                   rainfall: 42, humidity: 48 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Pulse Health — database seeder\n');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓  Connected to MongoDB\n');

  // ── Drop all collections ──────────────────────────────────────────────────
  console.log('🗑  Clearing existing data…');
  await Promise.all([
    drop(Hospital), drop(Admin), drop(Alert),
    drop(SurveillanceSubmission), drop(NotificationUser),
    drop(RegionalRisk), drop(RiskSnapshot), drop(Notification),
  ]);

  // ── 1. Hospitals ─────────────────────────────────────────────────────────
  console.log('\n🏥  Seeding hospitals…');
  const hospitals = await Hospital.insertMany(
    hospitalDefs.map(h => ({
      name: h.name, region: h.region, address: h.address, email: h.email,
      password: hash('Hospital@123'),
      completeness: h.completeness, status: h.status, lastActivity: h.lastActivity,
      lastLogin: hoursAgo(h.hoursAgo),
    }))
  );
  const byName = Object.fromEntries(hospitals.map(h => [h.name, h]));
  console.log(`  ✓ ${hospitals.length} hospitals inserted`);
  console.log('  Credentials for all hospitals → password: Hospital@123');

  // ── 2. Admin ─────────────────────────────────────────────────────────────
  console.log('\n🛡  Seeding admin…');
  await Admin.create({
    name: 'Network Admin',
    email: 'admin@pulsehealth.org',
    password: hash('Admin@123'),
    role: 'superadmin',
    permissions: {
      viewAllHospitals: true, manageOrganizations: true,
      viewAllAlerts: true, viewRegionalData: true,
      manageUsers: true, manageAdmins: true,
    },
    isActive: true, lastLogin: hoursAgo(0.5),
  });
  console.log('  ✓ 1 admin inserted');
  console.log('  email: admin@pulsehealth.org  |  password: Admin@123');

  // ── 3. Alerts ─────────────────────────────────────────────────────────────
  console.log('\n🚨  Seeding alerts…');
  const alertDocs = [];
  for (const [hospName, defs] of Object.entries(alertDefs)) {
    const hospital = byName[hospName];
    if (!hospital) continue;
    for (const def of defs) {
      alertDocs.push({
        alertCode: def.alertCode,
        hospitalId: hospital._id,
        disease: def.disease, probability: def.probability,
        risk: def.risk, window: def.window, status: def.status,
        detectedOn: daysAgo(def.daysAgo),
        evidenceFactors: def.evidenceFactors,
        aiExplanation: def.aiExplanation,
      });
    }
  }
  const alerts = await Alert.insertMany(alertDocs);
  console.log(`  ✓ ${alerts.length} alerts inserted`);

  // ── 4. Surveillance Submissions ───────────────────────────────────────────
  console.log('\n📋  Seeding surveillance submissions…');
  const diseases = ['Dengue', 'Leptospirosis', 'Chikungunya', 'Malaria', 'Influenza A', 'Cholera'];
  const submissionDocs = [];
  for (const hospital of hospitals) {
    for (let d = 0; d < 7; d++) {
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      const suspected = Math.floor(Math.random() * 30) + 1;
      const confirmed = Math.floor(suspected * (0.3 + Math.random() * 0.4));
      const tests     = Math.floor(suspected * (1.5 + Math.random()));
      submissionDocs.push({
        hospitalId: hospital._id,
        reportDate: daysAgo(d),
        disease,
        suspectedCases:  suspected,
        confirmedCases:  confirmed,
        admissions:      Math.floor(confirmed * 0.4),
        testsConducted:  tests,
        positiveTests:   Math.floor(tests * (0.1 + Math.random() * 0.3)),
        icuAdmissions:   Math.floor(confirmed * 0.1),
        bedOccupancy:    Math.floor(40 + Math.random() * 50),
        validationStatus: d === 0 ? 'Pending' : 'Good',
      });
    }
  }
  await SurveillanceSubmission.insertMany(submissionDocs);
  console.log(`  ✓ ${submissionDocs.length} submissions inserted (7 days × ${hospitals.length} hospitals)`);

  // ── 5. Notification Users ─────────────────────────────────────────────────
  console.log('\n👥  Seeding notification users…');
  const userDefs = [
    { name: 'Dr. Maya Deshpande',  role: 'Hospital Admin',       email: 'maya@stxaviergeneral.org',   hospital: 'St. Xavier General',       phone: '+91-9001000001' },
    { name: 'Dr. Aisha Khan',      role: 'Epidemiology Lead',     email: 'aisha@stxaviergeneral.org',  hospital: 'St. Xavier General',       phone: '+91-9001000002' },
    { name: 'Dr. Neha Singh',      role: 'Chief Medical Officer', email: 'neha@stxaviergeneral.org',   hospital: 'St. Xavier General',       phone: '+91-9001000003' },
    { name: 'Mr. Anand Patil',     role: 'Surveillance Lead',     email: 'anand@thanecivic.org',       hospital: 'Thane Civic Hospital',     phone: '+91-9001000004' },
    { name: 'Mr. Vikram Singh',    role: 'Data Analyst',          email: 'vikram@thanecivic.org',      hospital: 'Thane Civic Hospital',     phone: '+91-9001000005' },
    { name: 'Dr. Sanya Rao',       role: 'Clinical Director',     email: 'sanya@nmcarecenter.org',     hospital: 'Navi Mumbai Care Center',  phone: '+91-9001000006' },
    { name: 'Ms. Priya Sharma',    role: 'Public Relations',      email: 'priya@nmcarecenter.org',     hospital: 'Navi Mumbai Care Center',  phone: '+91-9001000007' },
    { name: 'Ms. Priya Nair',      role: 'Nurse Manager',         email: 'priya.nair@punemetro.org',   hospital: 'Pune Metro Health',        phone: '+91-9001000008' },
    { name: 'Dr. Rahul Mehta',     role: 'Infection Control',     email: 'rahul@punemetro.org',        hospital: 'Pune Metro Health',        phone: '+91-9001000009' },
    { name: 'Mr. Rohit Sharma',    role: 'Outbreak Response',     email: 'rohit@nashikregional.org',   hospital: 'Nashik Regional',         phone: '+91-9001000010' },
    { name: 'Ms. Ananya Patel',    role: 'Logistics Coordinator', email: 'ananya@aurangabadhealth.org',hospital: 'Aurangabad Health Center', phone: '+91-9001000011' },
    { name: 'Mr. Sameer Joshi',    role: 'Research Scientist',    email: 'sameer@kolhapurclinic.org',  hospital: 'Kolhapur Community Clinic',phone: '+91-9001000012' },
    { name: 'Ms. Leena Kulkarni',  role: 'Network Operations',    email: 'leena@pulsehealth.org',      hospital: null,                        phone: '+91-9001000013' },
    { name: 'Mr. Rohan Joshi',     role: 'Public Health Analyst', email: 'rohan@pulsehealth.org',      hospital: null,                        phone: '+91-9001000014' },
  ];
  const notifUsers = await NotificationUser.insertMany(
    userDefs.map(u => ({
      hospitalId:  u.hospital ? byName[u.hospital]?._id ?? null : null,
      name: u.name, email: u.email, role: u.role, phone: u.phone,
      notifyVia: ['email', 'sms'], isActive: true,
    }))
  );
  console.log(`  ✓ ${notifUsers.length} notification users inserted`);

  // ── 6. Regional Risk ──────────────────────────────────────────────────────
  console.log('\n🗺  Seeding regional risk…');
  await RegionalRisk.insertMany(
    regionalRiskDefs.map(r => ({ ...r, snapshotDate: daysAgo(0) }))
  );
  // Add 3 days of historical snapshots with slight variations
  for (let d = 1; d <= 3; d++) {
    await RegionalRisk.insertMany(
      regionalRiskDefs.map(r => ({
        ...r,
        risk: Math.max(5, Math.min(100, r.risk + Math.floor((Math.random() - 0.5) * 10))),
        snapshotDate: daysAgo(d),
      }))
    );
  }
  console.log(`  ✓ ${regionalRiskDefs.length * 4} regional risk snapshots inserted (4 days)`);

  // ── 7. Risk Snapshots ─────────────────────────────────────────────────────
  console.log('\n📈  Seeding risk snapshots…');
  const riskDocs = [];
  const baseRisk = {
    'St. Xavier General': 80, 'Thane Civic Hospital': 60, 'Navi Mumbai Care Center': 50,
    'Pune Metro Health': 24, 'Nashik Regional': 51, 'Aurangabad Health Center': 74,
    'Solapur District Hospital': 62, 'Kolhapur Community Clinic': 48,
  };
  for (const hospital of hospitals) {
    const base = baseRisk[hospital.name] || 50;
    for (let d = 4; d >= 0; d--) {
      const delta = Math.floor((Math.random() - 0.5) * 14);
      const score = clamp(base - (d * 3) + delta, 5, 100);
      riskDocs.push({
        hospitalId: hospital._id,
        snapshotDate: daysAgo(d),
        riskScore: score,
        completeness: hospital.completeness,
        factors: {
          recentDiseaseActivity: clamp(score + 10, 0, 100),
          hospitalAdmissions:    clamp(score - 5, 0, 100),
          regionalActivity:      clamp(score - 15, 0, 100),
          rainfall:              Math.floor(40 + Math.random() * 40),
          humidity:              Math.floor(40 + Math.random() * 40),
        },
      });
    }
  }
  await RiskSnapshot.insertMany(riskDocs);
  console.log(`  ✓ ${riskDocs.length} risk snapshots inserted (5 days × ${hospitals.length} hospitals)`);

  // ── 8. Notifications ──────────────────────────────────────────────────────
  console.log('\n🔔  Seeding notifications…');
  const notifDocs = [];
  const messages = [
    'High-risk dengue alert detected — please review and confirm case counts.',
    'Surveillance submission overdue — please upload today\'s data.',
    'Regional risk score has increased above 70% — verify admission trends.',
    'Malaria signal elevated — confirm lab results and update status.',
    'Your data completeness score dropped below 70%. Submit today\'s report.',
  ];
  for (const user of notifUsers.slice(0, 10)) {
    if (!user.hospitalId) continue;
    const relevantAlerts = alerts.filter(a => String(a.hospitalId) === String(user.hospitalId));
    notifDocs.push({
      hospitalId: user.hospitalId,
      alertId: relevantAlerts[0]?._id ?? null,
      recipientId: user._id,
      recipientName: user.name, recipientEmail: user.email,
      message: messages[Math.floor(Math.random() * messages.length)],
      channel: 'email',
      status: 'sent',
      sentAt: hoursAgo(Math.floor(Math.random() * 24)),
      readAt: Math.random() > 0.4 ? hoursAgo(Math.floor(Math.random() * 12)) : null,
    });
  }
  await Notification.insertMany(notifDocs);
  console.log(`  ✓ ${notifDocs.length} notifications inserted`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n✅  Seeding complete!\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Admin');
  console.log('    email    → admin@pulsehealth.org');
  console.log('    password → Admin@123');
  console.log('');
  console.log('  Hospitals  (all use the same password)');
  console.log('    password → Hospital@123');
  hospitalDefs.forEach(h => console.log(`    ${h.email}`));
  console.log('═══════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
