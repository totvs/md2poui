const { before } = require('mocha');

const md2poui = require('../dist');
const templates = require('../dist/templates');

const options = defaultTestOptions();

describe('Templates', () => {
  before(() => {
    md2poui('test/markdown', 'test/result', options);
  });

  it('should have created `TS` file according to the template', () => {});
});

function defaultTestOptions() {
  return {
    home: false,
  };
}
