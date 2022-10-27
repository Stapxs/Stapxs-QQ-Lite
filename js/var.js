// 把一些信息存起来，减少和服务器的通信

// 存好友 {"qq_num": {}, ...}
window.friends = {}
// 存群信息 {"group_id": {..., members: []}, ...}
window.groups = {}

function getGroupMemberList(group_id) {
    return window.groups[''+group_id].members
}