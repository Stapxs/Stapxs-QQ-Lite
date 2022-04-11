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
            <div class="{mine}">{body}</div>
        </div>
        <a style="display: none;">{raw}</a>`
            html = html.replace("{id}", obj.sender.user_id)
            let name = obj.sender.nickname
            if(obj.message_type=="group" && obj.sender.card!=obj.sender.nickname && obj.sender.card!="") {
                name = obj.sender.card
            }
            html = html.replace("{name}", name)
            html = html.replace("{space}", obj.sender.user_id==window.login_id?"":"flex:unset;")
            html = html.replaceAll("{hidden}", obj.sender.user_id==window.login_id?"display:none;":"")
            html = html.replace("{mine}", obj.sender.user_id==window.login_id?"message-mine":"")
            html = html.replace("{raw}", obj.raw_message)
            // 遍历消息体
            let body = ""
            for(let i=0; i<obj.message.length; i++) {
                let nowBreak = false
                switch(obj.message[i].type) {
                    case "reply": { if(obj.message[i+1].type == "at")obj.message[i+1].type = "pass";body = printReplay(obj.message[i].data.id, obj.message_id) + body; break }
                    case "text": body = body + printText(obj.message[i].data.text); break
                    case "image": body = body + printImg(obj.message[i].data.url, obj.message.length, obj.sender.user_id); break
                    case "face": body = body + printFace(obj.message[i].data.id, obj.message[i].data.text); break
                    case "bface": body = body + printBface("[ 表情：" + obj.message[i].data.text + " ]"); break
                    case "at": body = body + printAt(obj.message[i].data.text, obj.message[i].data.qq); break
                    case "xml": body = body + printXML(obj.message[i].data.data, obj.message[i].data.type); break
                    case "record": body = body + printRecord(obj.message[i].data.url); break
                    case "video": body = body + printVideo(obj.message[i].data.url); break
                    case "file": body = body + printFile(obj.message[i].data); break
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
            div.addEventListener("touchmove", function()    { msgTouchMove(event); }, false)                // 长按判定（移动）
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

// 获取消息有效文本
function getMsgRawTxt(message) {
    let back = ""
    for(let i=0; i<message.length; i++) {
        switch(message[i].type) {
            case "at":
            case "text": back += message[i].data.text;break
            case "face": 
            case "bface": back += "[表情]";break
            case "image": back += "[图片]";break
            case "record": back += "[语音]";break
            case "video": back += "[视频]";break
            case "file": back += "[文件]";break
        }
    }
    return back
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

function printBface(txt) {
    return printText(txt).replace("style='", "style='font-style: italic;opacity: 0.7;")
}

function printAt(txt, id) {
    txt = txt.replaceAll(" ", "&nbsp;")
    txt = txt.replaceAll("<", "&lt;")
    txt = txt.replaceAll(">", "&gt;")
    return "<a class='msg-at' data-id='" + id  + "'>" + txt + "</a>"
}

function printImg(url, num, sender) {
    const body = document.getElementById("msg-body")
    let loaded = ""
    if(window.login_id == sender || body.scrollHeight - body.scrollTop === body.clientHeight) {
        loaded = "imgLoaded()"
    }
     if(num == 1) {
        return "<img onload='" + loaded + "' style='max-width: calc(100% + 20px);transform: unset;width: calc(100% + 20px);margin: -10px;border: 1px solid var(--color-main);' onclick='openImgView(\"" + url + "\");' class='msg-img' src='" + url + "'>"
     } else {
        return "<img onload='" + loaded + "' onclick='openImgView(\"" + url + "\");' class='msg-img' src='" + url + "'>"
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
            "get_msg",
            {"message_id":msgid},
            "get_rep_msg_" + rawid
        ))
        return "<div class='msg-replay' id='get_rep_msg_" + rawid + "' onclick='jumpToMsg(\"" + msgid + "\")'><a style='font-style: italic;opacity: 0.7;'>加载回复消息失败 ……</a></div>"
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

function printFile(data) {
    let html = String.raw`<div class="msg-file">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"/></svg>
    <div><div><p>{name}</p><a>（{size}）</a></div><i>{md5}</i></div>
    <div onclick="window.open('{url}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"/></svg></div>
</div>`
    html = html.replace("{name}", data.name)
    html = html.replace("{size}", formatBytes(data.size))
    html = html.replace("{url}", data.url)
    html = html.replace("{md5}", data.md5)
    return html
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