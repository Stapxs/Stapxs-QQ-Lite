window.ws = null

function runWs() {

    setStatue("load", "正在尝试连接到服务 ……")
    const address = document.getElementById("sev_address").value
    window.token = document.getElementById("access_token").value

    window.ws = new WebSocket(address + "?access_token=" + token)

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
            document.getElementById("main-view").style.height  = "calc(100vh - 137px)"
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
                                        printMsg(msg.data[0], null)
                                        document.getElementById("msg-body").scrollTop = document.getElementById("msg-body").scrollHeight
                                    }
                                    break
                                 }
        }
    } else {
        switch(msg.post_type) {
            case "message": updateMsg(msg); break                                                           // 通知消息
            case "notice": runNotice(msg); break                                                            // 服务端通知
        }
    }
}

// 处理通知消息
function runNotice(msg) {
    switch(msg.sub_type) {
        case "recall": {
            // 撤回消息
            // 判断目标
            const id = msg.notice_type == "group"?msg.group_id:msg.user_id
            console.log(id + " / " + document.getElementById("msg-hander").dataset.id)
            if(Number(id) == Number(document.getElementById("msg-hander").dataset.id)) {
                // 隐藏消息
                findMsgInList(msg.message_id).style.display = "none"
            }
            // 尝试撤回通知
            // let notification = new Notification("消息被撤回", {"tag": msg.message_id})
        }
    }
}

// 刷新消息
function updateMsg(msg) {
    const list = document.getElementById("friend-list-body")
    const id = msg.message_type == "group" ? msg.group_id:msg.user_id
    const raw = getMsgRawTxt(msg.message)
    // 刷新列表显示消息
    findBodyInList(null, id).children[2].children[1].innerText = raw==""?msg.raw_message:raw
    // 获取当前打开的窗口 ID
    const nowSee = document.getElementById("msg-hander").dataset.id
    // 刷新当前打开的窗口
    if(nowSee == id) {
        // 如果消息本来就在底部就准备下滚
        let scroll = false
        const body = document.getElementById("msg-body")
        if(body.scrollHeight - body.scrollTop === body.clientHeight) {
            scroll = true
        }
        printMsg(msg)
        // 显示边框高亮
        lightChatBorder()
        // 滚动屏幕
        if(scroll == true) {
            body.scrollTop = body.scrollHeight
        }
    }
    // 刷新列表
    findBodyInList(null, id).style.transform = "translate(0, -50%)"
    if(msg.message_type != "group") {
        // 尝试通过浏览器通知用户
        showNotice(msg)
        // 如果当前消息并没有打开，则置顶列表项（对群组无效）
        list.insertBefore(findBodyInList(null, id), list.firstChild)
        setTimeout(() => {
            findBodyInList(null, id).style.transform = "translate(0, 0)"
        }, 10)
        setTimeout(() => {
            findBodyInList(null, id).children[0].style.transform = "scaleY(0.5)"
            findBodyInList(null, id).style.transform = "translate(0, 0)"
        }, 300)
    } else {
        // 如果是群组，置顶到最新的置顶消息下面，不提醒
        // 寻找最新的置顶消息
        for(let i=0; i<list.children.length; i++) {
            if(list.children[i].children[0].style.transform !== "scaleY(0.5)") {
                list.insertBefore(findBodyInList(null, id), list.children[i])
                setTimeout(() => {
                    findBodyInList(null, id).style.transform = "translate(0, 0)"
                }, 10)
                break
            }
        }
        //判断 at
        if(msg.atme) {
            showNotice(msg)
        }
    }
}

