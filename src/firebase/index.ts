// Export Firebase configuration and services
export * from './config';
export * from './auth';
export * from './user';
export * from './meditation';
export * from './googleAuth';

// Export a default initialization function
import { app } from './config';

export default {
  initialize: () => {
    // Firebase is already initialized in config.ts
    return app;
  }
};