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
   */
  flatDirs?: boolean;

  /**
   * Nome do módulo `Angular` que será criado para agrupar os componentes
   * gerados. Exemplo: 'wiki'.
   */
  moduleName?: string;

  /**
   * Pasta onde serão copiados os arquivos externos encontrados nos
   * arquivos `markdown`. Exemplo: 'assets'.
   */
  resourceFolderName?: string;

  /**
   * Caminho que será utilizado no `HTML` convertido para substituir os
   * caminhos originais encontrado nos arquivos `markdown`.
   * Exemplo: 'wiki/assets'.
   */
  resourcePathName?: string;
}

export const defaultOptions: Options = {
  exclusions: [],
  flatDirs: true,
  moduleName: 'wiki',
  resourceFolderName: 'resources',
  resourcePathName: 'app/wiki/resources'
};
