import { useLogger } from "../common/log";
import * as vscode from 'vscode';
import { getHtml } from "../common/webview";
import { useWSServer } from "../server/websocket";
import { useGlobal } from "../common/global";

const log = useLogger('Command Group');
export const openGroup = async (groupCode: `${number}`) => {
    log.info('open:', groupCode);
    const { getContext } = useGlobal();
    const ctx = getContext();
    log.info('d:', vscode.Uri.file("d:/"));
    const panel = vscode.window.createWebviewPanel(
        'group', // Identifies the type of the webview. Used internally
        '群聊', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
            enableScripts: true,
            localResourceRoots: [
                ctx.extensionUri,
                ctx.globalStorageUri,
                vscode.Uri.file("/"),
                vscode.Uri.file("c:/"),
                vscode.Uri.file("D:/"),
                vscode.Uri.file("e:/"),
                vscode.Uri.file("f:/"),
                vscode.Uri.file("g:/"),
            ]
        } // Webview options. More on these later.
    );
    const { send } = useWSServer();
    const self = await send<any, any>('get_self_info', {});
    panel.webview.html = getHtml(panel.webview, 'group-chat.html', `window.groupCode = ${groupCode};\nwindow.selfUid = '${self.userUid}';\nwindow.selfUin = '${self.userUin}';`);
    panel.webview.onDidReceiveMessage(async (req) => {
        log.info('receive from html:', req);
        if (req.type === 'websocket')
        {
            const result = await send<any, any>(req.action, req.params);
            panel.webview.postMessage({
                id: req.id,
                result,
            });
        }
        else
        {
            if (req.action === 'get_url')
            {
                panel.webview.postMessage({
                    id: req.id,
                    result: panel.webview.asWebviewUri(vscode.Uri.file(req.data.path)).toString(),
                });
            }
        }
    });
};