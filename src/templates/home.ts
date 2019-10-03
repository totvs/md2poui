export const home = () => `
import { Component, OnInit } from '@angular/core';
import { PoMenuItem } from '@portinari/portinari-ui';

import { {{moduleClassName}}Service } from './{{moduleName}}.service';

@Component({
  selector: 'app-{{moduleName}}-home',
  templateUrl: './{{moduleName}}-home.component.html',
  styles: []
})
export class {{moduleClassName}}HomeComponent implements OnInit {
  public menus: PoMenuItem[] = [];

  constructor(private {{moduleName}}Service: {{moduleClassName}}Service) {
    this.menus = this.{{moduleName}}Service.getMenuItems();
  }

  ngOnInit() {}
}
`;