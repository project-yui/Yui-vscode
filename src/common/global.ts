import * as vscode from 'vscode';

let context: vscode.ExtensionContext | undefined = undefined;

export const useGlobal = () => ({
    setContext: (ctx: vscode.ExtensionContext) => context = ctx,
    getContext: () => {
        if (!context)
        {
            throw new Error('context not set!');
        }
        return context;
    }
});
