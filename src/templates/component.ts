export const component = `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-{{component.name}}',
  templateUrl: './{{component.name}}.component.html',
  styles: []
})
export class {{component.className}}Component implements OnInit {
  constructor() {}
  ngOnInit() {}
}`;
