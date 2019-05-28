# md2thf

Conversor de arquivos `markdown` para componentes `Angular` utilizando recursos da biblioteca [`THF`][thf].


## Instalação

```bash
npm install md2thf
```


## Modo de uso

```javascript
const md2thf = require('md2thf');
md2thf('C:/pathFromMdFiles', 'C:/pathToAngularFiles')
```

ou

```bash
node md2thf C:/pathFromMdFiles C:/pathToAngularFiles
```


## Parâmetros

```typescript
function md2thf(srcDir: string, destDir: string, options?: Options): void {}
```


### `srcDir`

Diretório de origem dos arquivos `markdown` que serão convertidos. São considerados todos os arquivos com extensão `.md` encontrados na pasta raiz e nas subpastas do diretório informado.

Exemplo: `C:/wiki`.

### `destDir`

Diretório de destino dos arquivos `Angular` que serão criados a partir da conversão dos arquivos `markdown`.

Exemplo: `C:/portal/src/app/wiki`.

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
Exemplo: `['C:/wiki/README.md', 'ignore/README.md']`.


### `options.flatDirs`

Se verdadeiro, irá criar todas as pastas dos componentes `Angular` na pasta raíz informada no parâmetro `destDir`, caso contrário, irá obedecer a mesma estrutura encontrada na pasta informada no parâmetro `srcDir`.

Valor padrão: `true`<br>
Exemplo:

`srcDir`

```
C:\
└── wiki\
    ├── README.md
    ├── samples\
    │   ├── sampleOne\
    │   |   ├── README.md
    │   ├── sampleTwo\
    │   |   ├── README.md
    ├── howTo\
    │   ├── README.md
```

`destDir` com `options.flatDirs=true`

```
C:\
└── portal/
    ├── wiki/
    |   ├── sampleOne/
    │   |   ├── sampleone.component.ts
    │   ├── sampleTwo/
    │   |   ├── sampletwo.component.ts
    |   ├── howTo/
    │   |   ├── howto.component.ts
    │   ├── wiki.component.ts
```

`destDir` com `options.flatDirs=false`

```
C:\
└── portal/
    ├── wiki/
    |   ├── samples/
    │   |   ├── sampleOne/
    │   |   |   ├── sampleone.component.ts
    │   |   ├── sampleTwo/
    │   |   |   ├── sampletwo.component.ts
    |   ├── howTo/
    │   |   ├── howto.component.ts
    │   ├── wiki.component.ts
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

> Geralmente estes arquivos são imagens referenciadas pela marcação `markdown` ou `HTML`, como nos exemplos abaixo:<br>
> `![Minha Imagem](imagens/minhaImagem.png)` ou<br>
> `<img alt="Minha Imagem" src="imagens/minhaImagem.png" />`


### `options.resourcePathName`

Caminho que será utilizado para referenciar os arquivos externos copiados durante a conversão dos arquivos `markdown`.

Padrão: `app/src/wiki/resources`.

> Este caminho deve ser acessível pela aplicação `Angular`.


## Outros recursos

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
    "src/app/wiki/resources"
  ]
}
```

[thf]: https://thf.totvs.com.br
[thf-menu]: https://thf.totvs.com.br/documentation/thf-menu