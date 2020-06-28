/*
* 获取本地配置
* */
const fs = require('fs');
const chalk = require('chalk');
const {craw, generateData} = require('./craw');
const {generate_data_folder, config_file_name} = require('./config');
const {isFileExisted} = require('../utils/index');

console.log(chalk.green('================读取本地配置中======================'));
// 读取配置
fs.readFile(`${process.cwd()}/${config_file_name}`, "utf-8", async (error, data) => {
    if (error)  {
        console.log(chalk.red('================读取本地文件失败，请重试======================'));
    }
    try {
        const isExist = await isFileExisted(`${process.cwd()}${generate_data_folder}`);
        if (!isExist) {
            fs.mkdirSync(`${process.cwd()}${generate_data_folder}`);
        }
    } catch (e) {
        console.log(chalk.red('===================生成目录有问题==========='));
    }
    const config = JSON.parse(data);
    const {interfaces} = config;

    interfaces.forEach(async item => {
        const {defaultLink, docURL, isCustom} = item;
        // 自定义接口(不会根据doc更新而变动)
        if (isCustom && defaultLink) {
            generateData('', defaultLink);
        } else {
            docURL && craw({docURL, defaultLink});
        }
    })
});


