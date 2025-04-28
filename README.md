# Zen - The Meditation Game 🧘‍♂️

A beautiful and interactive meditation app that gamifies the practice of mindfulness and meditation. Built with React Native and Expo, this app combines peaceful meditation with engaging gameplay elements to make mindfulness practice more enjoyable and consistent.

## Features 🌟

- **Guided Meditations**: Various meditation types and durations
- **Interactive Character**: Customize your meditation companion
- **Daily Check-ins**: Track your mindfulness journey
- **Guru Mode**: Advanced meditation features
- **Beautiful UI**: Calming animations and transitions
- **Cross-platform**: Works on iOS and Android

## Project Roadmap 🗺️

### Current Focus
- [🟡] Complete onboarding flow with Glowbag animations (just needs polish)
- [ ] Implement basic meditation timer with animations
- [ ] Add user profile and progress tracking
- [ ] Develop reward system and cosmetic items
- [ ] Develop costmetics with ChatGPT using already generated cosmetics as style guide
- [ ] Local device storage

### Future Features
- [ ] The whole backend system with updates
- [ ] Daily challenges and streaks
- [ ] Social features and friend system
- [ ] Achievement system
- [ ] Custom meditation backgrounds
- [ ] Sound pack system
- [ ] Integration with health apps

### Known Issues
- Mobile navigation needs refinement
- Animation performance on lower-end devices
- Authentication flow edge cases

## Tech Stack 💻

- React Native
- Expo
- TypeScript
- Firebase Authentication
- React Navigation
- Reanimated for smooth animations
- Zustand for state management
- Expo Haptics for tactile feedback

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
# or
npx expo start
```

4. Follow the Expo CLI instructions to run on your desired platform (iOS/Android)

## Project Structure 📁

- `/assets` - Images, fonts, and other static assets
- `/src`
  - `/components` - Reusable UI components
  - `/constants` - Theme, colors, and other constants
  - `/types` - TypeScript type definitions
  - `/screens` - Main app screens
  - `/navigation` - Navigation configuration
  - `/hooks` - Custom React hooks
  - `/utils` - Helper functions and utilities

## Scripts 📝

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## Contributing 🤝

We welcome contributions! Here's how you can help:

### Getting Started as a Contributor

1. Fork the repository
2. Create a new branch for your feature: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style and naming conventions
- Write clear commit messages
- Add comments for complex logic
- Update documentation for significant changes
- Test on both iOS and Android when possible

### Pull Request Process

1. Fill out the PR template completely
2. Link any related issues
3. Include screenshots/videos for UI changes
4. Ensure all tests pass
5. Request review from maintainers

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details. 