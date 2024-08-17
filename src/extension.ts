// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { install } from './utils/install';
import { ChildProcess, ChildProcessWithoutNullStreams, spawn, spawnSync } from 'child_process';
import path from 'path';
import { existsSync, rmSync, rmdirSync } from 'fs';

let qqProcess: ChildProcessWithoutNullStreams | null = null;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "qq" is now active!');
	console.log('current path:', __dirname);
	{
		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		// package.json提供入口，具体逻辑需要注册
		let disposable = vscode.commands.registerCommand('yukihana.helloWorld', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from hot-vscode!');
		});

		context.subscriptions.push(disposable);
	}
	{
		let installCommand = vscode.commands.registerCommand('yukihana.install', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			try {
					
				if(context.globalState.get<boolean>('yukihana.install'))
				{
					vscode.window.showInformationMessage('Already installed!');
					return;
				}
				await install();
				await context.globalState.update('yukihana.install', true);
				vscode.window.showInformationMessage('Install successful!');
			} catch (error) {
				console.log(error);
			}
		});

		context.subscriptions.push(installCommand);
		let installForceCommand = vscode.commands.registerCommand('yukihana.install-force', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			if (qqProcess !== null)
			{
				const stdin = qqProcess.stdin;
				(stdin as any).pause();
				qqProcess.kill();
				(stdin as any).resume();
			}
			// qqProcess?.disconnect()
			// qqProcess = null;
			try {
				// 删除asar时会失败，得加这一行
				(process as any).noAsar = true;
				console.log('delete');
				console.log('remove program');
				const p = path.resolve(__dirname, './program');
				if (existsSync(p))
				{
					rmSync(p, {recursive: true});
				}
				await install();
				await context.globalState.update('yukihana.install', true);
				vscode.window.showInformationMessage('Install successful!');
			} catch (error) {
				console.log(error);
			};
		});

		context.subscriptions.push(installForceCommand);
	}
	{
		let installCommand = vscode.commands.registerCommand('yukihana.start', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			// TODO: 启动后台服务
			vscode.window.showInformationMessage('Start...');
			const exePath = path.resolve(__dirname, './program/QQ.exe');
			console.log('exe:', exePath);
			const cp = require('child_process');
			// 有日志，但是kill杀不死，仅调试用
			// qqProcess = cp.spawn('cmd.exe', ['/C', `${exePath} > .\\tmp\\output.log 2>&1`], {
			qqProcess = cp.spawn(exePath, ['resources/app/app_launcher/index.js'], {
				
				env: {
					...process.env,
					YUKIHANA_LOG: 'true',
					ELECTRON_RUN_AS_NODE: '1',
					YUKIHANA_ACTION: 'dev',
					YUKIHANA_NATIVE: "D:/GitHub/Yukihana-native/build/nt_native.node",
				
				},
				detached: true,
				cwd: path.resolve(__dirname, './program'),
			});
		});

		context.subscriptions.push(installCommand);
	}
	{
		let installCommand = vscode.commands.registerCommand('yukihana.stop', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			console.log('stop');
			if (qqProcess !== null && qqProcess.pid)
			{
				// qqProcess.kill('SIGTERM');
				qqProcess.kill();
			}
			
		});

		context.subscriptions.push(installCommand);
	}
	{
		if (!context.globalState.get<boolean>('yukihana.install'))
		{
			// 未安装
			vscode.window.showInformationMessage('未安装，是否安装？', '安装', '不安装')
			.then(v => {
				if (v !== undefined)
				{
					if (v === '安装')
					{
						vscode.commands.executeCommand('yukihana.install');
					}
				}
			});
			
		}
		else
		{
			// 已安装，启动
			vscode.commands.executeCommand('yukihana.start');
		}
	}
	
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate');
	// 清理数据
	qqProcess?.kill();
}
