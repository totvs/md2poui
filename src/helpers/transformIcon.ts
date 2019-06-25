import emoji from 'node-emoji';

export class TransformIcon {

  /**
   * Converte um icone delimitado por `:` (dois pontos) para o icone no padrão do github. 
   * Exemplo: ":warning:" será "⚠️"
   *
   * @param text Texto a ser convertido
   * @return Texto convertido.
   */
  public static convert(text: string): string {
    const replacer = (match: string) => emoji.emojify(match);
    return text.replace(/(:.*:)/g, replacer);
  }
}
