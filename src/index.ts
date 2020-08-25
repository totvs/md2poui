import { shim as flatMapShim } from 'array.prototype.flatmap';
import defaults from 'defaults';
import * as fs from 'fs';
import mustache from 'mustache';
import * as path from 'path';

import { Converter } from './converter';
import { defaultOptions, Options } from './options';

// Adiciona o suporte ao "flatMap" para objetos do tipo Array.
flatMapShim();

/**
 * Converte o conteúdo `Markdown` para `PO-UI`.
 *
 * @param content conteúdo `markdown`
 * @returns conteúdo convertido para `PO-UI`
 */
function md2poui(content: string): string;

/**
 * Converte arquivos `markdown` encontrados no diretório de origem para
 * componentes `Angular` utilizando a biblioteca `PO-UI`.
 *
 * @param srcPath caminho de origem de busca dos arquivos `markdown`
 * @param destDir diretório de destino de criação dos componentes `Angular`
 * @param options configurações customizadas de conversão
 */
function md2poui(srcPath: string, destDir: string, options?: Options): void;

function md2poui(srcPath: string, destDir?: string, options?: Options): string | void {
  if (!isFileOrDirectory(srcPath)) return new Converter().convert(srcPath);

  srcPath = path.resolve(srcPath);
  destDir = path.resolve(destDir);
  options = adjustOptions(srcPath, options);
  new Converter(srcPath, destDir, options).execute();
}

export = md2poui;

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
  options = defaults(options, defaultOptions);
  options.exclusions = options.exclusions.map((exclusion) => path.resolve(srcPath, exclusion));

  // Ajusta nomes gerados dinâmicamente.
  const adjust = JSON.stringify(options);
  options = JSON.parse(mustache.render(adjust, options));

  return options;
}

function isFileOrDirectory(pathname: string) {
  try {
    const stat = fs.lstatSync(pathname);
    return stat.isFile() || stat.isDirectory();
  } catch (e) {
    return false;
  }
}
