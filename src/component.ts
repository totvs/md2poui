import * as path from 'path';

import { globals, Transform } from './helpers';

/**
 * Informações do componente que será criado a partir da conversão do arquivo
 * `markdown`.
 *
 * @param file Caminho completo do arquivo `markdown` que será convertido.
 * @param delimiter Delimitador que será utilizado nos _templates_.
 */
export class Component {
  private file: string;
  private delimiter: string;
  private path: string;
  private name: string;
  private className: string;
  private title: string;

  constructor(file: string, delimiter = ',') {
    this.file = file;
    this.delimiter = delimiter;

    // Ajusta o caminho do componente conforme parâmetro "flatDirs".
    // Exemplo:
    //  true  - zoo/zebra
    //  false - zoo/animals/zebra
    let dirname = path.dirname(path.relative(globals.args.srcPath, file));

    // Valida se a pasta do componente inicia com um número e o remove. O
    // número no ínicio do nome da pasta serve para indicar a ordem de criação
    // dos componentes.
    if (dirname.match(/\d.-/)) {
      const split = dirname.split(path.sep).map((s) => s.replace(/^\d.-/, ''));
      dirname = split.join(path.sep);
    }

    if (globals.args.options.flatDirs) {
      this.path = dirname.split(path.sep).pop();
    } else {
      this.path = dirname.replace(/\\/g, '/');
    }

    this.name = path.basename(path.join(globals.args.srcPath, this.path)).toLowerCase();
    this.className = Transform.pascalCase(this.name);
  }

  public getFile(): string {
    return this.file;
  }

  public getDelimiter(): string {
    return this.delimiter;
  }

  public getPath(): string {
    return this.path;
  }

  public getName(): string {
    return this.name;
  }

  public getClassName(): string {
    return this.className;
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public getTitle(): string {
    return this.title;
  }
}
