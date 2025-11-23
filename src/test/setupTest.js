// src/test/setupTests.js
import matchers from '@testing-library/jasmine-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

beforeEach(() => {
  jasmine.getEnv().addMatchers(matchers.default);
});

