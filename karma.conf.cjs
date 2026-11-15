// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      // El archivo de preparacion registra los matchers de jasmine-dom.
      // Su nombre real es setupTest.js (en singular): antes se referenciaba
      // "setupTests.js", que no existe, de modo que el archivo nunca se
      // cargaba y los matchers adicionales no estaban disponibles.
      'src/test/setupTest.js',
      'src/**/*.spec.jsx',
      // Servir las imágenes como archivos estáticos
      { pattern: 'public/img/**/*', watched: false, included: false, served: true },
    ],
    proxies: {
      '/img/': '/base/public/img/', // proxy para que /img/... apunte a la carpeta real
    },
    preprocessors: {
      'src/test/setupTest.js': ['webpack'],
      'src/test/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/i,
            type: 'asset/resource', // permite importar imágenes en tests
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],

    // Se generan tres formatos de reporte:
    //   - html        : reporte legible para la revision.
    //   - json-summary: formato que consume el gate de cobertura del pipeline.
    //   - text-summary: resumen por consola, util en los logs del runner.
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'json-summary' },
        { type: 'text-summary' },
      ],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-html-reporter',
    ],
  });
};
