const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add a rule to handle reanimated
  config.module.rules.push({
    test: /react-native-reanimated/,
    include: [
      path.resolve(__dirname, 'node_modules/react-native-reanimated/src/**/*'),
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['react-native-reanimated/plugin'],
      },
    },
  });

  return config;
}; 