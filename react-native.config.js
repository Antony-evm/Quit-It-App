module.exports = {
  project: {
    ios: {},
    android: {}, // disable Android platform auto linking
  },
  assets: ['./src/assets/fonts/'], // stays the same
  // Enable fast refresh for better development experience
  commands: require('@react-native-community/cli').commands,
};
