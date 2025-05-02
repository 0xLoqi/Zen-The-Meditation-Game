const admin = require('firebase-admin');
const serviceAccount = require('./firebase_service_acct.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Valid cosmetic IDs from your cosmetics.json
const validCosmetics = {
  outfitId: ['ember_robe', 'prism_cloak', 'nap_hoodie'],
  headgearId: ['warm_beanie', 'royal_crown', 'leaf_crown'],
  auraId: ['auric_bloom', 'focus_spiral', 'verdant_halo'],
  accessoryId: ['whorled_staff', 'you_blink_first_mask', 'true_stoic_mask', 'satchel_of_stillness'],
  companionId: ['cozy_owl', 'busy_bee', 'baby_echo', 'messenger_sprite'],
  faceId: ['angry', 'shook', 'wink', 'worried', 'sad'],
};

// Helper to pick a random ID from each category
function randomCosmetics() {
  const obj = {};
  for (const key in validCosmetics) {
    const arr = validCosmetics[key];
    obj[key] = arr[Math.floor(Math.random() * arr.length)];
  }
  return obj;
}

const users = [
  { uid: 'jimmy-leaderboard', name: 'Jimmy' },
  { uid: 'sean-leaderboard', name: 'Sean' },
];

async function patch() {
  for (const user of users) {
    const equipped = randomCosmetics();
    await db.collection('users').doc(user.uid).set({
      cosmetics: { equipped }
    }, { merge: true });
    console.log(`Patched ${user.name} with:`, equipped);
  }
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});