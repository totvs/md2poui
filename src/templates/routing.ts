export const routing = `import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

{{#components}}
import { {{className}}Component } from './{{&path}}/{{name}}.component';
{{/components}}

const routes: Routes = [
  {{#components}}
  {
    path: '{{name}}',
    component: {{className}}Component
  }{{delimiter}}
  {{/components}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class {{moduleClassName}}RoutingModule {}`;
