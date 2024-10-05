import * as vscode from 'vscode';
import { useWSServer } from './server/websocket';
import { useLogger } from './common/log';
import { UserInfoViewProvider } from './views/user-info';
import { FriendTreeProvider } from './views/friend-tree';
import { useGlobal } from './common/global';
import { GroupTreeProvider } from './views/group-tree';
import { registerCommands } from './commands/register';
import { initServerEvent } from './event/init';

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
	addView(GroupTreeProvider.viewId, groupTreeView);
    registerCommands(context);
    const { send } = useWSServer();
    initServerEvent();
    try {

        // const info = await send('get_self_info', {});
        // log.info('user info:', info);
        // userInfoView.changePage('user-info.html');
        // vscode.commands.executeCommand('yukihana.refreshFriendList');
        // vscode.commands.executeCommand('yukihana.refreshGroupList');
    }
    catch(err) {

    }
};