// La instrumentacion de cobertura la aplica babel-plugin-istanbul solo
// cuando se ejecuta la suite de pruebas (env test / NODE_ENV=test).
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
};
