// Load service account key
const serviceAccount = require('./firebase_service_acct.json'); 

const admin = require('firebase-admin');
const fs = require('fs');


// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Random cosmetics for demo
const randomCosmetics = () => ({
  outfit: ['default', 'zen_master', 'nature_lover'][Math.floor(Math.random() * 3)],
  headgear: ['none', 'lotus_hat', 'halo'][Math.floor(Math.random() * 3)],
  aura: ['none', 'blue_aura', 'gold_aura'][Math.floor(Math.random() * 3)],
  face: ['smile', 'serene', 'wink'][Math.floor(Math.random() * 3)],
  accessory: ['none', 'beads', 'fan'][Math.floor(Math.random() * 3)],
  companion: ['none', 'bird', 'cat'][Math.floor(Math.random() * 3)],
});

const users = [
  {
    uid: 'jimmy-leaderboard',
    name: 'Jimmy',
    xp: 1500,
    level: 7,
    cosmetics: { equipped: randomCosmetics() },
  },
  {
    uid: 'sean-leaderboard',
    name: 'Sean',
    xp: 1100,
    level: 5,
    cosmetics: { equipped: randomCosmetics() },
  },
];

async function seed() {
  for (const user of users) {
    await db.collection('users').doc(user.uid).set({
      name: user.name,
      xp: user.xp,
      level: user.level,
      cosmetics: user.cosmetics,
      // Add any other fields your app expects
    }, { merge: true });
    console.log(`Seeded user: ${user.name}`);
  }
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});