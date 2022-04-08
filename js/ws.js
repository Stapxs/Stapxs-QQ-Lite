/*
    ws.js - WS 主方法
    2022/04/05 - Stapx Steve [林槐]
*/

window.ws = null

function runWs() {

    setStatue("load", "正在尝试连接到服务 ……")
    const address = document.getElementById("sev_address").value
    window.token = document.getElementById("access_token").value

    window.ws = new WebSocket("ws://" + address + "?access_token=" + token)

    window.ws.onopen = function (evt) {
        setStatue("ok", "成功连接 ……")
        showLog("7abb7e", "fff", "WS", "成功连接 ……")
        window.connect = true
        // 清空消息历史
        document.getElementById("msg-body").innerHTML = ""
        // 修改按钮
        document.getElementById("login-btn").innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z\"/></svg>"
        document.getElementById("login-btn").title = "断开"
        // 开始加载数据
        loadInfo()
    }

    window.ws.onmessage = function (evt) {
        showLog("4a93c3", "fff", "GET", evt.data)
        runJSON(evt.data)
    }

    window.ws.onclose = function (evt) {
        showLog("ff5370", "fff", "WS", "连接关闭：" + evt.code)
        setStatue("err", "连接关闭：" + evt.code)
        document.getElementById("login-btn").title = "登录"
        document.getElementById("login-btn").innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M344.7 238.5l-144.1-136C193.7 95.97 183.4 94.17 174.6 97.95C165.8 101.8 160.1 110.4 160.1 120V192H32.02C14.33 192 0 206.3 0 224v64c0 17.68 14.33 32 32.02 32h128.1v72c0 9.578 5.707 18.25 14.51 22.05c8.803 3.781 19.03 1.984 26-4.594l144.1-136C354.3 264.4 354.3 247.6 344.7 238.5zM416 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c17.67 0 32 14.33 32 32v256c0 17.67-14.33 32-32 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c53.02 0 96-42.98 96-96V128C512 74.98 469 32 416 32z\"/></svg>"
        window.connect = false
        // 显示底栏
            document.getElementById("footer").style.display = "block"
            document.getElementById("main-view").style.height  = "calc(100vh - 100px)"
        setTimeout(() => {
            document.getElementById("footer").style.transform = "translate(0)"
        }, 100)
    }
}

// 分发指令
function runJSON(json) {
    const msg = JSON.parse(json)
    if(msg.echo != undefined) {
        // 触发事件
        switch(msg.echo) {
            case "get_friend_list": setFriendList(msg.data); break                                          // 获取好友列表
            case "get_group_list": setGroupList(msg.data); break                                            // 获取群列表
            case "get_login_info": setUserInfo(msg.data); break                                             // 获取用户信息
            case "get_chat_history_fist": firstLoadingMsg(msg); break                                       // 首次获取历史消息（20）
            case "get_chat_history": loadingMoreMsg(msg); break                                             // 获取更多历史消息
            case "send_msg": sendMsgBack(msg.data.message_id); break                                        // 发送消息回调
            case "get_send_msg": {                                                                          // 打印发送回调消息
                                    if(msg.retcode ===0) {
                                        printMsg(msg.data, null)
                                        document.getElementById("msg-body").scrollTop = document.getElementById("msg-body").scrollHeight
                                    }
                                    break
                                 }
            default: {
                // 处理其他特殊的返回
                if(msg.echo.indexOf("get_rep_msg_") >= 0) {
                    // 刷新回复原消息体
                    const raw = getMsgRawTxt(msg.data.message)
                    updateReplyBody(msg.echo, raw==null?msg.raw_message:raw)
                }
            }
        }
    } else {
        switch(msg.post_type) {
            case "message": updateMsg(msg); break                                                           // 通知消息
            case "notice": runNotice(msg); break                                                            // 服务端通知
        }
    }
}

