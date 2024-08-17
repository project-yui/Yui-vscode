import * as vscode from 'vscode';
import { useWSServer } from '../server/websocket';

/**
 * 展示登录二维码
 * 
 * @param qrCode base64的二维码
 */
const showQRCode = (qrCode: string) => {
    const panel = vscode.window.createWebviewPanel('qrCode', '扫码', vscode.ViewColumn.One, {});
    panel.webview.html = `
    <body>
        <img src="${qrCode}" />
    </body>
    `;
};
export const loginCommand = async () => {
    console.log('login command');
    const id = await vscode.window.showInputBox({
        title: '账号'
    });
    if (!id) {return;}
    const pass = await vscode.window.showInputBox({
        title: `请输入密码`,
        password: true,
        prompt: `请输入${id}的密码`
    });
    if (!pass) {return;}
    console.log('账号：', id, '密码：', pass);
    showQRCode('data:image/png;base64,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');
};

interface QrCodeResponse {
    qrCodeImage: string
    qrCodeUrl: string
    expireTime: number
  }
export const scanLoginCommand = async () => {
    const ws = useWSServer();
    const resp = await ws.send<{}, QrCodeResponse>('login_by_qrcode', {});
    console.log('qr login:', resp);
    showQRCode(resp.qrCodeImage);
};