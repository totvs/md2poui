import * as path from 'path';

import { Transform } from './helpers';
import { Options } from './options';

/**
 * Informações do componente que será criado a partir da conversão do arquivo
 * `markdown`.
 */
export class Component {
  private file: string;
  private delimiter: string;
  private path: string;
  private name: string;
  private className: string;
  private title: string;

  constructor(srcPath: string, file: string, options: Options, delimiter = ',') {
    this.file = file;
    this.delimiter = delimiter;

    let dirname = path.dirname(path.relative(srcPath, file));
    dirname = this.adjustDirname(dirname);

    // Ajusta o caminho do componente conforme parâmetro "flatDirs".
    // Exemplo:
    //  true  - zoo/zebra
    //  false - zoo/animals/zebra
    if (options.flatDirs) {
      this.path = dirname.split(path.sep).pop();
    } else {
      this.path = dirname.replace(/\\/g, '/');
    }

    this.name = path.basename(path.join(srcPath, this.path)).toLowerCase();
    this.name = this.adjustDirname(this.name);
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

  /**
   * Ajusta o diretório do componente - verifica se o mesmo inicia com um
   * número e o remove.
   *
   * O número no ínicio do nome da pasta serve para indicar a ordem de
   * criação dos componentes.
   *
   * @param path diretório do componente
   * @returns diretório do componente ajustado
   */
  private adjustDirname(dirname: string): string {
    if (dirname.match(/\d.-/)) return dirname.replace(/^\d.-/, '');
    return dirname;
  }
}
