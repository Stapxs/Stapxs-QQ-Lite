// gocqhttp, message_id = global_id
const gocqhttpApi = {
    name: "gocqhttp",
    parseMsg: function (msg) {
        if (msg.post_type !== 'meta_event') {
            console.log('GET：')
            console.log(msg)
        }
        switch (msg.post_type) {
            case "message": updateMsg(msg); break                                                           // 通知消息
            case "notice": runNotice(msg); break                                                            // 服务端通知
            // gocqhttp
            case "meta_event": metaEvent(msg); break
            case "message_sent": updateMsg(msg); break
        }
    },
    createApi: function (action, params = {}, echo) {
        let apiObj = {}
        switch (action) {
            case "get_chat_history": action = "get_msg_history"; break
            case "send_msg": action = "send_msg"; echo = 'send_not_msgback'; break // 不产生回调
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
    sendWs: function (action, params, echo) { // 发送消息封装
        str = this.createApi(action, params, echo)
        console.log('PUT：'+str)
        window.ws.send(str)
        showLog("7abb7e", "fff", "PUT", str)
    },
    sortMsg: function (msgs) {
        return msgs.reverse()
    },
    convertMsg: function (msg) { // 消息转成 oicq 的形式
        return msg
    }
}