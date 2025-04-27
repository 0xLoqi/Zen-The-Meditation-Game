module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^expo-device$': '<rootDir>/__mocks__/expo-device.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.js',
    '^firebase.*$': '<rootDir>/__mocks__/firebase.js',
  },
}; 