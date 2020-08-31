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
  createHelpers: true,
  moduleName: 'helpers',
  parentRoutePath: '',
  home: false,
  copyExternalFiles: false,
  imports: [{ name: 'SharedModule', path: './shared' }],
};

describe('Helpers', () => {
  const srcPath = 'test/markdown/helpers';
  const destDir = 'test/result';

  const title = 'MD2POUI HELPERS';
  const name = 'helpers';
  const className = 'Helpers';
  const path = '.';
  const renderOptions = { components: [{ name, className, path }], moduleName: name, moduleClassName: className, imports: options.imports };
  const menuItems = [{ label: title, link: name, menuItems: [] }];

  let module;
  let service;

  before(() => {
    md2poui(srcPath, destDir, options);
    module = fs.readFileSync(`${destDir}/${name}.module.ts`, 'utf-8');
    service = fs.readFileSync(`${destDir}/${name}.service.ts`, 'utf-8');
  });

  it('should have created a module file', () => {
    assert.ok(module);
  });

  it('should have created the module according to the template', () => {
    const rendered = mustache.render(templates.module(), renderOptions);
    assert.equal(module, rendered);
  });

  it('should the module have the component import', () => {
    assert.ok(module.indexOf(`import { ${className}Component } from './${path}/${name}.component';`) !== -1);
  });

  it('should the module have the extra imports', () => {
    assert.ok(module.indexOf(`import { ${options.imports[0].name} } from '${options.imports[0].path}';`) !== -1);
  });

  it('should have created a service file', () => {
    assert.ok(service);
  });

  it('should have created the service according to the template', () => {
    const rendered = mustache.render(templates.service(), { ...renderOptions, menuItems }, { menuItem: templates.menuItem() });
    assert.equal(service, rendered);
  });

  it('should the service have the `getMenuItems` method', () => {
    assert.ok(service.indexOf('public getMenuItems(): PoMenuItem[]') !== -1);
  });

  it('should the method `getMenuItems` from the service return the menu items', () => {
    const getMenuItems = `return [
      {
        label: '${title}',
        link: '${name}',
        subItems: []
      },
    ]`;
    assert.ok(service.indexOf(getMenuItems) !== -1);
  });
});
