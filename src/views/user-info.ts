import * as vscode from 'vscode';
import { useWSServer } from '../server/websocket';
import { EventDataType } from '../server/types';
import { useLogger } from '../common/log';
import { QrCodeResponse } from '../commands/login';
import { QuickLoginItem } from './types';
import { getHtml } from '../common/webview';

const log = useLogger('UserInfoView');
export class UserInfoViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewId = 'yukihana.userInfoView';

	private _view?: vscode.WebviewView;
    private _page: string = 'login.html';

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
        log.info('resolveWebviewView');
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        const { getServerEventHandle } = useWSServer();
        const handle = getServerEventHandle();
    
        const update = (resp: EventDataType<any>) => {
            log.info('qrcode error:', resp);
            switch (resp.detailType) {
                case 'qrcode_error':
                    webviewView.webview.postMessage({ command: 'timeout' });
                    break;
                case 'qrcode_scaned':
                    webviewView.webview.postMessage({
                        command: 'scaned',
                        data: {
                            avatarUrl: resp.data.avatar_url
                        },
                    });
                    break;
                case 'qrcode_userLogged':
                    vscode.window.showWarningMessage(`${resp.data.uin} 已经是登录状态，不能重复登录！`);
                    this.jump('user-info.html');
                    break;
                case 'qrcode_success':
                    vscode.window.showInformationMessage(`${resp.data.uin} 登录成功！`);
                    this.jump('user-info.html');
                    break;
                default:
                    break;
            }
        };
        const loadQrCode = async () => {
            handle.removeListener('qrcode_error', update);
            const ws = useWSServer();
            const resp = await ws.send<{}, QrCodeResponse>('login_by_qrcode', {});
            webviewView.webview.postMessage({ command: 'qrcode', data: resp.qrCodeImage });
            handle.once('qrcode_error', update);
            handle.once('qrcode_scaned', update);
            handle.once('qrcode_success', update);
            handle.once('qrcode_userLogged', update);
            setTimeout(() => {
                handle.removeListener('qrcode_error', update);
                handle.removeListener('qrcode_scaned', update);
                handle.removeListener('qrcode_success', update);
                handle.removeListener('qrcode_userLogged', update);
            }, (resp.expireTime + 5) * 1000);
        };
    
        const loadQuickList = async () => {
            const ws = useWSServer();
            const list = await ws.send<any, QuickLoginItem[]>('get_quick_login_list', {});
            webviewView.webview.postMessage({ command: 'quick-login-list', data: list });
        };
        const quickLogin = async (uin: `${number}`) => {
            const ws = useWSServer();

            try{
                const ret = await ws.send<any, QuickLoginItem[]>('quick_login_by_uin', {
                    uin
                });
                this._page = 'user-info.html';
                this.refresh();
            }
            catch(err: any) {
                log.error('quick login failed:', err);
                webviewView.webview.postMessage({ command: 'quick-login-result', data: err?.message ?? '???' });
            
            }
        };
        webviewView.webview.onDidReceiveMessage((data) => {
            log.info('receive from webview:', data);
            if(data.command === 'refresh-qrcode')
            {
                loadQrCode();
            }
            else if (data.command === 'query-quickList')
            {
                loadQuickList();
            }
            else if (data.command === 'query-qrcode')
            {
                loadQrCode();
            }
            else if (data.command === 'quick-login')
            {
                quickLogin(data.data.uin);
            }
            else
            {
                this.userInfoMsg(data);
            }
        });
	}

    private userInfoMsg(data: any) {
        const queryUserInfo = async () => {
            const { send } = useWSServer();
            const info = await send('get_self_info', {});
            this._view?.webview.postMessage({
                command: 'update-user-info',
                data: info,
            });
        };
        if(data.command === 'query-user-info')
        {
            queryUserInfo();
        }
    }

	public changePage(page: string) {
		if (this._view) {
            this._page = page;
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
		}
	}

	public clearColors() {
		if (this._view) {
			this._view.webview.postMessage({ type: 'clearColors' });
		}
	}

    private jump(page: string) {
        this._page = page;
		if (this._view) {
		    this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }
    private refresh() {
		if (this._view) {
		    this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }
	private _getHtmlForWebview(webview: vscode.Webview) {
		return getHtml(webview, this._page);
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
