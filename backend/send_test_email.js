require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Hospital = require('./models/Hospital');

async function main(){
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const hospital = await Hospital.findOne();
  if (!hospital) {
    console.error('No hospital found in DB');
    process.exit(1);
  }
  console.log('Found hospital:', hospital.name, hospital.email);

  // Create test account
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: 'Pulse Health <no-reply@example.com>',
    to: hospital.email,
    subject: 'Test Alert from Pulse Health',
    text: 'This is a test alert email sent via Ethereal. If you see this, email sending works from the backend.',
  });

  console.log('Message sent. Preview URL:', nodemailer.getTestMessageUrl(info));
  await mongoose.disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
