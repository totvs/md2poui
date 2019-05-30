export const service = `import { Injectable } from '@angular/core';
import { ThfMenuItem } from '@totvs/thf-ui';

@Injectable({
  providedIn: 'root'
})
export class {{moduleClassName}}Service {
  constructor() {}

  public get{{moduleClassName}}MenuItems(): ThfMenuItem[] {
    return [
      {{#components}}
      {
        label: '{{title}}',
        link: '{{moduleName}}/{{name}}'
      }{{delimiter}}
      {{/components}}
    ];
  }
}`;
