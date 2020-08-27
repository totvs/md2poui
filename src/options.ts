import { MarkedOptions } from 'marked';

import { PoRenderer } from './renderer';

export interface Options extends MarkedOptions {
  /**
   * @override
   */
  renderer?: PoRenderer;

  /**
   * Lista dos arquivos/diretórios desconsiderados na conversão.
   * @default []
   */
  exclusions?: string[];

  /**
   * Nome da classe `CSS` utilizada nos elementos contendo códigos de exemplos.
   *
   * Obs: independente desta configuração, a classe contendo o nome da
   * linguagem sempre é inserida.
   *
   * @default highlight
   */
  highlightClassName?: string;

  /**
   * Cria todas as pastas de componentes na pasta raíz de destino.
   *
   * @default true
   */
  flatDirs?: boolean;

  /**
   * Lê recursivamente as pastas abaixo da pasta de origem.
   *
   * @default true
   */
  recursive?: boolean;

  /**
   * Cria os arquivos auxiliares de `module`, `routing` e `service`.
   *
   * @default true
   */
  createHelpers?: boolean;

  /**
   * Cria a página inicial com menu para os componentes.
   *
   * @default true
   */
  home?: boolean;

  /**
   * Nome do módulo `Angular` para agrupar os componentes.
   *
   * @default docs
   */
  moduleName?: string;

  /**
   * Caminho da rota pai utilizado para as rotas dos componentes.
   *
   * @default {{moduleName}}
   */
  parentRoutePath?: string;

  /**
   * Copia os arquivos externos referenciados nos arquivos markdown.
   *
   * @default true
   */
  copyExternalFiles?: boolean;

  /**
   * Nome da pasta de armazenamento dos arquivos externos copiados.
   *
   * @default app/{{moduleName}}/{{resourceFolderName}}
   */
  resourceFolderName?: string;

  /**
   * Caminho utilizado para referenciar os arquivos externos nos componentes.
   *
   * @default assets
   */
  resourcePathName?: string;

  /**
   * Módulos extras que serão incluídos como `imports` no módulo gerado.
   *
   * Exemplo: `imports: [{ name: 'SharedModule', path: '../shared' }]`
   */
  imports?: { name: string; path: string }[];
}

export const defaultOptions: Options = {
  exclusions: [],
  highlightClassName: 'highlight',
  flatDirs: true,
  recursive: true,
  createHelpers: true,
  home: true,
  moduleName: 'docs',
  parentRoutePath: '{{moduleName}}',
  copyExternalFiles: true,
  resourceFolderName: 'assets',
  resourcePathName: 'app/{{moduleName}}/{{resourceFolderName}}',
  imports: [],
};
