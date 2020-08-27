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
    {{#imports}}
    {{name}},
    {{/imports}}
    {{#home}}
    {{moduleClassName}}HomeComponent,
    {{/home}}
    {{#components}}
    {{className}}Component{{delimiter}}
    {{/components}}
  ],
  imports: [PoModule, {{moduleClassName}}RoutingModule],
  providers: [{{moduleClassName}}Service]
})
export class {{moduleClassName}}Module {}
`;
