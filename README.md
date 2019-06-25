# md2thf

Conversor de arquivos `markdown` para componentes `Angular` utilizando recursos da biblioteca [`THF`][thf].

## Instalação

```bash
npm install md2thf --save-dev
```

## Modo de uso

```javascript
const md2thf = require('md2thf');
md2thf('C:/pathFromMdFiles', 'C:/pathToAngularFiles');
```

ou

```bash
node md2thf C:/pathFromMdFiles C:/pathToAngularFiles
```

## Release Notes

### 1.1.0

- **Nova Funcionalidade** na parte de conversão, agora ele irá converte os icones no padrão github para o html. Exemplo: "`:warning:`" será :warning:.

### 1.0.2

- **Correção** na verificação das configurações padrões. Se não fosse informado a configuração `exclusions` a execução era interrompida.
- **Melhoria** na criação de links, agora é identificado se o link é externo ou interno. Se interno o conversor tenta gerar um link para uma rota do Angular.
- **Melhoria** na criação de títulos, para os títulos de níveis abaixo de três são criadas âncoras para melhor navegação na página.

### 1.0.1

- Primeira versão!
- Converte os arquivos Markdown para HTML e Typescript para aplicações Angular utilizando a bilioteca TOTVS HTML Framework.

## Parâmetros

```typescript
function md2thf(srcDir: string, destDir: string, options?: Options): void {}
```

### `srcDir`

Diretório de origem dos arquivos `markdown` que serão convertidos. São considerados todos os arquivos com extensão `.md` encontrados na pasta raiz e nas subpastas do diretório informado.

Exemplo: `C:/zoologico`.

### `destDir`

Diretório de destino dos arquivos `Angular` que serão criados a partir da conversão dos arquivos `markdown`.

Exemplo: `C:/portal/src/app/zoologico`.

> Arquivos existentes no diretório de destino não são excluídos.

### `options`

Objeto opcional com as configurações e definições customizadas de conversão dos arquivos:

```typescript
{
  exclusions: string[] = [],
  flatDirs: boolean = false,
  moduleName: string = 'wiki',
  resourceFolderName: string = 'resources',
  resourcePathName: string = 'src/app/wiki/resources'
}
```

### `options.exclusions`

Lista com os arquivos `markdown` que serão desconsiderados da conversão. O caminho informado nesta lista pode ser completo ou relativo ao diretório informado no parâmetro `srcDir`.

Valor padrão: `[]`<br>
Exemplo: `['C:/zoologico/onca/README.md', 'chimpanze/README.md']`.

### `options.flatDirs`

Se verdadeiro, irá criar todas as pastas dos componentes `Angular` na pasta raíz informada no parâmetro `destDir`, caso contrário, irá obedecer a mesma estrutura encontrada na pasta informada no parâmetro `srcDir`.

Valor padrão: `true`<br>
Exemplo:

`srcDir`

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

### `options.moduleName`

Nome do módulo `Angular` que será criado para agrupar os componentes gerados a partir da conversão dos arquivos `markdown`.

Valor padrão: `wiki`.

> O nome do módulo deve ser informado em `CamelCase`.

### `options.resourceFolderName`

Nome da pasta que será criada, abaixo da pasta informada no parâmetro `destDir`, para armazenar os arquivos externos referenciados nos arquivos `markdown` convertidos.

Os arquivos encontrados na conversão são copiados para dentro desta pasta com um nome único gerado automaticamente, para que não haja conflitos, e as referências são alteradas para apontar para o arquivo copiado.

Valor padrão: `resources`.

> Esta pasta deve ser incluída como `asset` da aplicação `Angular`.

> Geralmente estes arquivos são imagens referenciadas pela marcação `markdown` ou `HTML`, como nos exemplos abaixo:<br> > `![Minha Imagem](imagens/minhaImagem.png)` ou<br> > `<img alt="Minha Imagem" src="imagens/minhaImagem.png" />`

### `options.resourcePathName`

Caminho que será utilizado para referenciar os arquivos externos copiados durante a conversão dos arquivos `markdown`.

Padrão: `app/src/wiki/resources`.

> Este caminho deve ser acessível pela aplicação `Angular`.

## Facilitadores

Além da conversão e criação dos componentes `Angular` são criados mais três arquivos auxiliares: módulo, roteamento e serviço.

O arquivo de módulo agrega todos os componentes criados e o roteamento destes componentes - com o uso do arquivo de roteamento. Já o arquivo de serviço possui facilitadores para retornar a lista das rotas dos componentes no formato esperado pelo [`ThfMenu`][thf-menu].

_Module_

```typescript
import { NgModule } from '@angular/core';
import { ThfModule } from '@totvs/thf-ui';

import { WikiRoutingModule } from './wiki-routing.module';
import { WikiService } from './wiki.service';

import { SampleComponent } from './sample/sample.component';

@NgModule({
  declarations: [SampleComponent],
  imports: [ThfModule, WikiRoutingModule],
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
import { ThfMenuItem } from '@totvs/thf-ui';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  constructor() {}

  public getWikiMenuItems(): ThfMenuItem[] {
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

Todos os arquivos externos referenciados nos arquivos `markdown` são copiados para a pasta de recursos (conforme parâmetro `options.resourceFolderName`) com outro nome gerado dinâmicamente.

Para que seja possível a visualização dos arquivos desta pasta pela aplicação `Angular` é necessário adicioná-la como `asset` alterando o arquivo `angular.json` da aplicação:

```json
{
  "assets": [
    "src/favicon.ico",
    "src/assets",
    "src/app/zoologico/resources"
  ]
}
```

## Feito com md2thf

Toda a área de documentação do portal [**TOTVS Java Framework**](https://tjf.totvs.com.br) foi desenvolvida utilizando o `md2thf`.

[thf]: https://thf.totvs.com.br
[thf-menu]: https://thf.totvs.com.br/documentation/thf-menu
