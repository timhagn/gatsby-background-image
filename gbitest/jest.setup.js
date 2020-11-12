// jest.setup.js

// add some helpful assertions
import '@testing-library/jest-dom/extend-expect';

// this is basically: afterEach(cleanup)
// import '@testing-library/react/cleanup-after-each'

// update from @babel/runtime with babel 7.4.4
// https://babeljs.io/blog/2019/03/19/7.4.0.html
import 'core-js/stable';

jest.mock('short-uuid');

// Mock WebPack specialChars Option.
beforeEach(() => {
  global.__GBI_SPECIAL_CHARS__ = `:/`;
});
