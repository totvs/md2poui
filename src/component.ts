import * as path from 'path';

import { Transform } from './helpers';
import { Options } from './options';

/**
 * Classe com as informações do componente que será criado a partir da
 * conversão do arquivo `markdown`.
 *
 * @param srcDir Diretório raiz de busca dos arquivos `markdown`.
 * @param file Caminho completo do arquivo `markdown` que será convertido.
 * @param delimiter Delimitador que será utilizado nos _templates_.
 * @param options Opções customizadas de renderização e conversão dos componentes.
 */
export class Component {
  private file: string;
  private delimiter: string;
  private path: string;
  private name: string;
  private className: string;
  private title: string;

  constructor(srcDir: string, file: string, delimiter = ',', options: Options) {
    this.file = file;
    this.delimiter = delimiter;

    // Ajusta o caminho do componente conforme parâmetro "flatDirs".
    // Exemplo:
    //  true  - zoo/animals/zebra/
    //  false - zebra/
    if (options.flatDirs) {
      this.path = path.dirname(path.relative(srcDir, file)).split(path.sep).pop();
    } else {
      this.path = path.dirname(path.relative(srcDir, file)).replace(/\\/g, '/');
    }

    this.name = path.basename(path.join(srcDir, this.path)).toLowerCase();
    this.className = Transform.pascalCase(this.name);
  }

  public setfile(file: string) {
    this.file = file;
  }

  public getFile(): string {
    return this.file;
  }

  public setDelimiter(delimiter: string) {
    this.delimiter = delimiter;
  }

  public getDelimiter(): string {
    return this.delimiter;
  }

  public setPath(path: string) {
    this.path = path;
  }

  public getPath(): string {
    return this.path;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setClassName(className: string) {
    this.className = className;
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
