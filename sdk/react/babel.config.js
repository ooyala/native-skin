module.exports = {
  plugins: [
    // The following plugin should go first to strip Flow types and prevent subsequent errors.
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-class-properties',
  ],
  presets: [
    'module:metro-react-native-babel-preset',
  ],
};
