import * as vscode from 'vscode';
import { useWSServer } from './server/websocket';
import { useLogger } from './common/log';
import { UserInfoViewProvider } from './views/user-info';
import { FriendTreeProvider } from './views/friend-tree';
import { useGlobal } from './common/global';
import { FriendGroupItemType, GroupDetailInfoResp, GroupGroupItemType } from './views/types';
import { sleep } from './common/sleep';
import { GroupTreeProvider } from './views/group-tree';

const log = useLogger('Init');

export const init = async (context: vscode.ExtensionContext) => {
    const { addView } = useGlobal();
    const userInfoView = new UserInfoViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(UserInfoViewProvider.viewId, userInfoView));
	addView(UserInfoViewProvider.viewId, userInfoView);

    const friendTreeView = new FriendTreeProvider();
    context.subscriptions.push(vscode.window.registerTreeDataProvider(FriendTreeProvider.viewId, friendTreeView));
	addView(FriendTreeProvider.viewId, friendTreeView);
    
    const groupTreeView = new GroupTreeProvider();
    context.subscriptions.push(vscode.window.registerTreeDataProvider(GroupTreeProvider.viewId, groupTreeView));
	addView(FriendTreeProvider.viewId, groupTreeView);

    const { send } = useWSServer();
    let refreshFriendList = vscode.commands.registerCommand('yukihana.refreshFriendList', async () => {
        const friendList = await send<{}, FriendGroupItemType[]>('get_friend_list', {});
        friendTreeView.updateGroupData(friendList);
        
    });
    context.subscriptions.push(refreshFriendList);
    
    let refreshGroupList = vscode.commands.registerCommand('yukihana.refreshGroupList', async () => {
        const groupList = await send<{}, GroupDetailInfoResp[]>('get_group_list', {});
        groupTreeView.updateGroupData(groupList);
        
    });
    context.subscriptions.push(refreshGroupList);
    try {

        const info = await send('get_self_info', {});
        log.info('user info:', info);
        userInfoView.changePage('user-info.html');

    }
    catch(err) {

    }
};