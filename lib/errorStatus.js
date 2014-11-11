module.exports=paraWrong;
function paraWrong(){
    return function *(next){
        yield next;
        if(this.status == 400){
            this.type = 'html';
            this.body = '<p>微信登陆失败</p>';
        }
        if(this.status == 200){
            this.type = 'html';
            this.body = '<p>微信登陆成功</p>';
        }
    }
}
