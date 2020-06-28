## mock数据

#### 准备工作
在项目目录创建一个mock-config.json文件，mock的数据会根据此文件的信息在该项目目录下生成一个mock的文件夹，生成的文件会根据接口名字生成，mock-config.json配置文件格式：
```json
{
  "port": 8080,
  "interfaces": [
    {
      "defaultLink": "/ac/user",
      "desc": "测试",
      "docURL": "",
      "isCustom": ""
    },
}
```

#### 安装命令

```javascript
npm install gsg-mock@latest -g
```

#### 项目命令

##### 1.启动本地服务，并且根据目录生成mock数据， port可传可不传
```javascript
gmock start [port]
```

##### 2.启动本地服务，port可传可不传
```javascript
gmock server [port]
```

##### 3.生成mock数据
```javascript
gmock craw
```

#### 配置参数详解

1. port

 + type：number
 + default: null
 + desc: 默认端口号，若启动命令不带端口就用此端口号

2. defaultLink

 + type：String
 + default: null
 + desc: 请求的接口相对地址，可以不配，会根据文档自动抓取，倘若文档没这个接口或者自定义接口，需要自己配置

3. desc

 + type：String
 + default: null
 + desc: 接口描述或名字，建议配上，便于自己识别

4. docURL

 + type：String
 + default: null
 + desc: 文档地址，若不配的话，需要配置defaultLink和isCustom，自定义接口名，并且需要自己把所需要的数据放到指定文件夹

5. isCustom

 + type：String
 + default: null
 + desc: 若配上这个的话，即完全自定义需要配置defaultLink， 且数据需要自己准备


