import { Options } from '../options';

/**
 * Informações dos argumentos passadas para a execução da conversão dos
 * arquivos `markdown`.
 */
export class Args {
  /**
   * Caminho de busca dos arquivos `markdown`.
   */
  srcPath: string;

  /**
   * Diretório de destino onde serão criados os componentes `Angular`.
   */
  destDir: string;

  /**
   * Configurações customizadas de conversão.
   */
  options: Options;

  constructor(srcPath: string, destDir: string, options: Options) {
    this.srcPath = srcPath;
    this.destDir = destDir;
    this.options = options;
  }

  public getSrcPath(): string {
    return this.srcPath;
  }

  public getDestDir(): string {
    return this.destDir;
  }

  public getOptions(): Options {
    return this.options;
  }
}
