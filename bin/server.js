// 本地服务
const Koa = require('koa');
const cors = require('koa2-cors');
const send = require('koa-send');
const chalk = require('chalk');
const app = new Koa();
const childProcess = require('child_process');
const fs = require('fs');
const {config_file_name} = require('./config');


module.exports = function (command_port, server_only) {
    const contentText = fs.readFileSync(`${process.cwd()}/${config_file_name}`,'utf-8');
    const {port} = JSON.parse(contentText);
    if(!command_port) {
      command_port = port;
    }
    if (!server_only) {
        const worker = childProcess.fork(`${__dirname}/entry.js`);
         // 子进程退出后，退出当前进程；
        worker.on('exit', function (code) {
            process.exit(code);
        });
    }

    app.use(cors());
    app.use(async (ctx) => {
        const {path} = ctx;
        if (path == '/' || path == '/favicon.ico') {
            return ctx.body = '欢迎使用mock';
        }
        let real_path = path.split('/').join('_');
        real_path = `/mock/${real_path}.json`;
        await send(ctx, real_path);
    });

    app.listen(command_port);
    console.log(chalk.green(`====================listening on port ${command_port}`));

}
