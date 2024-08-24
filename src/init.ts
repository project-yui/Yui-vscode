import * as vscode from 'vscode';
import { useWSServer } from './server/websocket';
import { useLogger } from './common/log';
import { UserInfoViewProvider } from './views/user-info';
import { FriendTreeProvider } from './views/friend-tree';
import { useGlobal } from './common/global';
import { FriendGroupItemType } from './views/types';
import { sleep } from './common/sleep';

const log = useLogger('Init');

export const init = async (context: vscode.ExtensionContext) => {
    const { addView } = useGlobal();
    const userInfoView = new UserInfoViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(UserInfoViewProvider.viewId, userInfoView));
	
    const friendTreeView = new FriendTreeProvider();
    context.subscriptions.push(vscode.window.registerTreeDataProvider(FriendTreeProvider.viewId, friendTreeView));
	
    addView(UserInfoViewProvider.viewId, userInfoView);
    addView(FriendTreeProvider.viewId, friendTreeView);
    
    const { send } = useWSServer();
    let refreshFriendList = vscode.commands.registerCommand('yukihana.refreshFriendList', async () => {
        const friendList = await send<{}, FriendGroupItemType[]>('get_friend_list', {});
        friendTreeView.updateFriendData(friendList);
        
    });
    context.subscriptions.push(refreshFriendList);
    try {

        const info = await send('get_self_info', {});
        log.info('user info:', info);
        userInfoView.changePage('user-info.html');

    }
    catch(err) {

    }
};