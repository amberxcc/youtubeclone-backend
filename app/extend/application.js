const RPCClient = require('@alicloud/pop-core').RPCClient;
const {accessKeyId, accessKeySecret} = require('../../config/config.local')

function initVodClient(accessKeyId, accessKeySecret, ) {
    const regionId = 'cn-shanghai'; // 点播服务接入地域
    const client = new RPCClient({ //填入AccessKey信息
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
        apiVersion: '2017-03-21'
    });

    return client;
}

let vodClient = null


module.exports = {
    get vodClient(){
        if(!vodClient) {
            vodClient = initVodClient(accessKeyId, accessKeySecret)
        }
        return vodClient
    }
}

