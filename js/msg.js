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

function printImg(url) {
    return "<img onclick='openImgView(\"" + url + "\");' class='msg-img' src='" + url + "'>"
}

function printFace(id, name) {
    return "<img class='msg-face' src='src/qq-face/" + id + ".gif' title='" + name + "'>"
}

function printReplay(msgid) {
    // TODO: 回复消息（还没写完）
    return "<div class='msg-replay'>这是条回复消息但是我还没写完</div>"
}