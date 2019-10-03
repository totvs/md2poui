import { Renderer } from 'marked';
import * as path from 'path';
import sanitize from 'sanitize-html';
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
    return `<pre><code class="${this.options.highlightClassName} ${language}">${this.escapeCode(code)}</code></pre>`;
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
    } else if (level <= 3) {
      const fragment = this.adjustTitleToFragment(title);
      header = `<h${level} id="${fragment}"><a routerLink="." fragment="${fragment}">${title}</a></h${level}>`;
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
    if (this.options.copyExternalFiles) {
      const matches = /src=\"([^']*?)\"/g.exec(html);
      matches.slice(1)
        .filter((m, i, l) => l.indexOf(m) === i) // Remove arquivos duplicados.
        .filter(m => m.indexOf('http') < 0) // Somente arquivos "internos".
        .forEach(m => (html = html.replace(new RegExp(m, 'g'), `${this.options.resourcePathName}/${this.addFile(m)}`)));

      if (matches.length > 0) html = this.adjustImageHtml(html);
    }

    return html;
  }

  /**
   * @override
   */
  public list(body: string, ordered: boolean, start: number) {
    let element: string;

    if (ordered) {
      element = `<ol class="po-font-text" start="${start}">${body}</ol>`;
    } else {
      element = `<ul class="po-font-text">${body}</ul>`;
    }

    return element;
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

    return this.adjustImageHtml(`<img src="${file}" alt="${text}" />`);
  }

  /**
   * @override
   */
  public link(href: string, title: string, text: string): string {
    let link: string;

    if (href.indexOf('http') < 0 && href.indexOf('.md') >= 0) {
      // Está apontando para outro arquivo MD.
      link = `<a routerLink="../${path.dirname(href).split('/').pop()}">${text}</a>`;
    } else {
      link = `<a href="${href}" target="_blank">${text}</a>`;
    }

    return link;
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

  private adjustImageHtml(html: string): string {
    // Como o marked cria cada linha em um elemento "p" e é semânticamente
    // incorreto criar um elemento "div" dentro de um elemento "p", foi criado
    // um elemento "span" para agrupar as imagens.
    return `<span style="display: flex; overflow: auto; text-align: center; justify-content: center;">${html}</span>`;
  }
}

export type MarkdownFile = { from: string; to: string };
