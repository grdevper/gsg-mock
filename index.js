#!/usr/bin/env node
const commander = require('commander');
const pack = require('./package.json');
const chalk = require('chalk');
const server = require('./bin/server');

commander
    .version(pack.version, '-v, --version')
    .usage('<command> [options]')
    .description(chalk.yellow('mock工具' + pack.version));

commander.command('start [port]')
    .description(chalk.green('启动本地服务，并生成mock数据'))
    .action(function (port) {
        server(port, false)
    });

commander.command('server [port]')
    .description(chalk.green('启动本地服务'))
    .action(function (port) {
        server(port, true)
    });

commander.command('craw')
    .description(chalk.green('生成mock数据'))
    .action(function () {
        require('./bin/entry');
    });

commander.command('-h, --help')
    .action(function () {
      commander.help();
    });

commander.parse(process.argv);

