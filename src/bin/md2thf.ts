#! /usr/bin/env node
import yargs from 'yargs';

import md2thf from '..';
import { Options } from '../options';

const argv = yargs
  .locale('pt_BR')
  .command('$0 <source> <destination> [options]', 'Converte arquivos markdown para componentes Angular utilizando a biblioteca THF', args => {
    return args
      .positional('source', { describe: 'Diretório de origem dos arquivos markdown', type: 'string' })
      .positional('destination', { describe: 'Diretório de destino dos componentes Angular', type: 'string' });
  })
  .options({
    portinariUi: {
      describe: 'Verdadeiro para criar os componentes utilizando o visual do PortinariUi.',
      type: 'boolean'
    },
    exclusions: {
      describe: 'Lista com os arquivos markdown que serão desconsiderados da conversão.',
      type: 'array'
    },
    highlightClassName: {
      describe: 'Nome da classe que será utilizada nos trechos contendo códigos de exemplos.',
      type: 'string'
    },
    flatDirs: {
      describe: 'Se verdadeiro, criará todas as pastas de componente na pasta raíz de destino.',
      type: 'boolean'
    },
    createHelpers: {
      describe: 'Se verdadeiro, irá criar os arquivos auxiliares de module, routing e service.',
      type: 'boolean'
    },
    moduleName: {
      describe: 'Nome do módulo Angular que será criado para agrupar os componentes gerados.',
      type: 'string'
    },
    parentRoutePath: {
      describe: 'Caminho da rota pai que será utilizado para as rotas dos componentes.',
      type: 'string'
    },
    copyExternalFiles: {
      describe:
        'Se verdadeiro, irá copiar os arquivos externos referenciados nos arquivos markdown para uma pasta de recursos.',
      type: 'boolean'
    },
    resourceFolderName: {
      describe: 'Nome da pasta que será criada para armazenar os arquivos externos.',
      type: 'string'
    },
    resourcePathName: {
      describe: 'Caminho que será utilizado para referenciar os arquivos externos copiados durante a conversão dos arquivos markdown.',
      type: 'string'
    }
  })
  .help().argv;

const options: Options = {};
options.portinariUi = argv.portinariUi;
options.exclusions = argv.exclusions as string[];
options.highlightClassName = argv.highlightClassName;
options.flatDirs = argv.flatDirs;
options.createHelpers = argv.createHelpers;
options.moduleName = argv.moduleName;
options.copyExternalFiles = argv.copyExternalFiles;
options.parentRoutePath = argv.parentRoutePath;
options.resourceFolderName = argv.resourceFolderName;
options.resourcePathName = argv.resourcePathName;

md2thf(argv.source as string, argv.destination as string, options);
