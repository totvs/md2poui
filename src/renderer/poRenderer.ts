import { Renderer } from 'marked';
import * as path from 'path';
import sanitize from 'sanitize-html';
import { v1 as uuidv1 } from 'uuid';

import { Options } from '../options';
import { PoRendererData } from './poRendererData';

export class PoRenderer extends Renderer {
  public options: Options;
  private data: PoRendererData = { title: undefined, files: [] };

  /**
   * @override
   */
  public code(code: string, language: string): string {
    return `<pre><code class="${this.options.highlightClassName} ${language}">${this.escapeCode(code)}</code></pre>`;
  }

  /**
   * @override
   */
  public codespan(code: string): string {
    return `<code>${this.escapeCodespan(code)}</code>`;
  }

  /**
   * @override
   */
  public heading(title: string, level: number): string {
    // Define o título do arquivo a partir do heading de nível 1.
    if (level === 1 && !this.data.title) {
      this.data.title = title;
      return '';
    }

    // Devido a um bug no PO-UI, não é possível criar âncoras nas páginas.
    //if (level <= 3) {
    //  const fragment = this.adjustTitleToFragment(title);
    //  return `<h${level} id="${fragment}"><a routerLink="." fragment="${fragment}">${title}</a></h${level}>`;
    //}

    return `<h${level}>${title}</h${level}>`;
  }

  /**
   * @override
   */
  public html(html: string): string {
    if (!this.options.copyExternalFiles) return html;

    // Verifica se o HTML possui algum caminho relativo a qualquer arquivo e
    // adiciona a uma lista para que depois seja possível recuperar e fazer a
    // conversão destes arquivos.
    const matches = /src=\"([^']*?)\"/g.exec(html);

    if (matches && matches.length > 0) {
      matches
        .slice(1)
        .filter((m, i, l) => l.indexOf(m) === i) // Remove arquivos duplicados.
        .filter((m) => m.indexOf('http') < 0) // Somente arquivos "internos".
        .forEach((m) => (html = html.replace(new RegExp(m, 'g'), `${this.options.resourcePathName}/${this.addFile(m)}`)));
      return this.adjustResourceHtml(html);
    }

    return html;
  }

  /**
   * @override
   */
  public list(body: string, ordered: boolean, start: number) {
    if (ordered) return `<ol class="po-font-text" start="${start}">${body}</ol>`;
    return `<ul class="po-font-text">${body}</ul>`;
  }

  /**
   * @override
   */
  public image(href: string, title: string, text: string): string {
    let file = href;

    // Verifica se a imagem possui algum caminho relativo a qualquer arquivo e
    // adiciona a uma lista para que depois seja possível recuperar e fazer a
    // conversão destes arquivos.
    if (this.options.copyExternalFiles && href.indexOf('http') < 0) {
      file = this.addFile(href);
      file = `${this.options.resourcePathName}/${file}`;
    }

    return this.adjustResourceHtml(`<img src="${file}" alt="${text}" />`);
  }

  /**
   * @override
   */
  public link(href: string, title: string, text: string): string {
    // Está apontando para outro arquivo MD.
    if (href.indexOf('http') < 0 && href.indexOf('.md') >= 0)
      return `<a routerLink="../${path.dirname(href).split('/').pop()}">${text}</a>`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  }

  /**
   * @override
   */
  public paragraph(text: string): string {
    return `<p class="po-font-text">${text}</p>`;
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

  private escapeCodespan(code: string): string {
    return code.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
  }

  private addFile(file: string): string {
    const guid = uuidv1() + path.extname(file);
    this.data.files = this.data.files || [];
    this.data.files.push({ from: file, to: guid });
    return guid;
  }

  private adjustTitleToFragment(title: string): string {
    return sanitize(title, { allowedTags: [] })
      .replace(/\,\s/g, ',')
      .replace(/\s\(/g, '(')
      .replace(/\s\)/g, ')')
      .replace(/(\(\))/g, '')
      .replace(/ {1,}/g, ' ')
      .replace(/\s[^a-zA-Z0-9]/g, '')
      .replace(/[\\\/\.\,\s\(]/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
  }

  private adjustResourceHtml(html: string): string {
    // Como o marked cria cada linha em um elemento "p" e é semânticamente
    // incorreto criar um elemento "div" dentro de um elemento "p", foi criado
    // um elemento "span" para agrupar a imagem.
    return `<span style="display: flex; overflow: auto; text-align: center; justify-content: center;">${html}</span>`;
  }
}

export type MarkdownFile = { from: string; to: string };
