/*
    msg_fun.js - 用于显示消息本体
    2022/04/08 - Stapx Steve [林槐]
*/

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
            const raw = getMsgRawTxt(obj.message)
            div.dataset.raw = raw == ""?obj.raw_message:raw     // 纯文本消息
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
                    case "reply": { if(obj.message[i+1].type == "at")obj.message[i+1].type = "pass";body = printReplay(obj.message[i].data.id, obj.message_id) + body; break }
                    case "text": body = body + printText(obj.message[i].data.text); break
                    case "image": body = body + printImg(obj.message[i].data.url, obj.message.length); break
                    case "face": body = body + printFace(obj.message[i].data.id, obj.message[i].data.text); break
                    case "at": body = body + printAt(obj.message[i].data.text, obj.message[i].data.qq); break
                    case "xml": body = body + printXML(obj.message[i].data.data, obj.message[i].data.type); break
                    case "record": body = body + printRecord(obj.message[i].data.url); break
                    case "video": body = body + printVideo(obj.message[i].data.url); break
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

// --------------------------------------------------------------

function printText(txt) {
    txt = txt.replaceAll(" ", "&nbsp;")
    txt = txt.replaceAll("<", "&lt;")
    txt = txt.replaceAll(">", "&gt;")
    txt = txt.replaceAll("\n\r", "<br>")
    txt = txt.replaceAll("\n", "<br>")
    txt = txt.replaceAll("\r", "<br>")
    return "<a style='overflow-wrap: anywhere;'>" + txt + "</a>"
}

function printAt(txt, id) {
    txt = txt.replaceAll(" ", "&nbsp;")
    txt = txt.replaceAll("<", "&lt;")
    txt = txt.replaceAll(">", "&gt;")
    return "<a class='msg-at' data-id='" + id  + "'>" + txt + "</a>"
}

function printImg(url, num) {
     if(num == 1) {
        return "<img style='width: calc(100% + 20px);margin: -10px;border: 1px solid var(--color-main);' onclick='openImgView(\"" + url + "\");' class='msg-img' src='" + url + "'>"
     } else {
        return "<img onclick='openImgView(\"" + url + "\");' class='msg-img' src='" + url + "'>"
     }
}

function printFace(id, name) {
    return "<img class='msg-face' src='src/qq-face/" + id + ".gif' title='" + name + "'>"
}

function printReplay(msgid, rawid) {
    // 尝试在消息队列里寻找这个消息
    const msg = findMsgInList(msgid)
    if(msg != null) {
        const svg = String.raw`<svg style="height: 1rem;display: inline-block;margin-right: 5px;fill: var(--color-font-2);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M8.31 189.9l176-151.1c15.41-13.3 39.69-2.509 39.69 18.16v80.05C384.6 137.9 512 170.1 512 322.3c0 61.44-39.59 122.3-83.34 154.1c-13.66 9.938-33.09-2.531-28.06-18.62c45.34-145-21.5-183.5-176.6-185.8v87.92c0 20.7-24.31 31.45-39.69 18.16l-176-151.1C-2.753 216.6-2.784 199.4 8.31 189.9z"></path></svg>`
        return "<div class='msg-replay' onclick='jumpToMsg(\"" + msgid + "\")'>" + svg +  msg.dataset.raw + "</div>"
    } else {
        // 如果消息队列里没有这个消息，尝试向服务器获取此条消息
        sendWs(createAPI(
            "get_chat_history",
            {"message_id":msgId, "count": 1},
            "get_rep_msg_" + rawid
        ))
    }
}

function printRecord(url) {
    // TODO：前端无法解析语音文件，待后端参与
    // URL 为文件地址
    return "<div class='msg-record'><i class='fa fa-play-circle' aria-hidden='true'></i><div><a>不支持播放语音消息</a></div></div>"
}

function printVideo(url) {
    return "<div class='msg-video'><video controls><source src='" + url + "' type='video/mp4'></video></div>"
}

function printXML(xml, type) {
    // 尝试渲染 xml 消息
    // <msg> 标签内的为本体
    let item = xml.substring(xml.indexOf("<item"), xml.indexOf("</msg>"))
    // 尝试转换标签为 html
    // item = item.replaceAll("/>", ">")
    item = item.replaceAll("item", "div")                                                       // item
    item = item.replaceAll("<div", "<div class='msg-xml'")
    item = item.replaceAll("title", "p")                                                        // title
    item = item.replaceAll("summary", "a")                                                      // summary
    item = item.replaceAll("<a", "<a class='msg-xml-summary'")
    item = item.replaceAll("<picture", "<img class='msg-xml-img'")                              // picture
    // 将不正确的参数改为 dataset
    item = item.replaceAll("color=", "data-color=")
    item = item.replaceAll("size=", "data-size=")
    item = item.replaceAll("linespace=", "data-linespace=")
    item = item.replaceAll("cover=", "src=")
    console.log(item)
    // 处理错误的 style 位置
    const div = document.createElement("div")
    div.innerHTML = item
    for(let i=0; i<div.children[0].children.length; i++) {
        console.log(div.children[0].children[i].nodeName)
        switch(div.children[0].children[i].nodeName) {
            case "P": {
                console.log(div.children[0].children[i].dataset.color)
                div.children[0].children[i].style.color = div.children[0].children[i].dataset.color
                div.children[0].children[i].style.fontSize = Number(div.children[0].children[i].dataset.size) / 30 + "rem"
                div.children[0].children[i].style.marginBottom = Number(div.children[0].children[i].dataset.size) / 5 + "px"
                break
            }
        }
    }
    return div.outerHTML

}