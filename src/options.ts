import { MarkedOptions } from 'marked';

import { ThfRenderer } from './renderer';

export interface Options extends MarkedOptions {
  /**
   * @override
   */
  renderer?: ThfRenderer;

  /**
   * Lista dos arquivos que não serão considerados na conversão.
   */
  exclusions?: string[];

  /**
   * Verdadeiro para criar todos as pastas dos componentes na pasta raíz de
   * destino.
   *
   * Valor padrão: `true`.
   */
  flatDirs?: boolean;

  /**
   * Verdadeiro para criar os arquivos auxiliares `module`, `routing` e
   * `service`.
   *
   * Valor padrão: `true`.
   */
  createHelpers?: boolean;

  /**
   * Nome do módulo `Angular` que será criado para agrupar os componentes
   * gerados.
   *
   * Valor padrão: `'wiki'`.
   */
  moduleName?: string;

  /**
   * Verdadeiro para copiar arquivos externos referenciados nos arquivos
   * `markdown`.
   *
   * Valor padrão: `true`.
   */
  copyExternalFiles?: boolean;

  /**
   * Pasta onde serão copiados os arquivos externos encontrados nos
   * arquivos `markdown`.
   *
   * Valor padrão: `'assets'`.
   */
  resourceFolderName?: string;

  /**
   * Caminho que será utilizado no `HTML` convertido para substituir os
   * caminhos originais encontrado nos arquivos `markdown`.
   *
   * Valor padrão: `'assets'`.
   */
  resourcePathName?: string;
}

export const defaultOptions: Options = {
  exclusions: [],
  flatDirs: true,
  createHelpers: true,
  moduleName: 'wiki',
  copyExternalFiles: true,
  resourceFolderName: 'assets',
  resourcePathName: 'assets'
};