// 将消息发送为浏览器通知
function showNotice(msg) {
    try {
        console.log(Notification.permission)
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
        }
        // 显示通知，不管之前有没有同意，反正我是发了（大声
        const raw = getMsgRawTxt(msg.message)
        let notification = new Notification(msg.sender.nickname, {"body": raw==""?msg.raw_message:raw, "tag": msg.message_id, "icon": "https://q1.qlogo.cn/g?b=qq&s=0&nk=" + msg.user_id})
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

// 显示消息
function printMsg(obj, addTo) {
    try {
        // 消息未被屏蔽
        if(obj.block == undefined || !Boolean(obj.block)) {
            // 创建时间标记
            if(document.getElementById('msg-body').lastChild != null &&
                Number(obj.time) - Number(document.getElementById('msg-body').lastChild.dataset.time) > 300) {
                var unixTimestamp = new Date(Number(obj.time) * 1000)
                const note = document.createElement("div")
                note.classList.add("note-base")
                note.innerHTML = "<a class='note-time'>" + unixTimestamp.toLocaleString() + "</a>"
                document.getElementById("msg-body").appendChild(note)
            }
            // 创建消息外壳
            // <div class="message">
            //     <img src="https://q1.qlogo.cn/g?b=qq&s=0&nk=1007028430">
            //     <div class="message-body">
            //         <a>林小槐</a>
            //         <div></div>
            //     </div>
            //     <div class="message-space"></div>
            // </div>
            const div = document.createElement("div")
            div.classList.add("message")
            div.dataset.id = obj.message_id                     // 消息编号
            div.dataset.sender = obj.sender.user_id             // 用户 ID
            div.dataset.time = obj.time                         // 消息时间
            let html = String.raw`<img src="https://q1.qlogo.cn/g?b=qq&s=0&nk={id}" style="{hidden}">
        <div class="message-space" style="{space}"></div>
        <div class="message-body">
            <a style="{hidden}">{name}</a>
            <div style="{mine}">{body}</div>
        </div>`
            html = html.replace("{id}", obj.sender.user_id)
            let name = obj.sender.nickname
            if(obj.message_type=="group" && obj.sender.card!=obj.sender.nickname && obj.sender.card!="") {
                name = obj.sender.card
            }
            html = html.replace("{name}", name)
            html = html.replace("{space}", obj.sender.user_id==window.login_id?"":"flex:unset;")
            html = html.replaceAll("{hidden}", obj.sender.user_id==window.login_id?"display:none;":"")
            html = html.replace("{mine}", obj.sender.user_id==window.login_id?"background: var(--color-main);color: var(--color-font-r);":"")
            // 遍历消息体
            let body = ""
            for(let i=0; i<obj.message.length; i++) {
                let nowBreak = false
                switch(obj.message[i].type) {
                    case "reply": { if(obj.message[i+1].type == "at")obj.message[i+1].type = "pass";body = printReplay(obj.message[i].data.id) + body; break }
                    case "text": body = body + printText(obj.message[i].data.text); break
                    case "image": body = body + printImg(obj.message[i].data.url); break
                    case "face": body = body + printFace(obj.message[i].data.id, obj.message[i].data.text); break
                    case "at": body = body + printAt(obj.message[i].data.text, obj.message[i].data.qq); break
                    case "xml": body = body + printXML(obj.message[i].data.data, obj.message[i].data.type); break
                    case "record": body = body + printRecord(obj.message[i].data.url); break
                    case "pass": break
                    default: {
                        nowBreak = true
                        body = "<a class='msg-unknow'>（不支持的消息：" + obj.message[i].type + "）</a>"
                    }
                }
                if(nowBreak) {
                    break
                }
            }
            html = html.replace("{body}", body)
            div.innerHTML = html
            div.oncontextmenu = function()                  { return false; }                               // 阻止右击菜单
            div.onmousedown = function()                    { msgMouseDown(div, event); }                   // 右击判定
            div.addEventListener("touchstart", function()   { msgTouchDown(div, event); }, false)           // 长按判定（开始）
            div.addEventListener("touchend", function()     { msgTouchEnd(event); }, false)                 // 长按判定（结束）
            div.addEventListener("touchmove", function()     { msgTouchMove(event); }, false)                // 长按判定（结束）

            const raw = getMsgRawTxt(obj.message)
            div.dataset.raw = raw == ""?obj.raw_message:raw
            // 添加到消息列表内
            if(addTo == null) {
                document.getElementById("msg-body").appendChild(div)
                // TODO：显示新消息标志
            } else {
                document.getElementById("msg-body").insertBefore(div, addTo)
            }
        }
    } catch(e) {
        showLog("ff5370", "fff", "CORE", "显示消息错误：" + JSON.stringify(obj))
        console.error(e)
    }
}

// ----------------------------------------
// 子功能函数
// ----------------------------------------

// 发送消息回调
function sendMsgBack(msgId) {
    if(msgId != undefined) {
        // 请求消息内容
        sendWs(
            createAPI(
                "get_chat_history",
                {"message_id":msgId, "count": 1},
                "get_send_msg"
            )
        )
        setStatue("ok", "发送消息完成！")
    } else {
        setStatue("err", "发送消息错误：oicq 并未返回消息编号 :(")
    }
}

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

function firstLoadingMsg(msg) {
    if(msg.retcode === 0) {
        const data = msg.data
        // 遍历消息
        for(let i=0; i<data.length; i++) {
            printMsg(data[i], null)
        }
        document.getElementById("msg-body").scrollTop = document.getElementById("msg-body").scrollHeight
        setStatue("ok", "加载历史消息完成！")
    } else {
        // 获取失败
        setStatue("err", "加载历史消息失败，可能是没有历史消息。")
    }
}

function loadingMoreMsg(msg) {
    if(msg.retcode === 0) {
        const where = document.getElementById("msg-body").firstChild
        const data = msg.data
        // 遍历消息
        for(let i=data.length-2; i>0; i--) {
            // 获取插入位置
            printMsg(data[i], document.getElementById("msg-body").firstChild)
        }
        setStatue("ok", "加载历史消息完成！")
        // 滚动到之前位置
        scrollToMsg(where)
    } else {
        // 获取失败
        setStatue("err", "加载历史消息失败，可能是没有历史消息。")
    }
}

function setUserInfo(data) {
    window.login_id = data.user_id
    document.getElementById("main-src").src = "https://q1.qlogo.cn/g?b=qq&s=0&nk=" + data.user_id
    document.getElementById("main-name").innerText = data.nickname
}

function setFriendList(data) {
    // 遍历列表
    // <div class="friend-body" data-id="1007028430" data-type="friend">
    //     <img src="https://q1.qlogo.cn/g?b=qq&s=0&nk=1007028430">
    //     <div>
    //         <p>林小槐（木）</p>
    //         <a>你是不是闲着无聊</a>
    //     </div>
    //     <a>23:50</a>
    // </div>
    for(let i=0; i<data.length; i++) {
        const div = document.createElement("div")
        div.classList.add("friend-body")
        div.dataset.id = data[i].user_id
        div.dataset.name = data[i].nickname
        div.dataset.type = "friend"
        div.onclick = function() { onListClick(div) }
        // 添加内容
        div.innerHTML = "<div></div><img src='https://q1.qlogo.cn/g?b=qq&s=0&nk=" + data[i].user_id + "'>" +
                        "<div><p>" + (data[i].remark === data[i].nickname ? data[i].nickname : data[i].remark + "（" + data[i].nickname + "）") + "</p><a></a></div>" + 
                        "<a></a>"
        // 添加到元素内
        document.getElementById("friend-list-body").appendChild(div)
    }
}

function setGroupList(data) {
    for(let i=0; i<data.length; i++) {
        const div = document.createElement("div")
        div.classList.add("friend-body")
        div.dataset.id = data[i].group_id
        div.dataset.name = data[i].group_name
        div.dataset.type = "group"
        div.onclick = function() { onListClick(div) }
        // 添加内容
        div.innerHTML = "<div></div><img src='https://p.qlogo.cn/gh/" + data[i].group_id + "/" + data[i].group_id + "/0'>" +
                        "<div><p>" + data[i].group_name + "</p><a></a></div>" + 
                        "<a></a>"
        // 添加到元素内
        document.getElementById("friend-list-body").appendChild(div)
    }
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

// ----------------------------------------
// 程序辅助函数
// ----------------------------------------

// 样式 LOG
function showLog(bg, fg, head, info) {
    console.log("%c" + head + "%c " + info, "background:#" + bg + ";color:#" + fg + ";border-radius:7px 0 0 7px;display:inline-block;padding:2px 4px 2px 7px;", "")
}

// 设置状态消息
function setStatue(type, msg) {
    document.getElementById("stat-icon").style.transition = "unset"
    document.getElementById("stat-icon").style.opacity = "1"
    document.getElementById("stat-icon").title = msg
    let icon = ""
    switch (type) {
        case "load": {
            icon = "<svg class='fa-pulse' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z\"/></svg>\n"
            break
        }
        case "ok": {
            icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z\"/></svg>"
            break
        }
        case "err": {
            icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z\"/></svg>"
            break
        }
    }
    document.getElementById("stat-icon").innerHTML = icon
    setTimeout(() => {
        document.getElementById("stat-icon").style.transition = "opacity 1s"
        document.getElementById("stat-icon").style.opacity = "0"
    }, 3000)
}

// 显示新消息提醒
function noticeMsg() {
    document.getElementById("msg-view").style.border = "2px solid var(--color-main)"
    setTimeout(() => {
        document.getElementById("msg-view").style.border = "2px solid transparent"
    }, 500)
}