import * as vscode from 'vscode';
import { useWSServer } from './server/websocket';
import { useLogger } from './common/log';
import { UserInfoViewProvider } from './views/user-info';

const log = useLogger('Init');

export const init = async (context: vscode.ExtensionContext) => {
    const userInfoView = new UserInfoViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(UserInfoViewProvider.viewId, userInfoView));
	
    const { send } = useWSServer();
    try {

        const info = await send('get_self_info', {});
        log.info('user info:', info);
        userInfoView.changePage('user-info.html');
    }
    catch(err) {

    }
};