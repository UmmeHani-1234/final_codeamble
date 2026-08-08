require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('./models/Hospital');
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hospital = await Hospital.findOne({ email: 'admin@stxaviergeneral.org' });
    console.log('hospital found', !!hospital);
    if (hospital) {
      const match = await bcrypt.compare('Hospital@123', hospital.password);
      console.log('bcrypt match', match);
      const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log('token', token.slice(0, 20));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
