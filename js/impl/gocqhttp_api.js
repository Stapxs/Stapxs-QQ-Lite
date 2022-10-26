// gocqhttp, message_id = global_id
const gocqhttpApi = {
    name: "gocqhttp",
    createApi: function (action, params = {}, echo) {
        let apiObj = {}
        switch (action) {
            case "get_chat_history": action = "get_msg_history"; break
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