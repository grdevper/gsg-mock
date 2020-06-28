//导入依赖包
const fs = require("fs");
const request = require('request');
const superagent = require("superagent");
const cheerio = require("cheerio");
const {login_key, loginUrl, generate_data_folder} = require('./config');
const chalk = require('chalk');
const {isFileExisted, inquiry, loginORnot} = require('../utils/index');

//.set("Cookie", "jira.editor.user.mode=wysiwyg; seraph.rememberme.cookie=13216%3A91e8bc64e8accf1aeb7aed04065b825166b67ef0; atlassian.xsrf.token=BMAU-S926-6XHG-ROA8|cbdc38950f451c0a9a17da48712a98fa27ff8ad4|lin; JSESSIONID=4EADAAA91A0EF9CF5B8EC895ADBDD35C")

// 登录
async function login(config) {
    const {docURL, defaultLink} = config;
    const {os_username, os_password} = await inquiry();
    //const {os_username, os_password} = {}
    if(!os_username || !os_password) {
      console.log(chalk.red('=================用户名和密码不能为空'));
      return;
    }
    request
    .post({
        url: loginUrl,
        form: {
            os_username,
            os_password,
            login: '登录',
        }
    },async function(error, response, body) {
        if (body.indexOf(login_key) > -1) {
            console.log(chalk.red('================登录失败，检查你的信息是否正确======================'));
            const {re_login} = await loginORnot();
            if(re_login) {
              login(config);
            }
        } else {
            // 登录成功获取，获取请求头的登录信息
            const {rawHeaders} = response;
            for (let item of rawHeaders) {
                if(item.indexOf('JSESSIONID') > -1) {
                    global.doc_session_key = item.split(';')[0];
                    break;
                }
            }
            craw({docURL, defaultLink});
        }
    })
}

async function craw (config) {
    const {docURL, defaultLink} = config;
    const cookie = `jira.editor.user.mode=wysiwyg; seraph.rememberme.cookie=13216%3A91e8bc64e8accf1aeb7aed04065b825166b67ef0; atlassian.xsrf.token=BMAU-S926-6XHG-ROA8|cbdc38950f451c0a9a17da48712a98fa27ff8ad4|lin; ${global.doc_session_key}`;
    superagent
        .get(docURL)
        .set("Cookie", cookie)
        .end(async function(error, response) {
            const content = response.text;
            if (content.indexOf(login_key) > -1) {
                console.log(chalk.red('==============请先登录============='));
                await login({docURL, defaultLink});
            } else {
                const $ = cheerio.load(content);
                generateData($, defaultLink);
            }
        });
}

// 生成数据
async function generateData ($, defaultLink) {
    let fileName;
    let requestType = 'get';
    let content = '';
    defaultLink = defaultLink.split('/').join('_')
    if ($) {
        $('.relative-table.wrapped.confluenceTable tbody td').each(function (i, elem) {
            if ($(this).text() == '请求地址') {
                fileName = defaultLink || $(this).next().text().split('/').join('_');
            }
            if ($(this).text() == '请求方式') {
                requestType = $(this).next().text();
            }
        });
        content = $('.codeContent').last().text();
    } else {
       fileName = defaultLink;
       content = '{}';
    }
    fileName = `${process.cwd()}${generate_data_folder}/${fileName}.json`;

    // 已生成的文件，默认不再次生成，避免开销
    const isExist_mock_file = await isFileExisted(fileName);

    if (isExist_mock_file) {
        if (!$) {
            console.log(chalk.green(`===============自定义接口文件${fileName}已存在=================`));
        } else {
            console.log(chalk.green(`===============远程后端接口文件${fileName}已存在=================`));
        }
        return;
    };
    fs.writeFile(fileName, content, 'utf-8', error => {
       if(!error) {
          console.log(chalk.green(`==============${fileName}生成成功============`));
       } else {
          console.log(chalk.red(`==============${fileName}生成失败============`));
       }
    })
}

module.exports = {craw, generateData};
