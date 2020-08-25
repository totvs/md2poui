export const home = () => `import { Component, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';

import { {{moduleClassName}}Service } from './{{moduleName}}.service';

@Component({
  selector: 'app-{{moduleName}}-home',
  templateUrl: '{{moduleName}}-home.component.html'
})
export class {{moduleClassName}}HomeComponent implements OnInit {
  public menus: PoMenuItem[] = [];

  constructor(service: {{moduleClassName}}Service) {
    this.menus = service.getMenuItems();
  }

  ngOnInit() {}
}
`;
