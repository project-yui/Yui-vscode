import { useGlobal } from "../common/global";
import { useWSServer } from "../server/websocket";
import { FriendTreeProvider } from "../views/friend-tree";
import { GroupTreeProvider } from "../views/group-tree";
import { FriendGroupItemType, GroupDetailInfoResp } from "../views/types";
import * as vscode from 'vscode';
import { loginCommand, scanLoginCommand } from "./login";
import { installNTQQ } from "./install";
import { openGroup } from "./group";
import { UserInfoViewProvider } from "../views/user-info";
import { useLogger } from "../common/log";
    
const log = useLogger('Register');
const { getView } = useGlobal();
const { send } = useWSServer();
const commands: Record<string, (...args: any[]) => any> = {
    'yukihana.install': installNTQQ,
    'yukihana.login': loginCommand,
    'yukihana.openGroup': openGroup,
    'yukihana.refreshGroupList': async (uin?: `${number}`) => {
        log.info('refreshGroupList:', uin);
        const p = getView<GroupTreeProvider>(GroupTreeProvider.viewId);
        let _uin = p.uin;
        if (typeof uin === 'string')
        {
            _uin = uin;
        }
        else {
            _uin = getView<UserInfoViewProvider>(UserInfoViewProvider.viewId)._uin;
        }
        const groupList = await send<{}, GroupDetailInfoResp[]>(_uin, 'get_group_list', {});
        p?.updateGroupData(_uin, groupList);
    },
    'yukihana.refreshFriendList': async (uin?: `${number}`) => {
        log.info('refreshFriendList:', uin);
        const p = getView<FriendTreeProvider>(FriendTreeProvider.viewId);
        let _uin = p.uin;
        if (typeof uin === 'string')
        {
            _uin = uin;
        }
        else {
            _uin = getView<UserInfoViewProvider>(UserInfoViewProvider.viewId)._uin;
        }
        const friendList = await send<{}, FriendGroupItemType[]>(_uin, 'get_friend_list', {});
        log.info('friend list:', friendList);
        p?.updateGroupData(_uin, friendList);
    },
    'yukihana.refreshUserInfo': async (uin?: `${number}`) => {
        log.info('refreshUserInfo:', uin);
        const p = getView<UserInfoViewProvider>(UserInfoViewProvider.viewId);
        if (typeof uin === 'string')
        {
            p._uin = uin;
        }
        p?.refresh();
        
    },
};
export const registerCommands = (context: vscode.ExtensionContext) => {
    for(const cmd in commands)
    {
        const rc = vscode.commands.registerCommand(cmd, commands[cmd]);
        context.subscriptions.push(rc);
    }
};