import { Renderer } from 'marked';
import * as path from 'path';
import { v1 as uuidv1 } from 'uuid';

import { Options } from '../options';
import { ThfRendererData } from './thfRendererData';

export class ThfRenderer extends Renderer {
  private options: Options;
  private data = {} as ThfRendererData;

  /**
   * @override
   */
  public code(code: string, language: string): string {
    return `<pre><code class="highlight language ${language}">${this.escapeCode(code)}</code></pre>`;
  }

  /**
   * @override
   */
  public codespan(code: string): string {
    return `<code>${this.escapeCode(code)}</code>`;
  }

  /**
   * @override
   */
  public heading(title: string, level: number): string {
    let header = '';

    // Define o título do arquivo a partir do primeiro heading de nível 1.
    if (level === 1 && !this.data.title) {
      this.data.title = title;
    } else {
      header = `<h${level}>${title}</h${level}>`;
    }

    return header;
  }

  /**
   * @override
   */
  public html(html: string): string {
    // Verifica se o HTML possui algum caminho relativo a qualquer arquivo e
    // adiciona a uma lista para que depois seja possível recuperar e fazer a
    // conversão destes arquivos.
    const matches = /src=\"([^']*?)\"/g.exec(html);
    matches
      .slice(1)
      .filter((m, i, l) => l.indexOf(m) === i) // Remove arquivos duplicados.
      .filter((m) => m.indexOf('http') < 0) // Somente arquivos "internos".
      .forEach((match) => (html = html.replace(new RegExp(match, 'g'), `${this.options.resourcePathName}/${this.addFile(match)}`)));

    return html;
  }

  /**
   * @override
   */
  public image(href: string, title: string, text: string): string {
    let file = href;

    // Verifica se a imagem possui algum caminho relativo a qualquer arquivo e
    // adiciona a uma lista para que depois seja possível recuperar e fazer a
    // conversão destes arquivos.
    if (href.indexOf('http') < 0) file = this.addFile(href);

    return `<img src="${this.options.resourcePathName}/${file}" alt="${text}" />`;
  }

  /**
   * @override
   */
  public link(href: string, title: string, text: string): string {
    return `<a href="${href}" target="_blank">${text}</a>`;
  }

  public getTitle(): string {
    return this.data.title;
  }

  public getFiles(): MarkdownFile[] {
    return this.data.files || [];
  }

  private escapeCode(code: string): string {
    return code
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;');
  }

  private addFile(file: string): string {
    const guid = uuidv1() + path.extname(file);
    this.data.files = this.data.files || [];
    this.data.files.push({ from: file, to: guid });
    return guid;
  }
}

export type MarkdownFile = { from: string; to: string };
