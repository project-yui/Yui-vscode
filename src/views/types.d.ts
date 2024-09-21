export interface QuickLoginItem {
    /**
     * QQ号
     */
    uin: `${number}`
    /**
     * 用户ID
     */
    uid: `u_${string}`
    /**
     * 昵称
     */
    nick_name: string
    face_url: string
    face_path: string
    login_type: 1 | 2
    /**
     * 是否快速登录
     */
    is_quick_login: boolean
    /**
     * 是否自动登录
     */
    is_auto_login: boolean
}

export interface FriendGroupItemType {
    id: number,
    name: string
    count: number
    friend_list: FriendItemType[]
}
export interface FriendItemType {
    uin: `${number}`,
    nick: string
    remark: string
    avatarUrl: string
}
export interface GroupGroupItemType {
    id: number
    name: string
    type: 'top' | 'unname' | 'create' | 'manage' | 'join'
    groupList: GroupItemType[]
}
export interface GroupItemType {
    /**
     * vscode用的id
     */
    id: string
    /**
     * 群号
     */
    code: `${number}`
    name: string
    avatarUrl: string
    role: 'owner' | 'member' | 'manager'
    top: boolean
    toppedTimestamp: number
}

export interface GroupDetailInfoResp {
    code: `${number}`
    name: string
    avatarUrl: string
    role: 'owner' | 'member' | 'manager'
    top: boolean
    toppedTimestamp: number
    is_conf: boolean
}