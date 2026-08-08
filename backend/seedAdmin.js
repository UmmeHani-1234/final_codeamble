const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
    permissions: {
      viewAllHospitals: { type: Boolean, default: true },
      manageOrganizations: { type: Boolean, default: true },
      viewAllAlerts: { type: Boolean, default: true },
      viewRegionalData: { type: Boolean, default: true },
      manageUsers: { type: Boolean, default: false },
      manageAdmins: { type: Boolean, default: false },
    },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB:', process.env.MONGODB_URI.split('@')[1]);

    // Remove existing admin with same email (clean re-seed)
    await Admin.deleteOne({ email: 'admin@shadowdoctor.ai' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@2025', salt);

    const admin = await Admin.create({
      name: 'Network Admin',
      email: 'admin@shadowdoctor.ai',
      password: hashedPassword,
      role: 'superadmin',
      permissions: {
        viewAllHospitals: true,
        manageOrganizations: true,
        viewAllAlerts: true,
        viewRegionalData: true,
        manageUsers: true,
        manageAdmins: true,
      },
      isActive: true,
    });

    console.log('\n🎉 Admin user created successfully!');
    console.log('─────────────────────────────────────');
    console.log('  Name    :', admin.name);
    console.log('  Email   :', admin.email);
    console.log('  Role    :', admin.role);
    console.log('  Password: Admin@2025');
    console.log('─────────────────────────────────────');
    console.log('  Login at: POST /api/admin/auth/login');
    console.log('─────────────────────────────────────\n');
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAdmin();
