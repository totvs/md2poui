import { globals } from '../helpers';

export const componentView = () => {
  let template: string;

  if (globals.args.options.portinariUi) {
    template = `<po-page-default p-title="{{title}}">{{&content}}</po-page-default>`;
  } else {
    template = `<thf-page-default t-title="{{title}}">{{&content}}</thf-page-default>`;
  }

  return template;
};
