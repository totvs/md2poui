#! /usr/bin/env node
import yargs from 'yargs';

import md2thf from '..';
import { Options } from '../options';

const argv = yargs
  .locale('pt_BR')
  .command('$0 <srcPath> <destDir> [options]', 'Conversor de markdown para PortinariUI', args => {
    return args
      .positional('srcPath', { describe: 'Caminho de origem dos arquivos markdown', type: 'string' })
      .positional('destDir', { describe: 'Diretório de destino dos componentes Angular', type: 'string' });
  })
  .options({
    exclusions: {
      describe: 'Lista dos arquivos/diretórios desconsiderados na conversão.',
      type: 'array'
    },
    highlightClassName: {
      describe: 'Nome da classe CSS utilizada nos elementos contendo códigos de exemplos.',
      type: 'string'
    },
    flatDirs: {
      describe: 'Cria todas as pastas de componentes na pasta raíz de destino.',
      type: 'boolean'
    },
    recursive: {
      describe: 'Lê recursivamente as pastas abaixo da pasta de origem.',
      type: 'boolean'
    },
    createHelpers: {
      describe: 'Cria os arquivos auxiliares de module, routing e service.',
      type: 'boolean'
    },
    moduleName: {
      describe: 'Nome do módulo Angular para agrupar os componentes.',
      type: 'string'
    },
    parentRoutePath: {
      describe: 'Caminho da rota pai utilizado para as rotas dos componentes.',
      type: 'string'
    },
    copyExternalFiles: {
      describe: 'Copia os arquivos externos referenciados nos arquivos markdown.',
      type: 'boolean'
    },
    resourceFolderName: {
      describe: 'Nome da pasta de armazenamento dos arquivos externos copiados.',
      type: 'string'
    },
    resourcePathName: {
      describe: 'Caminho utilizado para referenciar os arquivos externos nos componentes.',
      type: 'string'
    }
  })
  .help().argv;

const options: Options = {};
options.exclusions = argv.exclusions as string[];
options.highlightClassName = argv.highlightClassName;
options.flatDirs = argv.flatDirs;
options.recursive = argv.recursive;
options.createHelpers = argv.createHelpers;
options.moduleName = argv.moduleName;
options.parentRoutePath = argv.parentRoutePath;
options.copyExternalFiles = argv.copyExternalFiles;
options.resourceFolderName = argv.resourceFolderName;
options.resourcePathName = argv.resourcePathName;

md2thf(argv.source as string, argv.destination as string, options);
