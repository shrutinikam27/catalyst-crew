require('dotenv').config();
const notifyService = require('./services/notifyService');

console.log("Authority Emails:", process.env.AUTHORITY_EMAILS);
console.log("Medical Emails:", process.env.VOLUNTEER_MEDICAL_EMAILS);
console.log("Fire Emails:", process.env.VOLUNTEER_FIRE_EMAILS);

const testSOS = async () => {
  const types = ['Medical', 'Fire', 'Crime', 'Accident'];
  console.log(`Sending ${types.length} SOS Test Emails...`);
  
  for (const type of types) {
    console.log(`\n➡️ Dispatching ${type} Emergency...`);
    await notifyService.notifySOS({
      emergencyType: type,
      location: { latitude: 18.5204, longitude: 73.8567 },
      userName: 'Citizen',
      notifyVolunteers: ['firebrigade', 'medical', 'crime']
    });
  }
  
  console.log("\n✅ Done! All 4 Emails should be sent.");
  process.exit(0);
};

testSOS();
