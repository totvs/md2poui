import { globals } from '../helpers';

export const module = () => {
  return `import { NgModule } from '@angular/core';
${getModuleImport()};

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
  imports: [${getModuleClass()}, {{moduleClassName}}RoutingModule],
  providers: [{{moduleClassName}}Service]
})
export class {{moduleClassName}}Module {}`;
};

function getModuleImport(): string {
  let module: string;

  if (globals.args.options.portinariUi) {
    module = `import { PoModule } from '@portinari/portinari-ui'`;
  } else {
    module = `import { ThfModule } from '@totvs/thf-ui'`;
  }

  return module;
}

function getModuleClass(): string {
  return globals.args.options.portinariUi ? 'PoModule' : 'ThfModule';
}
