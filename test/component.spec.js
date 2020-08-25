const fs = require('fs');
const { before } = require('mocha');
const assert = require('assert');
const mustache = require('mustache');

const md2poui = require('../dist');
const templates = require('../dist/templates');

const options = {
  exclusions: [],
  flatDirs: true,
  recursive: false,
  createHelpers: false,
  home: false,
  copyExternalFiles: false,
};

describe('Component', () => {
  const srcPath = 'test/markdown/component';
  const destDir = 'test/result';

  const name = 'component';
  const className = 'Component';
  const title = 'MD2POUI COMPONENT';

  before(() => {
    md2poui(srcPath, destDir, options);
  });

  it('should have created component `TS` file according to the template', () => {
    const rendered = mustache.render(templates.component(), { component: { name, className } });
    const content = fs.readFileSync(`${destDir}/${name}.component.ts`, 'utf-8');
    assert.equal(content, rendered);
  });

  it('should have created component `HTML` file according to the template', () => {
    const rendered = mustache.render(templates.componentView(), { title, content: '' });
    const content = fs.readFileSync(`${destDir}/${name}.component.html`, 'utf-8');
    assert.equal(content, rendered);
  });
});
