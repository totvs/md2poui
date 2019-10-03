export const service = () => `
import { Injectable } from '@angular/core';
import { PoMenuItem } from '@portinari/portinari-ui';

@Injectable({
  providedIn: 'root'
})
export class {{moduleClassName}}Service {
  constructor() {}

  public getMenuItems(): PoMenuItem[] {
    return {{&menuItems}};
  }
}
`;
