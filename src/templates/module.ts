export const module = `import { NgModule } from '@angular/core';
import { ThfModule } from '@totvs/thf-ui';

import { {{moduleClassName}}RoutingModule } from './{{moduleName}}-routing.module';
import { {{moduleClassName}}Service } from './{{moduleName}}.service';

{{#components}}
import { {{className}}Component } from './{{&path}}/{{name}}.component';
{{/components}}

@NgModule({
  declarations: [
    {{#components}}
    {{className}}Component{{delimiter}}
    {{/components}}
  ],
  imports: [ThfModule, {{moduleClassName}}RoutingModule],
  providers: [{{moduleClassName}}Service]
})
export class {{moduleClassName}}Module {}`;
