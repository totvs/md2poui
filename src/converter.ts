import * as fs from 'fs';
import marked from 'marked';
import mustache from 'mustache';
import * as path from 'path';

import { Component } from './component';
import { globals, Transform, TransformIcon } from './helpers';
import { MarkdownFile, ThfRenderer } from './renderer';
import * as templates from './templates';

/**
 * Executa a criação dos componentes `Angular` gerados a partir dos arquivos
 * `markdown` encontrados no caminho de origem.
 */
export class Converter {
  private options = globals.args.getOptions();

  /**
   * Executa a conversão dos arquivos `markdown`.
   */
  public execute() {
    const components = this.getMarkdownFiles().map((f, i, l) => new Component(f, i === l.length - 1 ? '' : ','));
    components.forEach(component => this.createComponentFiles(component));

    if (this.options.home) {
      this.createHomeFile();
    }

    if (this.options.createHelpers) {
      this.createModuleFile(components);
      this.createRouterFile(components);
      this.createServicFile(components);
    }
  }

  /**
   * Cria os arquivos do componente (classe e view) a partir da conversão do
   * arquivo `markdown`.
   *
   * @param component Objeto com as informações do componente.
   */
  private createComponentFiles(component: Component) {
    // Deve ser criado um ThfRenderer a cada componente gerado.
    this.options.renderer = new ThfRenderer();

    const dir = this.createComponentDirectory(component.getPath());

    const ts = this.renderComponentClass(component);
    fs.writeFileSync(path.join(dir, `${component.getName()}.component.ts`), ts, 'utf-8');

    const html = this.renderComponentView(component);
    fs.writeFileSync(path.join(dir, `${component.getName()}.component.html`), html, 'utf-8');

    // Efetua a cópia dos arquivos externos.
    if (this.options.copyExternalFiles) {
      this.copyFiles(
        path.dirname(component.getFile()),
        path.join(globals.args.getDestDir(), this.options.resourceFolderName),
        this.options.renderer.getFiles()
      );
    }
  }

  /**
   * Cria a pasta de destino dos arquivos de componente.
   *
   * @param destPath Caminho relativo do diretório de destino.
   * @returns Caminho completo do diretório de destino criado.
   */
  private createComponentDirectory(destPath: string): string {
    const dirPath = path.join(globals.args.getDestDir(), destPath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
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
    return mustache.render(templates.component(), { component });
  }

  /**
   * Renderiza o conteúdo da _view_ do componente a partir do _template_ e das
   * informações do componente informado.
   *
   * @param component Objeto com as informações do componente.
   * @returns Conteúdo da _view_ do componente renderizado.
   */
  private renderComponentView(component: Component) {
    const markdown = TransformIcon.convert(fs.readFileSync(component.getFile(), 'utf-8'));
    const content = marked(markdown, this.options);

    component.setTitle(this.options.renderer.getTitle());
    return mustache.render(templates.componentView(), { title: component.getTitle(), content });
  }

  /**
   * Cria a página inicial com o menu dos componentes criados.
   */
  private createHomeFile() {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);

    const content = mustache.render(templates.home(), { moduleClassName, moduleName });
    const file = path.join(globals.args.getDestDir(), `${this.options.moduleName}-home.component.ts`);
    fs.writeFileSync(file, content, 'utf-8');

    const viewContent = mustache.render(templates.homeView(), { moduleClassName, moduleName });
    const viewFile = path.join(globals.args.getDestDir(), `${this.options.moduleName}-home.component.html`);
    fs.writeFileSync(viewFile, viewContent, 'utf-8');
  }

  /**
   * Cria o arquivo do módulo `Angular` para agrupar todos os componentes
   * criados.
   *
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createModuleFile(components: Component[]) {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);

    const home = this.options.home;
    const content = mustache.render(templates.module(), { home, components, moduleName, moduleClassName });
    const file = path.join(globals.args.getDestDir(), `${this.options.moduleName}.module.ts`);

    fs.writeFileSync(file, content, 'utf-8');
  }

  /**
   * Cria o arquivo de roteamento `Angular` com o caminho de execução de todos
   * os componentes criados.
   *
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createRouterFile(components: Component[]) {
    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);

    const home = this.options.home;
    const content = mustache.render(templates.routing(), { home, components, moduleName, moduleClassName });
    const file = path.join(globals.args.getDestDir(), `${this.options.moduleName}-routing.module.ts`);

    fs.writeFileSync(file, content, 'utf-8');
  }

  /**
   * Cria o arquivo de serviço `Angular` com métodos que auxiliam na criação do
   * menu `THF` com a lista de todos os componentes criados.
   *
   * @param components Lista dos objetos com as informações dos componentes.
   */
  private createServicFile(components: Component[]) {
    // Define a estrutura do menu conforme o parâmetro 'options.flatDirs'.
    const menu = this.loadMenuItems(components);
    const menuItems = JSON.stringify(menu, null, 2).replace(/\"([^(\")"]+)\":/g, '$1:');

