// This is a mock Firebase configuration file
// We're not actually using Firebase here, but providing mock objects

// Create a simple mock Firebase app
const app = {
  name: 'zen-meditation-app-mock',
  options: {},
};

// Create a mock auth object
const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    // Return an unsubscribe function
    return () => {};
  },
};

// Create a mock firestore object
const firestore = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({
        exists: false,
        data: () => ({}),
      }),
      set: async () => ({}),
      update: async () => ({}),
    }),
  }),
};

// Export Firebase mock objects
export { app, auth, firestore };

// Log to show our mock Firebase has been initialized
console.log('Mock Firebase initialized successfully');