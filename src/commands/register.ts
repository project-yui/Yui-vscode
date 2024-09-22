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
    
const { getView } = useGlobal();
const { send } = useWSServer();
const commands: Record<string, (...args: any[]) => any> = {
    'yukihana.install': installNTQQ,
    'yukihana.login': loginCommand,
    'yukihana.scan': scanLoginCommand,
    'yukihana.openGroup': openGroup,
    'yukihana.refreshGroupList': async () => {
        const groupList = await send<{}, GroupDetailInfoResp[]>('get_group_list', {});
        getView<GroupTreeProvider>(GroupTreeProvider.viewId)?.updateGroupData(groupList);
        
    },
    'yukihana.refreshFriendList': async () => {
        const friendList = await send<{}, FriendGroupItemType[]>('get_friend_list', {});
        getView<FriendTreeProvider>(FriendTreeProvider.viewId)?.updateGroupData(friendList);
        
    },
    'yukihana.refreshUserInfo': async () => {
        const friendList = await send<{}, FriendGroupItemType[]>('get_friend_list', {});
        getView<UserInfoViewProvider>(UserInfoViewProvider.viewId)?.changePage('user-info.html');
        
    },
};
export const registerCommands = (context: vscode.ExtensionContext) => {
    for(const cmd in commands)
    {
        const rc = vscode.commands.registerCommand(cmd, commands[cmd]);
        context.subscriptions.push(rc);
    }
};