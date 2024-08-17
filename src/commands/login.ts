import * as vscode from 'vscode';
import { useWSServer } from '../server/websocket';
import { useLogger } from '../common/log';
import { useGlobal } from '../common/global';

const log = useLogger('Login');
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
};

interface QrCodeResponse {
    qrCodeImage: string
    qrCodeUrl: string
    expireTime: number
  }
/**
 * 展示登录二维码
 * 
 * @param qrCode base64的二维码
 */
export const scanLoginCommand = async () => {
    const panel = vscode.window.createWebviewPanel(
        'qrCode',
        '扫码',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        });
    const { getContext } = useGlobal();
    const ctx = getContext();
    const scanSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(ctx.extensionUri, 'assets', 'scan.html'));
    const preload = panel.webview.asWebviewUri(vscode.Uri.joinPath(ctx.extensionUri, 'assets', 'preload.js'));
    log.info('scanSrc:', scanSrc);
    panel.webview.html = `
    <body>
        <div id="container"></div><br />
        <script>
            window.pageSrc = '${scanSrc}'
        </script>
        <script src="${preload}" />
    </body>
    `;
    const { getServerEventHandle } = useWSServer();
    const handle = getServerEventHandle();

    const update = (resp: any) => {
        log.info('qrcode error:', resp);
        panel.webview.postMessage({ command: 'timeout' });
    };
    const loadQrCode = async () => {
        handle.removeListener('qrcode_error', update);
        const ws = useWSServer();
        const resp = await ws.send<{}, QrCodeResponse>('login_by_qrcode', {});
        panel.webview.postMessage({ command: 'qrcode', data: resp.qrCodeImage });
        handle.once('qrcode_error', update);
        setTimeout(() => {
            handle.removeListener('qrcode_error', update);
        }, (resp.expireTime + 5) * 1000);
    };

    panel.webview.onDidReceiveMessage((data) => {
        log.info('receive from webview:', data);
        if(data.command === 'refresh-qrcode')
        {
            loadQrCode();
        }
    });
};