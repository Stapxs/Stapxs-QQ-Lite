window.version = 'v1.25'
document.getElementById("opt-version").innerText = window.version
// 自动暗黑模式标志
window.is_auto_dark = true
// 加载 cookie
var x = document.cookie
window.optCookie = {}
if(x != "") {
    x = x.split(";")
    window.cookie = {}
    for(let i=0; i<x.length; i++) {
        window.cookie[x[i].split("=")[0].trim()] = x[i].split("=")[1].trim()
    }
    // 解析设置
    if(window.cookie["option"] != undefined) {
        const optStr = window.cookie["option"].split("&")
        console.log(optStr)
        for(let i=0; i<optStr.length; i++) {
            window.optCookie[optStr[i].split(":")[0]] = optStr[i].split(":")[1]
        }
    }
    // 载入设置
    showLog("b573f7", "fff", "UI", "正在载入设置 ……")
    for(let i=0; i<Object.keys(window.optCookie).length; i++) {
        let body = document.getElementById(Object.keys(window.optCookie)[i])
        if(body == undefined) {
            body = document.getElementById(Object.keys(window.optCookie)[i] + "_" + window.optCookie[Object.keys(window.optCookie)[i]])
        }
        if(body != undefined) {
            switch(body.nodeName) {
                case "INPUT": {
                    if(body.type == "checkbox") {
                        if(window.optCookie[Object.keys(window.optCookie)[i]] == "true" && body.checked == false ||
                            window.optCookie[Object.keys(window.optCookie)[i]] == "false" && body.checked == true) {
                            body.click()
                        }
                    } else if(body.type == "radio") {
                        body.click()
                    } else {
                        body.value = window.optCookie[Object.keys(window.optCookie)[i]]
                    }
                    break
                }
                case "SELECT": {
                    body.value = window.optCookie[Object.keys(window.optCookie)[i]]
                    break
                }
            }
        }
    }
    // 填充输入框
    if(window.cookie["address"] != undefined) {
        document.getElementById("sev_address").value = window.cookie["address"]
    }
    // 检查缓存版本
    if(window.cookie["version"] == undefined || Number(window.cookie["version"].substring(1)) < Number(window.version.substring(1))) {
        // 刷新 Cookie
        var date = new Date()
        date.setDate(date.getDate() + 30)
        const cookie = "version=" + window.version + "; expires=" + date.toUTCString()
        document.cookie = cookie
        // 显示消息、
        const body = document.getElementById("msg-body")
        const msg = JSON.parse(`{"time":1649921703,"post_type":"message","message_type":"private","sub_type":"friend","message_id":"whyneedmsgid","user_id":1007028430,"message":[{"type":"text","data":{"text":"abab"}}],"raw_message":"whyneedrawmsg","sender":{"user_id":1007028430,"nickname":"林小槐","sex":"female","remark":"林小槐"}}`)
        msg.time = Date.parse(new Date()) / 1000
        msg.message[0].data.text = "是新版本更新通知哦 ~"
        printMsg(msg)
        body.scrollTop = body.scrollHeight
        // 尝试拉取 GitHub 上的最新日志
        fetch('https://api.github.com/repos/stapxs/qq-web-lite/commits')
            .then(response => response.json())
            .then(data => {
                msg.time = Date.parse(new Date()) / 1000
                msg.message[0].data.text = "这是最新的更新日志 ——"
                printMsg(msg)
                body.scrollTop = body.scrollHeight
                if(data.length > 0) {
                    const msgList = data[0]["commit"]["message"].split("\n")
                    let msgStr = ""
                    for(let i=0; i<msgList.length; i++) {
                        if(msgList[i].substring(0, 1) == ":") {
                            const emoji = msgList[i].substring(0, msgList[i].substring(1).indexOf(":") + 2)
                            msgStr += gitmojiToEmoji(emoji) + msgList[i].substring(msgList[i].substring(1).indexOf(":") + 2) + "\n"
                        } else {
                            msgStr += msgList[i] + "\n"
                        }
                    }
                    msg.time = Date.parse(new Date()) / 1000
                    msg.message[0].data.text = msgStr
                    printMsg(msg)
                    body.scrollTop = body.scrollHeight
                    // 尝试获取附加内容
                    fetch('https://raw.githubusercontent.com/Stapxs/QQ-Web-Lite/main/addMsg.txt')
                        .then(response =>  {
                            if (!response.ok) {throw new Error('请求未完成 ……')}
                            return response.text()})
                        .then(data => {
                            msg.time = Date.parse(new Date()) / 1000
                            msg.message[0].data.text = "顺带一提 ……"
                            printMsg(msg)
                            body.scrollTop = body.scrollHeight
                            setTimeout(() => {
                                msg.time = Date.parse(new Date()) / 1000
                                msg.message[0].data.text = data
                                printMsg(msg)
                                body.scrollTop = body.scrollHeight
                            }, 500)
                        })
                }
            })
            .catch(function (e) {
                msg.time = Date.parse(new Date()) / 1000
                msg.message[0].data.text = "获取更新日志失败（小声"
                printMsg(msg)
                body.scrollTop = body.scrollHeight
            })
    }
}
// 初始化颜色切换按钮
let mediaTest = window.matchMedia('(prefers-color-scheme: dark)');
if(is_auto_dark !== false) {
    if (mediaTest.matches) {
        document.getElementById("color-changer").dataset.color = "dark"
        document.getElementById("color-changer").innerHTML = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/></svg>`
    }
}
// SW 特性支持
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function(reg) {
        console.log('注册 Service Workers 服务成功：' + reg.scope);
    }).catch(function(error) {
        console.log('注册 Service Workers 服务失败：' + error);
    });
}
// 覆写粘贴事件，提供粘贴图片的功能
document.getElementById("send-box").addEventListener("paste", function(e) {
    // 判断粘贴类型
    if (!(e.clipboardData && e.clipboardData.items)) {
        return
    }
    for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i]
        if (item.kind === "file") {
            console.log("file")
            var blob = item.getAsFile()
            if(blob.type.indexOf("image/") >= 0 && blob.size != 0) {
                setStatue("load", "正在处理图片 ……")
                if(blob.size < 3145728) {
                    // 转换为 Base64
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = function() {
                        var base64data = reader.result
                        // 将按钮改为选中状态
                        document.getElementById("btn-img").style.background = "var(--color-main)"
                        document.getElementById("btn-img").children[1].style.fill = "var(--color-font-r)"
                        document.getElementById("btn-img").title = "取消发送图片"
                        // 记录图片信息
                        window.cacheImg = base64data
                        // 设置标记
                        document.getElementById("btn-img").dataset.select = "true"
                        // 完成
                        setStatue("ok", "图片处理完成！")
                        // 删除 input
                        document.getElementById("btn-img").removeChild(document.getElementById("choice-pic"))
                    }
                } else {
                    // 图片过大
                    setStatue("err", "图片过大！")
                }
            }
            //阻止默认行为
            e.preventDefault();
        }
    }
})
// 复制消息
var clipboard = new ClipboardJS(document.getElementById("menuCopy"), {
    text: function(trigger) {
        return (window.msgInMenu != undefined && window.msgInMenu != null)?window.msgInMenu.dataset.raw:""
    }
});
clipboard.on('success', function(e) {
    showMsgMenu()
});
clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    setStatue("err", "复制消息失败！")
});