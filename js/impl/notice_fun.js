/*
    notice_fun.js - 这里是用于处理 WS 发送而来的消息的方法们 > ws.js line 45 runJSON()
    2022/04/08 - Stapx Steve [林槐]
*/

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

function setUserInfo(data) {
    window.login_id = data.user_id
    document.getElementById("main-src").src = "https://q1.qlogo.cn/g?b=qq&s=0&nk=" + data.user_id
    document.getElementById("main-name").innerText = data.nickname
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

// 处理通知消息
function runNotice(msg) {
    switch(msg.sub_type) {
        // 撤回消息
        case "recall": {
            // 判断目标
            const id = msg.notice_type == "group"?msg.group_id:msg.user_id
            console.log(id + " / " + document.getElementById("msg-hander").dataset.id)
            if(Number(id) == Number(document.getElementById("msg-hander").dataset.id)) {
                // 如果是自己的消息则只降低透明的不隐藏
                if(Number(msg.user_id) == Number(window.login_id)) {
                    findMsgInList(msg.message_id).style.opacity = "0.4"
                } else {
                    // 隐藏消息
                    findMsgInList(msg.message_id).style.display = "none"
                }
            }
            // 尝试撤回通知
            // let notification = new Notification("消息被撤回", {"tag": msg.message_id})
        }
    }
}