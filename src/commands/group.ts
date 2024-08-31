import { useLogger } from "../common/log";
import * as vscode from 'vscode';
import { getHtml } from "../common/webview";

const log = useLogger('Command Group');
export const openGroup = (groupCode: `${number}`) => {
    log.info('open:', groupCode);
    const panel = vscode.window.createWebviewPanel(
        'group', // Identifies the type of the webview. Used internally
        '群聊', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
            enableScripts: true,
        } // Webview options. More on these later.
    );
    panel.webview.html = getHtml(panel.webview, 'group-chat.html');
};