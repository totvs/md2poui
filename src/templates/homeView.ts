export const homeView = () => `
<div class="po-wrapper">
  <po-menu [p-menus]="menus" p-filter="true"></po-menu>
  <router-outlet></router-outlet>
</div>
`;
