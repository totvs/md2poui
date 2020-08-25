# md2poui

Conversor de arquivos `markdown` para componentes `Angular` utilizando recursos visuais das bibliotecas [`PO UI`][po-ui].

## Instalação

```bash
npm install md2poui -g
```

ou

```bash
npm install md2poui --save-dev
```

## Modo de uso

```javascript
const md2poui = require('md2poui');
md2poui('C:/pathFromMdFiles', 'C:/pathToAngularFiles');
```

ou

```bash
md2poui C:/pathFromMdFiles C:/pathToAngularFiles
```

## Release Notes

### 3.0.0

- Removido suporte ao `Portinari UI` e adicionado suporte somente ao **PO-UI**.
- Removida a criação de âncoras, devido a limitação técnica do **PO-UI**.

### 2.0.2

- Inclusão do campo de filtro no menu da página inicial.

### 2.0.1

- Corrigida geração da página inicial ao usar nome de módulo com mais de uma palavra.
- Corrigida geração de componentes que possuem números no início do nome.

### 2.0.0 **Nova Versão!**

- Removido suporte ao `THF`.
- Adicionada nova configuração: `options.home`.
  > Mais informações disponíveis no item [`options`](#options).

### 1.2.5

- Corrigido parâmetro `parentRoutePath` na versão CLI - por [@laraujo0901](https://github.com/laraujo0901).

### 1.2.4

- Melhoria na conversão das imagens para que as mesmas não gerem barra de rolagem horizontal para a página.
- Corrigidas configurações padrões.
- Corrigida geração de componentes onde a pasta contém números que
  representam sua ordem de criação.

### 1.2.3

- Adicionado suporte ao **PortinariUI**!
- Adicionadas novas configurações: `options.portinariUi` e `options.parentRoutePath`.
  > Mais informações disponíveis no item [`options`](#options).
- A partir desta versão, se definida a configuração `options.flatDirs=false` o menu será gerado de forma hierárquica obedecendo a estrutura dos arquivos `markdown`.
- Adicionado suporte a diretórios na lista de exclusões.
- Alterado nome do método que retorna os itens para `getMenuItems`.
- O módulo de rotas agora possui _fallback_ para caminhos inválidos.

### 1.2.1, 1.2.2

- Adicionadas novas configurações: `options.recursive` e `options.highlightClassName`.
  > Mais informações disponíveis no item [`options`](#options).
- Adicionado suporte a arquivos no parâmetro de origem.

### 1.2.0

- Adicionado suporte à execução do md2poui "globalmente" via linha de comando.

### 1.1.1 e 1.1.2

- Corregidas dependências utilizadas pelo projeto.

### 1.1.0

- Adicionado suporte a ícones do padrão do GitHub.
  <br/>Exemplo: `:warning:` será :warning: - por [@marcospds](https://github.com/marcospds).
- Adicionadas novas configurações: `options.createHelpers` e `options.copyExternalFiles`.
  > Mais informações disponíveis no item [`options`](#options).

### 1.0.2

- Corrigida verificação das configurações padrões quando não era informado `exclusions`.
- Adicionado suporte a links internos na geração dos componentes.
- Adicionado suporte à âncoras para títulos de até três níveis.

### 1.0.1

- Primeira versão!

## Parâmetros

```typescript
function md2poui(srcPath: string, destDir: string, options?: Options): void {}
```

### `srcPath`

Caminho de origem dos arquivos `markdown` que serão convertidos. São considerados todos os arquivos com extensão `.md` encontrados na pasta raiz e nas subpastas do caminho informado.

Exemplo: `C:/zoologico`.

### `destDir`

Diretório de destino dos arquivos `Angular` que serão criados a partir da conversão dos arquivos `markdown`.

Exemplo: `C:/portal/src/app/zoologico`.

> Arquivos existentes no diretório de destino não são excluídos.

### `options`

Opções de configurações e definições customizadas de conversão dos arquivos:

```typescript
{
  exclusions: string[] = [],
  highlightClassName: string = 'highlight',
  flatDirs: boolean = false,
  recursive: boolean = true,
  createHelpers: boolean = true,
  home: boolean = true,
  moduleName: string = 'docs',
  parentRoutePath: string = '{{moduleName}}',
  copyExternalFiles: boolean = true,
  resourceFolderName: string = 'assets',
  resourcePathName: string = 'src/app/{{moduleName}}/{{resourceFolderName}}'
}
```

### `options.exclusions`

Lista com os arquivos `markdown` ou diretórios que serão desconsiderados da conversão. O caminho informado nesta lista pode ser relativo ou completo ao diretório informado no parâmetro `srcPath`.

Valor padrão: `[]`<br>
Exemplo: `['C:/zoologico/onca/README.md', 'chimpanze/README.md']`.

### `options.highlightClassName`

Nome da classe `CSS` que será utilizada nos elementos de códigos de exemplo.

> Independente desta configuração, a classe contendo o nome da linguagem sempre é inserida.

Valor padrão: `highlight`.

### `options.flatDirs`

Se verdadeiro, irá criar as pastas dos componentes na pasta raíz da pasta de destino informada no parâmetro `destDir`, caso contrário irá obedecer a mesma estrutura encontrada na pasta de origem informada no parâmetro `srcPath`.

Valor padrão: `true`

Exemplo:

`srcPath`

```
C:\
└── zoologico\
    └── animais\
    │   └── leao\
    │   |   ├── README.md
    │   └── zebra\
    │   |   ├── README.md
    └── atracoes\
    │   ├── README.md
    ├── README.md
```

`destDir` com `options.flatDirs=true`

```
C:\portal\src\app\
└── zoologico/
    └── leao/
    │   ├── leao.component.ts
    └── zebra/
    │   ├── zebra.component.ts
    └── atracoes/
    │   ├── atracoes.component.ts
    ├── zoologico.component.ts
    ├── zoologico.module.ts
    ├── zoologico.service.ts
    ├── zoologico-routing.module.ts
```

`destDir` com `options.flatDirs=false`

```
C:\portal\src\app\
└── zoologico/
    └── animais/
    │   └── leao/
    │   |   ├── leao.component.ts
    │   └── zebra/
    │   |   ├── zebra.component.ts
    └── atracoes/
    │   ├── atracoes.component.ts
    ├── zoologico.component.ts
    ├── zoologico.module.ts
    ├── zoologico.service.ts
    ├── zoologico-routing.module.ts
```

### `options.recursive`

Se verdadeiro, irá ler recursivamente todas as pastas abaixo da pasta de origem informada no parâmetro `srcPath`.

Valor padrão: `true`.

### `options.createHelpers`

Se verdadeiro, irá criar os arquivos auxiliares de módulo, rotas e serviço.

Valor padrão: `true`.

### `options.home`

Se verdadeiro, irá criar uma página inicial já com menu para os componentes criados.

Valor padrão: `true`.

### `options.moduleName`

Nome do módulo `Angular` que será criado para agrupar os componentes gerados a partir da conversão dos arquivos `markdown`.

Valor padrão: `docs`.

> O nome do módulo deve ser informado em `kebab-case`.

### `options.parentRoutePath`

Caminho da rota pai que será utilizado para as rotas dos componentes.

Valor padrão: `{{options.moduleName}}`.

Exemplo:

`options.parentRoutePath='zoo/animais'`

```javascript
{
  label: "Leão",
  link: "zoo/animais/leao"
}
```

### `options.copyExternalFiles`

Se verdadeiro, irá copiar os arquivos externos referenciados nos arquivos `markdown` para a pasta de recursos.

Valor padrão: `true`.

### `options.resourceFolderName`

Nome da pasta de recursos que será criada para armazenar os arquivos externos referenciados nos arquivos `markdown`.

Os arquivos encontrados na conversão são copiados para dentro desta pasta com um nome único gerado automaticamente para não haver conflitos e as referências são alteradas para apontar para o arquivo copiado.

Valor padrão: `assets`.

> Esta pasta deve ser incluída como `asset` da aplicação `Angular`.

> Geralmente estes arquivos são imagens referenciadas pela marcação `markdown` ou `HTML`, como nos exemplos abaixo:<br> > `![Minha Imagem](imagens/minhaImagem.png)` ou<br> > `<img alt="Minha Imagem" src="imagens/minhaImagem.png" />`

### `options.resourcePathName`

Caminho que será utilizado para referenciar os arquivos externos copiados durante a conversão dos arquivos `markdown`.

Padrão: `src/app/{{options.moduleName}}/{{options.resourceFolderName}}`.

> Este caminho deve ser acessível pela aplicação `Angular`.

## Facilitadores

Além da conversão e criação dos componentes `Angular` são criados mais três arquivos auxiliares: módulo, rotas e serviço.

O arquivo de módulo agrega todos os componentes criados e o roteamento destes componentes - com o uso do arquivo de roteamento.

Já o arquivo de serviço possui facilitadores para retornar a lista das rotas dos componentes no formato esperado pelo menu do [`PO-UI`][po-menu].

_Module_

```typescript
import { NgModule } from '@angular/core';
import { PoModule } from '@po-ui/ng-components';

import { WikiRoutingModule } from './wiki-routing.module';
import { WikiService } from './wiki.service';

import { SampleComponent } from './sample/sample.component';

@NgModule({
  declarations: [SampleComponent],
  imports: [PoModule, WikiRoutingModule],
  providers: [WikiService]
})
export class WikiModule {}
```

_Routing_

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SampleComponent } from './sample/sample.component';

const routes: Routes = [
  {
    path: 'sample',
    component: SampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WikiRoutingModule {}
```

_Service_

```typescript
import { Injectable } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  constructor() {}

  public getWikiMenuItems(): PoMenuItem[] {
    return [
      {
        label: 'Sample Component',
        link: 'wiki/sample'
      }
    ];
  }
}
```

## Visualização dos arquivos externos

Os arquivos externos referenciados nos arquivos `markdown` são copiados para a pasta de recursos (conforme parâmetros `options.copyExternalFiles` e `options.resourceFolderName`) com outro nome gerado dinâmicamente.

Para que seja possível a visualização dos arquivos desta pasta pela aplicação `Angular` é necessário adicionar a pasta de recursos como `asset` alterando o arquivo `angular.json` da aplicação:

```json
{
  "assets": [
    "src/favicon.ico",
    "src/assets",
    "src/app/zoologico/resources"
  ]
}
```

## Feito com md2poui

Toda a área de documentação do portal [**TOTVS Java Framework**](https://tjf.totvs.com.br) foi desenvolvida utilizando o `md2poui`.

[po-ui]: https://po-ui.io/
[po-menu]: https://po-ui.io/documentation/po-menu
