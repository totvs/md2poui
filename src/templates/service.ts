export const service = () => `import { Injectable } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';

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
