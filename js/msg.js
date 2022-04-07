/*
    msg.js - 用于输出消息
    2022/04/03 - Stapx Steve [林槐]
*/

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

function printReplay(msgid) {
    // 尝试在消息队列里寻找这个消息
    const msg = findMsgInList(msgid)
    if(msg != null) {
        const svg = String.raw`<svg style="height: 1rem;display: inline-block;margin-right: 5px;fill: var(--color-font-2);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M8.31 189.9l176-151.1c15.41-13.3 39.69-2.509 39.69 18.16v80.05C384.6 137.9 512 170.1 512 322.3c0 61.44-39.59 122.3-83.34 154.1c-13.66 9.938-33.09-2.531-28.06-18.62c45.34-145-21.5-183.5-176.6-185.8v87.92c0 20.7-24.31 31.45-39.69 18.16l-176-151.1C-2.753 216.6-2.784 199.4 8.31 189.9z"></path></svg>`
        return "<div class='msg-replay' onclick='jumpToMsg(\"" + msgid + "\")'>" + svg +  msg.dataset.raw + "</div>"
    }
    // TODO: 回复消息（还没写完）
    return "<div class='msg-replay'>这是条回复消息但是我还没写完</div>"
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