const admin = require('firebase-admin');

// Load Firebase service account key
const serviceAccount = require('./firebase_service_acct.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Define valid cosmetic patches for leaderboard users
const updates = [
  {
    uid: 'jimmy-leaderboard',
    streak: 25, // high streak
    equipped: {
      outfit: 'ember_robe',
      headgear: 'royal_crown',
      aura: 'focus_spiral',
      face: 'wink',
      accessory: 'whorled_staff',
      companion: 'cozy_owl',
    },
  },
  {
    uid: 'sean-leaderboard',
    streak: 5, // lower streak
    equipped: {
      outfit: 'nap_hoodie',
      headgear: 'warm_beanie',
      aura: 'auric_bloom',
      face: 'angry',
      accessory: 'satchel_of_stillness',
      companion: 'busy_bee',
    },
  },
];

// Apply updates to Firestore
async function patchLeaderboardFriends() {
  for (const update of updates) {
    const { uid, streak, equipped } = update;
    try {
      await db.collection('users').doc(uid).set({
        streak,
        cosmetics: { equipped }
      }, { merge: true });
      console.log(`Patched ${uid}: streak=${streak}, cosmetics=${JSON.stringify(equipped)}`);
    } catch (error) {
      console.error(`Failed to patch ${uid}:`, error);
    }
  }
  process.exit(0);
}

patchLeaderboardFriends(); 