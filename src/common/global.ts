import * as vscode from 'vscode';

let context: vscode.ExtensionContext | undefined = undefined;

const viewMap = new Map<string, any>();

export const useGlobal = () => ({
    setContext: (ctx: vscode.ExtensionContext) => context = ctx,
    getContext: () => {
        if (!context)
        {
            throw new Error('context not set!');
        }
        return context;
    },
    getView: <T>(name: string) => viewMap.get(name) as T,
    addView: (name: string, view: any) => viewMap.set(name, view),
});
