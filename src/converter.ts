import * as fs from 'fs';
import marked from 'marked';
import mustache from 'mustache';
import * as path from 'path';

import { Component } from './component';
import { Transform } from './helpers';
import { defaultOptions, Options } from './options';
import { MarkdownFile, ThfRenderer } from './renderer';
import * as templates from './templates';

/**
 * Executa a criação dos componentes `Angular/THF` gerados a partir dos
 * arquivos `markdown` encontrados no diretório de origem.
 *
 * @param srcDir Diretório de origem de busca dos arquivos `markdown`.
 * @param destDir Diretório de destino onde serão criados os componentes.
 * @param options Configurações de renderização e conversão dos componentes.
 */
export class Converter {
  private options: Options;
  private srcDir: string;
  private destDir: string;

  constructor(srcDir: string, destDir: string, options = {} as Options) {
    this.srcDir = path.normalize(srcDir);
    this.destDir = path.normalize(destDir);
    this.options = this.adjustOptions(options);
  }

  /**
   * Ajusta as configurações de conversão informadas com as configurações
   * padrões.
   *
   * @param options Configurações de conversão informado.
   * @returns Configurações de conversão ajustadas.
   */
  private adjustOptions(options: Options): Options {
    options = Object.assign(defaultOptions, options);
    options.exclusions.forEach((exclusion, i, exclusions) => (exclusions[i] = path.resolve(this.srcDir, exclusion)));
    return options;
  }

  /**
   * Inicia a execução da conversão dos arquivos `markdown`.
   */
  public execute() {
    const components = this.getMarkdownFiles()
      .map((file, i, l) => new Component(this.srcDir, file, i === l.length - 1 ? '' : ',', this.options));
    components.forEach((component) => this.createComponentFiles(component));

    this.createModuleFile(components);
    this.createRouterFile(components);
    this.createServicFile(components);
  }

  /**
   * Cria os arquivos do componente (classe e view) a partir da conversão do
   * arquivo `markdown`.
   * @param component Objeto com as informações do componente.
   */
  private createComponentFiles(component: Component) {
    // Deve ser criado um ThfRenderer a cada componente gerado.
    this.options.renderer = new ThfRenderer(this.options);

    const dir = this.createComponentDirectory(component.getPath());

    const ts = this.renderComponentClass(component);
    fs.writeFileSync(path.join(dir, `${component.getName()}.component.ts`), ts, 'utf-8');

    const html = this.renderComponentView(component);
    fs.writeFileSync(path.join(dir, `${component.getName()}.component.html`), html, 'utf-8');

    // Efetua a cópia dos arquivos externos.
    this.copyFiles(
      path.dirname(component.getFile()),
      path.join(this.destDir, this.options.resourceFolderName),
      this.options.renderer.getFiles()
    );
  }

  /**
   * Cria a pasta de destino dos arquivos de componente.
   *
   * @param destPath Caminho relativo do diretório de destino.
   * @returns Caminho completo do diretório de destino criado.
   */
  private createComponentDirectory(destPath: string): string {
    const dirPath = path.join(this.destDir, destPath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    return dirPath;
  }

  /**
   * Renderiza o conteúdo do componente a partir do _template_ e das
   * informações do componente informado.
   *
   * @param component Objeto com as informações do componente.
   * @returns Conteúdo da classe do componente renderizado.
   */
  private renderComponentClass(component: Component) {
    return mustache.render(templates.component, { component });
  }

  /**
   * Renderiza o conteúdo da _view_ do componente a partir do _template_ e das
   * informações do componente informado.
   *
   * @param renderer Objeto com as funções de renderização.
   * @param component Objeto com as informações do componente.
   *
   * @returns Conteúdo da _view_ do componente renderizado.
   */
  private renderComponentView(component: Component) {
    const content = marked(fs.readFileSync(component.getFile(), 'utf-8'), this.options);

    component.setTitle(this.options.renderer.getTitle());
    return mustache.render(templates.componentView, { title: component.getTitle(), content });
  }

  /**
   * Cria o arquivo do módulo `Angular` para agrupar todos os componentes criados.
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createModuleFile(components: Component[]) {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);
    const moduleCont = mustache.render(templates.module, { components, moduleName, moduleClassName });
    fs.writeFileSync(path.join(this.destDir, `${this.options.moduleName}.module.ts`), moduleCont, 'utf-8');
  }

  /**
   * Cria o arquivo de roteamento `Angular` com o caminho de execução de todos os
   * componentes criados.
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createRouterFile(components: Component[]) {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);
    const routerCont = mustache.render(templates.routing, { components, moduleName, moduleClassName });
    fs.writeFileSync(path.join(this.destDir, `${this.options.moduleName}-routing.module.ts`), routerCont, 'utf-8');
  }

  /**
   * Cria o arquivo de serviço `Angular` com métodos que auxiliam na criação do
   * menu `THF` com a lista de todos os componentes criados.
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createServicFile(components: Component[]) {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);
    const serviceCont = mustache.render(templates.service, { components, moduleName, moduleClassName });
    fs.writeFileSync(path.join(this.destDir, `${this.options.moduleName}.service.ts`), serviceCont, 'utf-8');
  }

  /**
   * Copia os arquivos externos encontrados no arquivo `markdown` para o
   * diretório de recursos configurado.
   *
   * @param srcDir Diretório de origem do arquivo `markdown` atual.
   * @param destDir Diretório de destino onde serão criados os componentes.
   * @param files Lista dos arquivos externos encontrados no arquivo `markdown`.
   */
  private copyFiles(srcDir: string, destDir: string, files: MarkdownFile[]) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
    files.forEach((file) => fs.copyFileSync(path.join(srcDir, file.from), path.join(destDir, file.to)));
  }

  /**
   * Retorna a lista de arquivos `markdown` encontrados abaixo da pasta informada
   * de forma recursiva.
   *
   * @param searchPath Caminho de busca de arquivos `markdown`.
   * @returns Lista dos arquivos `markdown` encontrados.
   */
  private getMarkdownFiles(searchPath = this.srcDir): string[] {
    return fs
      .readdirSync(searchPath)
      .map((file) => path.join(searchPath, file))
      .flatMap((file) => (fs.statSync(file).isDirectory() ? this.getMarkdownFiles(file) : file))
      .filter((file) => path.extname(file) === '.md' && this.options.exclusions.indexOf(file) === -1);
  }
}
