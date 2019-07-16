import { MarkedOptions } from 'marked';

import { ThfRenderer } from './renderer';

export interface Options extends MarkedOptions {
  /**
   * @override
   */
  renderer?: ThfRenderer;

  /**
   * Verdadeiro para criar os componentes utilizando visual do **PortinariUi**.
   *
   * Valor padrão: `false`.
   */
  portinariUi?: boolean;

  /**
   * Lista dos arquivos ou pastas que não serão considerados na conversão.
   */
  exclusions?: string[];

  /**
   * Nome da classe `CSS` que será utilizada nos trechos de códigos de exemplo.
   *
   * Obs: independente desta configuração, a classe contendo o nome da
   * linguagem sempre é inserida.
   *
   * Valor padrão: `'highlight'`.
   */
  highlightClassName?: string;

  /**
   * Verdadeiro para criar as pastas de componentes na raíz da pasta destino.
   *
   * Valor padrão: `true`.
   */
  flatDirs?: boolean;

  /**
   * Verdadeiro para ler recursivamente as pastas abaixo da pasta de origem.
   *
   * Valor padrão: `true`.
   */
  recursive?: boolean;

  /**
   * Verdadeiro para criar os arquivos auxiliares de módulo, rotas e serviço.
   *
   * Valor padrão: `true`.
   */
  createHelpers?: boolean;

  /**
   * Nome do módulo `Angular` que será criado para agrupar os componentes.
   *
   * Valor padrão: `'docs'`.
   */
  moduleName?: string;

  /**
   * Caminho da rota pai que será utilizado para as rotas dos componentes.
   * 
   * Valor padrão: `docs`.
   */
  parentRoutePath?: string;

  /**
   * Verdadeiro para copiar os arquivos externos.
   *
   * Valor padrão: `true`.
   */
  copyExternalFiles?: boolean;

  /**
   * Nome da pasta para armazenamento dos arquivos externos.
   *
   * Valor padrão: `'assets'`.
   */
  resourceFolderName?: string;

  /**
   * Caminho que será utilizado para referenciar os arquivos externos.
   *
   * Valor padrão: `'assets'`.
   */
  resourcePathName?: string;
}

export const defaultOptions: Options = {
  portinariUi: false,
  exclusions: [],
  highlightClassName: 'highlight',
  flatDirs: true,
  recursive: true,
  createHelpers: true,
  moduleName: 'docs',
  parentRoutePath: 'docs',
  copyExternalFiles: true,
  resourceFolderName: 'assets',
  resourcePathName: 'app/docs/assets'
};
