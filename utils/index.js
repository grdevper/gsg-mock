const fs = require("fs");
const inquirer = require('inquirer');

// 检测目录是否存在
function isFileExisted(path_way) {
    return new Promise((resolve, reject) => {
        fs.access(path_way, (err) => {
            if (err) {
                resolve(false);//"不存在"
            } else {
                resolve(true);//"存在"
            }
        })
    })
};

function inquiry() {
    const promptList = [{
        type: 'input',
        message: '请输入用户名:',
        name: 'os_username',
    },{
        type: 'password',
        message: '请输入密码:',
        name: 'os_password',
    }];
    return new Promise((resolve, reject) => {
        inquirer.prompt(promptList).then(answers => {
          resolve(answers);
        })
    })
}

function loginORnot() {
    return new Promise(resolve => {
        inquirer.prompt([ {
            type: 'confirm',
            name: 're_login',
            message: '重新登录?',
            default: true
        }]).then((answers) => {
          resolve(answers);
        })
    })
}

module.exports = {
  isFileExisted,
  inquiry,
  loginORnot
};
