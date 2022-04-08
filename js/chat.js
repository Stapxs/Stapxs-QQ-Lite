/*
    msg.js - 提供 UI 相关方法
    2022/04/05 - Stapx Steve [林槐]
*/

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

function showLoginPan(what) {
    if(window.connect !== true) {
        if (what === true) {
            document.getElementById("login-btn").innerHTML = "<svg class='fa-pulse' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z\"/></svg>"
            document.getElementById("login-pan").style.display = "block"
            setTimeout(() => {
                document.getElementById("login-pan").style.opacity = "1"
            }, 100)
        } else {
            document.getElementById("login-btn").innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M344.7 238.5l-144.1-136C193.7 95.97 183.4 94.17 174.6 97.95C165.8 101.8 160.1 110.4 160.1 120V192H32.02C14.33 192 0 206.3 0 224v64c0 17.68 14.33 32 32.02 32h128.1v72c0 9.578 5.707 18.25 14.51 22.05c8.803 3.781 19.03 1.984 26-4.594l144.1-136C354.3 264.4 354.3 247.6 344.7 238.5zM416 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c17.67 0 32 14.33 32 32v256c0 17.67-14.33 32-32 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c53.02 0 96-42.98 96-96V128C512 74.98 469 32 416 32z\"/></svg>"
            document.getElementById("login-pan").style.opacity = "0"
            setTimeout(() => {
                document.getElementById("login-pan").style.display = "none"
            }, 300)
        }
    } else {
        // 断开连接
        window.ws.close(1000, "主动断开")
    }
}

function openImgView(url) {
    if(url === undefined || url === null) {
        document.getElementById("img-view").style.opacity = "0"
        setTimeout(() => {
            document.getElementById("img-view").style.display = "none"
        }, 300)
    } else {
        // 赋值图片
        document.getElementById("img-view").getElementsByTagName("img")[0].src = url
        document.getElementById("img-view").style.display = "block"
            setTimeout(() => {
                document.getElementById("img-view").style.opacity = "1"
            }, 100)
    }
}

function runConnect() {
    showLoginPan(false)
    // 啊吧啊吧
    document.getElementById("referrer").content = "no-referrer"
    // 隐藏底栏
    document.getElementById("footer").style.transform = "translate(0,137px)"
    document.getElementById("main-view").style.height  = "100vh"
    setTimeout(() => {
        document.getElementById("footer").style.display = "none"
    }, 450)
    setTimeout(() => {
        // 开始链接
        runWs();
    }, 500)
}

function onListClick(sender) {
    setStatue("load", "正在加载历史消息 ……")
    const type = sender.dataset.type
    // 去除未读标记
    sender.children[0].style.transform = "scaleY(0)"
    // 显示顶栏
    document.getElementById("msg-hander").getElementsByTagName("a")[0].innerText = sender.dataset.name
    document.getElementById("msg-hander").dataset.id = sender.dataset.id
    document.getElementById("msg-hander").dataset.type = sender.dataset.type
    document.getElementById("msg-hander").style.display = "flex"
    // 清空聊天记录框
    document.getElementById("msg-body").innerHTML = ""
    // 加载历史消息
    // Note: https://github.com/takayama-lily/oicq/wiki/93.%E8%A7%A3%E6%9E%90%E6%B6%88%E6%81%AFID
    var msgid = null
    switch(type) {
        case "friend": {
            // friend msg id 为 4*4+1 = 17 bit
            var buffer = new ArrayBuffer(17)
            var dv = new DataView(buffer, 0)
            dv.setInt32(0, sender.dataset.id)
            dv.setInt32(4, 0)
            dv.setInt32(8, 0)
            dv.setInt32(12, 0)
            dv.setInt8(16, 0)
            msgid = buildMsgIdInfo(buffer)
            break
        }
        case "group": {
            // group msg id 为 4*5+1 = 21 bit
            var buffer = new ArrayBuffer(21)
            var dv = new DataView(buffer, 0)
            dv.setInt32(0, sender.dataset.id)
            dv.setInt32(4, 0)
            dv.setInt32(8, 0)
            dv.setInt32(12, 0)
            dv.setInt32(16, 0)
            dv.setInt8(20, 0)
            msgid = buildMsgIdInfo(buffer)
            break
        }
    }
    if(msgid != null) {
        // 发送请求
        sendWs(
            createAPI(
                "get_chat_history",
                {"message_id":msgid},
                "get_chat_history_fist"
            )
        )
    } else {
        return false
    }
}

function scrollToMsg(obj) {
    let wrapper = document.getElementById("msg-body")
    wrapper.scrollTo(0 , obj.offsetTop - 89*2);
}

