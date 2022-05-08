# Description

基于开源项目[youtubeclone-backend](https://github.com/manikandanraji/youtubeclone-backend)，使用Egg.js框架实现和扩展了原项目，并基于apifox整理了[API文档](https://www.apifox.cn/apidoc/shared-fcc7f6f5-a431-4d01-a0f9-24298b54cc27)。
- 视频资源管理：阿里云vod视频点播服务
- 数据库：MongoDB + egg-mongoose
- jwt缓存加速：Redis + egg-redis

### Config-配置

本地启动需要在config文件夹下新建secret.js文件，用于设置阿里云vod接入信息、Redis连接、MongoDB连接：
```
module.exports = {
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  mongodbDevUri: 'mongodb://127.0.0.1:27017/youtubeclone-dev',
  mongodbTestUri: 'mongodb://127.0.0.1:27017/youtubeclone-test',
  mongodbProdUri: 'mongodb://127.0.0.1:27017/youtubeclone-prod',
  redisHost: '127.0.0.1'
};

```

### Development-本地开发

```bash
$ npm i
$ npm run dev
```

### Testing-运行单元测试
```bash
$ npm i
$ npm run test
```


### Deploy-本地部署

```bash
$ npm start
$ npm stop
```
