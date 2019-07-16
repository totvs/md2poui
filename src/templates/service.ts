import { globals } from '../helpers';

export const service = () => {
  return `import { Injectable } from '@angular/core';
${getMenuItemImport()};

@Injectable({
  providedIn: 'root'
})
export class {{moduleClassName}}Service {
  constructor() {}

  public getMenuItems(): ${getMenuItemClass()}[] {
    return {{&menuItems}};
  }
}`;
};

function getMenuItemImport() {
  let menuItem: string;

  if (globals.args.options.portinariUi) {
    menuItem = `import { PoMenuItem } from '@portinari/portinari-ui'`;
  } else {
    menuItem = `import { ThfMenuItem } from '@totvs/thf-ui'`;
  }

  return menuItem;
}

function getMenuItemClass() {
  return globals.args.options.portinariUi ? 'PoMenuItem' : 'ThfMenuItem';
}
