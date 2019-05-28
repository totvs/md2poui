export interface ThfRendererData {
  /**
   * Título do arquivo `markdown` gerado a partir do primeiro `heading` de
   * primeiro nível encontrado.
   */
  title: string;

  /**
   * Lista dos arquivos externos encontrados no arquivo `markdown`.
   */
  files: { from: string, to: string }[]
}