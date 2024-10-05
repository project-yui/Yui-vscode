import * as vscode from 'vscode';
import { useUserStore } from '../store/user';
const renderRequestHandle: Record<string, (req: any) => any> = {
    'get-account-list': (req) => {
        const { getAllAccount } = useUserStore();
        const account = getAllAccount();
        let result = [];
        for (const uin in account)
        {
            result.push(account[uin]);
        }
        return result;
    },
};

export const registerRenderRequestHandle = (name: string, handle: (req: any) => any) => {
    renderRequestHandle[name] = handle;
};

export const getRenderRequestHandle = (name: string) => renderRequestHandle[name];

export const registerHandleToWebview = (webview: vscode.Webview) => {
    webview.onDidReceiveMessage((data) => {
        if (renderRequestHandle[data.action])
        {
            const result = renderRequestHandle[data.action](data);
            
            webview.postMessage({
                id: data.id,
                result: result,
            });
        }
    });
};