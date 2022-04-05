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

function printXML(xml, type) {
    // 尝试渲染 xml 消息
    // <msg> 标签内的为本体
    let item = xml.substring(xml.indexOf("<item"), xml.indexOf("</msg>"))
    // 尝试转换标签为 html
    item = item.replaceAll("item", "div")                                                       // item
    item = item.replaceAll("<div", "<div class='msg-xml'")
    item = item.replaceAll("title", "p")                                                        // title
    item = item.replaceAll("summary", "a")                                                      // summary
    item = item.replaceAll("<a", "<a class='msg-xml-summary'")
    // 将不正确的参数改为 dataset
    item = item.replaceAll("color=", "data-color=")
    item = item.replaceAll("size=", "data-size=")
    item = item.replaceAll("linespace=", "data-linespace=")
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
            }
        }
    }
    return div.outerHTML

}