// 将消息发送为浏览器通知
function showNotice(msg) {
    try {
        // 检查通知权限，注意 “老旧” 浏览器不支持这个功能
        if(Notification.permission == "default") {
            // 还没有请求过权限
            // 请求权限
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                  Notification.permission = status
                }
              });
        } else if(Notification.permission == "denied") {
            // 用户拒绝了权限
            return
        } else {        
            // 显示通知，不管之前有没有同意，反正我是发了（大声
            const raw = getMsgRawTxt(msg.message)
            let notification = new Notification(msg.sender.nickname, {"body": raw==""?msg.raw_message:raw, "tag": msg.message_id, "icon": "https://q1.qlogo.cn/g?b=qq&s=0&nk=" + msg.user_id})
        }
    }
    catch(e) {
        console.log(e)
    }
}

// 加载基础数据
function loadInfo() {
    // 加载用户信息
    let json = createAPI(
        "get_login_info",
        null, null
    )
    sendWs(json)
    // 清空列表
    document.getElementById("friend-list-body").innerHTML = ""
    // 加载好友列表
    json = createAPI(
        "get_friend_list",
        null, null
    )
    sendWs(json)
    // 加载群列表
    json = createAPI(
        "get_group_list",
        null, null
    )
    sendWs(json)
}

// ----------------------------------------
// 子功能函数
// ----------------------------------------

function findBodyInList(name, id) {
    const childs =  document.getElementById("friend-list-body").children
    for(let i=0; i<childs.length; i++) {
        if(id != null && childs[i].dataset.id == id || name != null && childs[i].dataset.name == name) {
            return childs[i]
        }
    }
    return null
}

function findMsgInList(id) {
    const childs = document.getElementById("msg-body").children
    for(let i=0; i<childs.length; i++) {
        if(id == childs[i].dataset.id) {
            return childs[i]
        }
    }
    return null
}

// 获取消息有效文本
function getMsgRawTxt(message) {
    let back = ""
    for(let i=0; i<message.length; i++) {
        if(message[i].type == "text")  {
            back += message[i].data.text + " "
        }
    }
    return back
}


// ----------------------------------------
// 功能辅助函数
// ----------------------------------------

// 构造 API 传参 JSON
function createAPI(action, params, echo) {
    // {
    //     "action": "send_private_msg",
    //     "params": {
    //         "user_id": 10001000,
    //         "message": "你好"
    //     },
    //     "echo": "123"
    // }
    let apiObj = {}
    apiObj.action = action
    if(params == null) {
        apiObj.params = {}
    } else {
        apiObj.params = params
    }
    if(echo == null) {
        apiObj.echo = action
    } else {
        apiObj.echo = echo
    }
    return JSON.stringify(apiObj)
}

// 发送消息封装
function sendWs(str) {
    window.ws.send(str)
    showLog("7abb7e", "fff", "PUT", str)
}

function getMsgIdInfo(msg_id, type) {
    var binary_string = window.atob(msg_id)
    var len = binary_string.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    var buffer = bytes.buffer
    var dv = new DataView(buffer, 0)

    const back = []
    if(type === "friend") {
        back.push(dv.getInt32(0))           // 对方QQ(int32)
        back.push(dv.getInt32(4))           // 消息编号(int32)
        back.push(dv.getInt32(8))           // 随机数(int32)
        back.push(dv.getInt32(12))          // 时间戳(int32)
        back.push(dv.getInt8(16))           // 发送flag(int8)
    } else {
        back.push(dv.getInt32(0))           // 群号(int32)
        back.push(dv.getInt32(4))           // 发送者QQ(int32)
        back.push(dv.getInt32(8))           // 消息编号(int32)
        back.push(dv.getInt32(12))          // 随机数(int32)
        back.push(dv.getInt32(16))          // 时间戳(int32)
        back.push(dv.getInt8(20))           // 分片数(int8)
    }
    return back
}

function buildMsgIdInfo(buffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i=0; i<len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}