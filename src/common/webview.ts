import * as vscode from 'vscode';
import { useGlobal } from './global';

export const getHtml = (webview: vscode.Webview, page: string, srcipt: string = '') => {
    const { getContext } = useGlobal();
    const ctx = getContext();
    if(ctx === null)
    {
        throw new Error('Failed to get Context');
    }
    
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const preload = webview.asWebviewUri(vscode.Uri.joinPath(ctx.extensionUri, 'assets', 'preload.js'));
    const pageSrc = webview.asWebviewUri(vscode.Uri.joinPath(ctx.extensionUri, 'assets', page));

    // Use a nonce to only allow a specific script to be run.
    // const nonce = getNonce();

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading styles from our extension directory,
                and only allow scripts that have a specific nonce.
                (See the 'webview-sample' extension sample for img-src content security policy examples)
            -->

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>User Info</title>
        </head>
        <body>
            <script>${srcipt}</script>
            <div id="container"></div><br />
            <script>
                window.pageSrc = '${pageSrc}'
            </script>
            <script src="${preload}" />
        </body>
        </html>`;
};