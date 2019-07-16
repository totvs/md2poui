import { shim as flatMapShim } from 'array.prototype.flatmap';
import * as path from 'path';

import { Converter } from './converter';
import { Args, globals } from './helpers';
import { defaultOptions, Options } from './options';

// Adiciona o suporte ao "flatMap" para objetos do tipo Array.
flatMapShim();

/**
 * Executa a criação dos componentes `Angular` gerados a partir dos arquivos
 * `markdown` encontrados no diretório de origem.
 *
 * @param srcPath Caminho de origem de busca dos arquivos `markdown`.
 * @param destDir Diretório de destino de criação dos componentes `Angular`.
 * @param options Configurações customizadas de conversão.
 */
export = (srcPath: string, destDir: string, options?: Options) => {
  options = adjustOptions(srcPath, options);
  globals.args = new Args(srcPath, destDir, options);
  return new Converter().execute();
};

/**
 * Ajusta as configurações de conversão informadas com as configurações
 * padrões.
 *
 * @param srcPath Caminho de origem de busca dos arquivos `markdown`.
 * @param options Configurações customizadas de conversão.
 *
 * @returns Configurações de conversão ajustadas.
 */
function adjustOptions(srcPath: string, options: Options): Options {
  options = Object.assign({}, defaultOptions, options);
  options.exclusions = options.exclusions.map((exclusion) => path.resolve(srcPath, exclusion));
  return options;
}
