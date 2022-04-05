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
    wrapper.scrollTo(0 , obj.offsetTop);
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