function msgBodyScroll() {
    const msgBody = document.getElementById("msg-body")
    // 获取更多历史消息
    if(msgBody.scrollTop == 0 && msgBody.children.length > 0) {
        setStatue("load", "正在加载历史消息 ……")
        const msgId = document.getElementById("msg-body").children[0].dataset.id
        // 发送请求
        sendWs(
            createAPI(
                "get_chat_history",
                {"message_id":msgId}
            )
        )
    }
}

function lightChatBorder() {
    document.getElementById("msg-view").style.border = "2px solid var(--color-main)"
    setTimeout(() => {
        document.getElementById("msg-view").style.border = "2px solid transparent"
    }, 400)
}

function sendMsg() {
    setStatue("load", "正在发送消息 ……")
    let json = null
    try {
        // 发送消息
        let msg = document.getElementById("send-box").value
        const type = document.getElementById("msg-hander").dataset.type
        const id = document.getElementById("msg-hander").dataset.id
        // 构建消息体
        if(document.getElementById("replyer").dataset.id != undefined && document.getElementById("replyer").dataset.id != "") {
            // 构建回复 CQ 码
            msg = "[CQ:reply,id=" + document.getElementById("replyer").dataset.id + "]" + msg
            cancelReply()
        }
        if(window.cacheImg != undefined && window.cacheImg != "") {
            // 构建图片 CQ 码
            msg  = "[CQ:image,file=base64://" + window.cacheImg.substring(window.cacheImg.indexOf("base64") + 7)  + "]" + msg
            // 清除图片缓存
            document.getElementById("btn-img").title = "发送图片"
            document.getElementById("btn-img").style.background = "var(--color-card-1)"
            document.getElementById("btn-img").children[1].style.fill = "var(--color-font)"
            window.cacheImg = ""
            document.getElementById("btn-img").dataset.select = "false"
            
        }
        if(msg != "" && msg != undefined && msg != null && type != undefined && id != undefined && window.connect) {
            // 构建 JSON
            switch(type) {
                case "group": json = createAPI("send_msg", {"group_id": id, "message": msg}, null); break
                case "friend": json = createAPI("send_msg", {"user_id": id, "message": msg}, null); break
            }
            if(json != null) {
                // 清空输入框
                document.getElementById("send-box").value = ""
                sendWs(json)
                // PS: 渲染本条消息的功能由消息本请求的返回系统处理
            }
        } else {
            // 发送条件异常
            showLog("ff5370", "fff", "CORE", "发送消息错误：" + msg + " / " + type + " / " + id + " / " + window.connect)
        }
    }
    catch(e) {
        showLog("ff5370", "fff", "CORE", "发送消息错误：" + json)
        console.error(e)
    }
    finally {
        return false
    }
}

function selectImg() {
    const btn = document.getElementById("btn-img")
    if(btn.dataset.select === "true") {
        // 取消发送图片
        document.getElementById("btn-img").title = "发送图片"
        document.getElementById("btn-img").style.background = "var(--color-card-1)"
        document.getElementById("btn-img").children[1].style.fill = "var(--color-font)"
        window.cacheImg = ""
        document.getElementById("btn-img").dataset.select = "false"
    } else {
        // 发起文件选择

    }
}

function showSelView(statue) {
    const view = document.getElementById("btn-img-hover")
    if(statue && window.cacheImg != undefined && window.cacheImg != "") {
        // 显示
        view.style.display = "flex"
        setTimeout(() => {
            view.style.opacity = "1"
        }, 10)
        // 设置图片
        view.children[0].src = window.cacheImg
    } else {
        // 隐藏
        view.style.opacity = "0"
        setTimeout(() => {
            view.style.display = "none"
        }, 300)
    }
}

function searchInList() {
    // 清空搜索结果
    const body = document.getElementById("friend-search-body")
    while(body.children.length > 0) {
        document.getElementById("friend-list-body").appendChild(body.children[0])
    }
    const what = document.getElementById("seach-input").value
    if(what != null && what != "") {
        const childs =  document.getElementById("friend-list-body").children
        for(let i=0; i<childs.length; i++) {
            if(childs[i].dataset.id == what || childs[i].dataset.name.indexOf(what) >= 0) {
                document.getElementById("friend-search-body").style.display = "block"
                // 将对象复制到搜索结果框内
                document.getElementById("friend-search-body").append(childs[i])
            }
        }
    }
}

function cancelSearch() {
    const what = document.getElementById("seach-input").value
    if(what == null || what == "") {
        // 清空搜索结果
        const body = document.getElementById("friend-search-body")
        while(body.children.length > 0) {
            document.getElementById("friend-list-body").append(body.children[0])
        }
    }
}

