import { useGlobal } from "../common/global";
import * as vscode from 'vscode';
import { install } from "../common/install";

export const installNTQQ = async () => {
    const { getContext } = useGlobal();
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    try {
        const ctx = getContext();
        if(ctx.globalState.get<boolean>('yukihana.install'))
        {
            vscode.window.showInformationMessage('Already installed!');
            return;
        }
        await install();
        await ctx.globalState.update('yukihana.install', true);
        vscode.window.showInformationMessage('Install successful!');
    } catch (error) {
        console.log(error);
    }
};