export const menuItem = () => `{{#menuItems}}
{
  label: '{{label}}',
  link: '{{&link}}',
  subItems: [{{>menuItem}}]
},
{{/menuItems}}`;
