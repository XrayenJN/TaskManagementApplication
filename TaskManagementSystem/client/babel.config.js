module.exports = { 
  presets: [
    'module:metro-react-native-babel-preset',
    {
      targets: {
        node: 'current'
      }
    },
    '@babel/preset-env', 
    {
      targets: {
        node: 'current'
      }
    },
    '@babel/preset-react-native',
    {
      targets: {
        node: 'current'
      }
    }
  ]
};