export const module = () => `import { NgModule } from '@angular/core';
import { PoModule } from '@po-ui/ng-components';

import { {{moduleClassName}}RoutingModule } from './{{moduleName}}-routing.module';
import { {{moduleClassName}}Service } from './{{moduleName}}.service';

{{#imports}}
import { {{name}} } from '{{&path}}';
{{/imports}}
{{#home}}
import { {{moduleClassName}}HomeComponent } from './{{moduleName}}-home.component';
{{/home}}
{{#components}}
import { {{className}}Component } from './{{&path}}/{{name}}.component';
{{/components}}

@NgModule({
  declarations: [
    {{#home}}
    {{moduleClassName}}HomeComponent,
    {{/home}}
    {{#components}}
    {{className}}Component{{delimiter}}
    {{/components}}
  ],
  imports: [
    {{#imports}}
    {{name}},
    {{/imports}}
    PoModule,
    {{moduleClassName}}RoutingModule
  ]
})
export class {{moduleClassName}}Module {}
`;
