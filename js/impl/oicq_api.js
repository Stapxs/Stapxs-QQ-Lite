// 构造 API 传参 JSON
const oicqApi = {
    name: "oicq",
    parseMsg: function (msg) {
        switch (msg.post_type) {
            case "message": updateMsg(msg); break                                                           // 通知消息
            case "notice": runNotice(msg); break                                                            // 服务端通知
        }
    },
    createApi: function (action, params = {}, echo) {
        let apiObj = {}
        switch (action) {
            case "get_chat_history": msg_id = params["message_id"]; params = { "message_id": msg_id }; break // 不清楚 oicq 能否解析有多余参数的情况，先去除多余参数
        }
        apiObj.action = action
        apiObj.params = params
        if (echo == null) {
            apiObj.echo = action
        } else {
            apiObj.echo = echo
        }
        return JSON.stringify(apiObj)
    },
    // 发送消息封装
    sendWs: function (action, params, echo) {
        let str = this.createApi(action, params, echo)
        window.ws.send(str)
        showLog("7abb7e", "fff", "PUT", str)
    },
    sortMsg: function (msg) {
        return msg
    },
    convertMsg: function (msg) { // 消息转成 oicq 的形式
        return msg
    }
}