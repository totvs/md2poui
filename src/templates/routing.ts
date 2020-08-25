export const routing = () => `import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

{{#home}}
import { {{moduleClassName}}HomeComponent } from './{{moduleName}}-home.component';
{{/home}}

{{#components}}
import { {{className}}Component } from './{{&path}}/{{name}}.component';
{{/components}}

const routes: Routes = [
  {{#home}}
  {
    path: '',
    component: {{moduleClassName}}HomeComponent,
    children: [
      {{#components}}
      {
        path: '{{name}}',
        component: {{className}}Component
      },
      {{/components}}
      {
        path: '**',
        redirectTo: '{{components.0.name}}'
      }
    ]
  },
  {{/home}}
  {{^home}}
  {{#components}}
  {
    path: '{{name}}',
    component: {{className}}Component
  },
  {{/components}}
  {
    path: '**',
    redirectTo: '{{components.0.name}}'
  }
  {{/home}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class {{moduleClassName}}RoutingModule {}
`;