    const moduleName = this.options.moduleName;
    const moduleClassName = Transform.pascalCase(moduleName);

    const serviceCont = mustache.render(templates.service(), { moduleClassName, menuItems });
    const serviceFile = path.join(globals.args.getDestDir(), `${this.options.moduleName}.service.ts`);
    fs.writeFileSync(serviceFile, serviceCont, 'utf-8');
  }

  /**
   * Carrega a estrutura dos itens de menu conforme a lista dos componentes
   * e a configuração `options.flatDirs`.
   *
   * @param components Lista dos objetos com as informações dos componentes.
   * @returns Estrutura dos itens de menu.
   */
  private loadMenuItems(components: Component[]): MenuItem[] {
    const menuItems: MenuItem[] = [];

    for (let i = 0, len = components.length; i < len; i++) {
      const component = components[i];

      const menuItem = {} as MenuItem;
      menuItem.label = component.getTitle();
      menuItem.file = component.getFile();
      menuItem.subItems = [];

      if (this.options.parentRoutePath && this.options.parentRoutePath.length > 0) {
        menuItem.link = `${this.options.parentRoutePath}/${component.getName()}`;
      } else {
        menuItem.link = component.getName();
      }

      // Verifica se o componente atual é filho direto de algum componente
      // anterior.
      const menuParent = this.options.flatDirs ? null : this.getMenuParent(menuItems, components[i]);

      if (menuParent) {
        menuParent.push(menuItem);
      } else {
        menuItems.push(menuItem);
      }
    }

    this.adjustMenuItems(menuItems);

    return menuItems;
  }

  /**
   * Verifica os itens de menu e o componente informado e retorna o menu pai ao
   * qual ele pertence.
   *
   * @param menuItems Estrutura dos itens de menu.
   * @param components Lista dos objetos com as informações dos componentes.
   *
   * @returns Estrutura do item de menu pai do componente informado.
   */
  private getMenuParent(menuItems: MenuItem[], component: Component): MenuItem[] {
    let menuParent: MenuItem[] = null;

    for (let i = 0, len = menuItems.length; i < len; i++) {
      const dirname = path.dirname(menuItems[i].file);
      const relative = path.relative(dirname, component.getFile());

      const regExp = new RegExp(`\\${path.sep}`, 'g'); // ^(?!\.\..*).*\\.*$
      const isChild = relative.indexOf('..') === -1 && (relative.match(regExp) || []).length === 1;

      if (isChild) {
        menuParent = menuItems[i].subItems;
      } else if (menuItems[i].subItems.length > 0) {
        menuParent = this.getMenuParent(menuItems[i].subItems, component);
      }

      if (menuParent) break;
    }

    return menuParent;
  }

  /**
   * Ajusta os itens de menu removendo as informações incluídas de forma
   * dinâmica para facilitar o desenvolvimento.
   *
   * @param menuItems Estrutura dos itens de menu.
   * @return Estrutura dos itens de menu ajustados.
   */
  private adjustMenuItems(menuItems: MenuItem[]) {
    for (let i = 0, len = menuItems.length; i < len; i++) {
      const menuItem = menuItems[i];
      delete menuItem.file;

      if (menuItem.subItems.length > 0) {
        this.adjustMenuItems(menuItem.subItems);
      } else {
        delete menuItem.subItems;
      }
    }
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
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    files.forEach(file => fs.copyFileSync(path.join(srcDir, file.from), path.join(destDir, file.to)));
  }

  /**
   * Retorna a lista de arquivos `markdown` encontrados abaixo da pasta
   * informada de forma recursiva ou não.
   *
   * @param searchPath Caminho de busca de arquivos `markdown`.
   * @returns Lista dos arquivos `markdown` encontrados.
   */
  private getMarkdownFiles(searchPath = globals.args.getSrcPath()): string[] {
    const recursive = this.options.recursive;
    let files: string[];

    if (fs.statSync(searchPath).isFile()) {
      files = [searchPath];
    } else {
      files = fs
        .readdirSync(searchPath)
        .sort((a, b) => (path.extname(a) === '.md' ? -1 : a < b ? -1 : 1)) // Arquivos `markdown` primeiro.
        .map(file => path.join(searchPath, file))
        .filter(file => !this.options.exclusions.some(exclusion => path.dirname(file).startsWith(exclusion)))
        .flatMap(file => (recursive && fs.statSync(file).isDirectory() ? this.getMarkdownFiles(file) : file))
        .filter(file => this.options.exclusions.indexOf(file) === -1 && path.extname(file) === '.md');
    }

    return files;
  }
}

type MenuItem = { label: string; link?: string; file: string; subItems: MenuItem[] };
