/**
 *
 * Created by lilun on 14-10-19.
 *
 * 这个模块用于向用户请求微信授权后与微信平台进行code、accessToken交互及获取的模块。
 */
var request = require('co-request');
module.exports = getWechatAuths;

function getWechatAuths(appid_, secret_) {
    if (appid_ && secret_) {
        appid = appid_;
        secret = secret_;
    } else {
        return function *(next)
        {
            this.status = 400;
            console.log('参数错误');
            yield next;
        }
    }
    return function *(next)
    {
        var code = yield getCode(this);
        console.log("getcode: " + code);
        var res = yield getAccess_token(code);
        if (res == null) return this.status = 400;
        console.log("access_token: " + res.access_token);
        console.log("openid: " + res.openid);
        var userBase = yield getInfo(res.access_token, res.openid);
        if (userBase = null)return this.status = 400;
        this.status = 200;
        yield next;
    }
}


function * getCode(ctx)
{
    var data = ctx.query;
    var code = data.code;
    //console.log("code: "+code);
    return code;
}

function * getAccess_token(code)
{
    var u = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
    try {
        var result = yield request({
            uri: u,
            method: 'GET',
            timeout: 5000});
        var response = result;
        var body = result.body;
        var data = JSON.parse(body);
        if (result.statusCode == 200 && data.errcode === undefined) {
            var res = {};
            res.access_token = data.access_token;
            res.openid = data.openid;
            return res;
        }
        return null;
    } catch (e) {
        console.log('getAccess_token wrong');
        return null;
    }
}

function * getInfo(access_token, openid)
{
    try {
        var u = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
        var result = yield request({
            uri: u,
            method: 'GET',
            timeout: 5000});
        var response = result;
        var body = result.body;
        console.log(body);
        var data = JSON.parse(body);
        if (result.statusCode == 200 && data.errcode === undefined)
            return data;

        return null;
    } catch (e) {
        return null;
    }
}