function jumpToMsg(id) {
    const msg = findMsgInList(id)
    if(msg != null) {
        scrollToMsg(msg)
    } else {
        setStatue("err", "消息未被显示在窗口内。")
    }
}

function msgMouseDown(sender, e) {
    // 右击事件
    if(e.which == 3) {
        // 阻止点击传递
        e.stopPropagation()
        // 显示菜单
        showMsgMenu(sender)
    }
}

function msgTouchDown(sender, event) {
    showLog("b573f7", "fff", "UI", "消息触屏点击事件开始 ……")
    window.msgOnTouchDown = true
    window.msgTouchX = event.targetTouches[0].pageX
    window.msgTouchY = event.targetTouches[0].pageY
    // 消息长按事件，计时 500ms 判定长按
    setTimeout(() => {
        showLog("b573f7", "fff", "UI", "消息触屏长按判定：" + window.msgOnTouchDown)
        if(window.msgOnTouchDown === true) {
            showMsgMenu(sender, event.targetTouches[0])
        }
    }, 450)
}

function msgTouchMove(event) {
    if(window.msgTouchX != null && window.msgTouchY != null && window.msgTouchX != undefined && window.msgTouchY != undefined) {
        // 计算移动差值
        const dx = Math.abs(window.msgTouchX - event.targetTouches[0].pageX)
        const dy = Math.abs(window.msgTouchY - event.targetTouches[0].pageY)
        // 如果 dy 大于 10px 则判定为用户在滚动页面，打断长按消息判定
        if(dy > 10) {
            if(window.msgOnTouchDown == true) {
                showLog("b573f7", "fff", "UI", "用户正在滚动，打断长按判定。")
                window.msgOnTouchDown = false
            }
        }
    }
}

function msgTouchEnd(event) {
    window.msgOnTouchDown = false
    window.msgTouchX = null
    window.msgTouchY = null
}

function showMsgMenu(sender, event) {
    if(sender == undefined || sender == null) {
        document.getElementById("right-click-menu").children[1].style.transform = "scaleY(0)"
        document.getElementById("right-click-menu-bg").onmousedown = null
        setTimeout(() => {
            document.getElementById("right-click-menu").style.display = "none"
            // 恢复被隐藏的菜单
            const body = document.getElementById("right-click-menu-body")
            for(let i=0; i<body.children.length; i++) {
                body.children[i].style.display = "flex"
            }
        }, 150)
        window.msgInMenu.style.background = "transparent"
        window.msgInMenu = null
    } else {
        // 登记
        window.msgInMenu = sender
        // 修改消息的背景
        sender.style.background = "#00000008"
        // 获取鼠标位置
        const pointEvent = event || window.event
        // 修改菜单位置
        document.getElementById("right-click-menu").children[1].style.marginLeft = pointEvent.pageX + "px"
        document.getElementById("right-click-menu").children[1].style.marginTop = pointEvent.pageY + "px"
        // 判断是不是自己的消息
        if(Number(sender.dataset.sender) != Number(window.login_id)) {
            document.getElementById("menuCancel").style.display = "none"
        }
        // 特判已经被撤回的自己的消息。只显示复制菜单
        if(sender.style.opacity === "0.4") {
            const body = document.getElementById("right-click-menu-body")
            for(let i=0; i<body.children.length; i++) {
                body.children[i].style.display = "none"
            }
            document.getElementById("menuCopy").style.display = "flex"
        }
        // 显示菜单
        document.getElementById("right-click-menu").style.display = "block"
        setTimeout(() => {
            document.getElementById("right-click-menu").children[1].style.transform = "scaleY(1)"
            setTimeout(() => {
                document.getElementById("right-click-menu-bg").onmousedown = function() { showMsgMenu() }
            }, 100)
        }, 50)
    }
}

function menuReply() {
    if(window.msgInMenu != undefined && window.msgInMenu != null) {
        // 设置回复标志
        document.getElementById("replyer-txt").innerText = window.msgInMenu.dataset.raw
        document.getElementById("replyer").dataset.id = window.msgInMenu.dataset.id
        document.getElementById("replyer").dataset.sender = window.msgInMenu.dataset.sender
        // 显示
        document.getElementById("replyer").style.height = "45px"
        // 关闭菜单
        showMsgMenu()
        // 将光标聚焦到输入框
        document.getElementById("send-box").focus()
    }
}

function cancelReply() {
    document.getElementById("replyer-txt").innerText = ""
    document.getElementById("replyer").dataset.id = ""
    document.getElementById("replyer").style.height = "0"
}

function menuCancel() {
    if(window.msgInMenu != undefined && window.msgInMenu != null) {
        sendWs(createAPI("delete_msg", {"message_id": window.msgInMenu.dataset.id}))
        showMsgMenu()
    }
}