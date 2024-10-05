import * as vscode from 'vscode';
import * as fs from 'fs';
import { useLogger } from '../common/log';
import { FriendGroupItemType } from './types';

const log = useLogger('FriendTree');
export class FriendTreeProvider implements vscode.TreeDataProvider<FriendItem> {
    public static readonly viewId = 'yukihana.friendTreeView';
    private friendList: FriendGroupItemType[] = [];
    public uin: `${number}` = '0';
    
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    constructor() { }

    getTreeItem(element: FriendItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FriendItem): Thenable<FriendItem[]> {
        log.info('get children:', element);
        if (element) {
            const group = this.friendList.find(e => `${e.id}` === element.id);
            const ret = group?.friendList.map(e => new FriendItem(e.uin, e.nick, e.remark, e.avatarUrl, vscode.TreeItemCollapsibleState.None));
            
            return Promise.resolve(ret || []);
        }
        else
        {
            const groups = this.friendList.map<FriendItem>(e => new FriendItem(`${e.id}`, e.name, '', '', vscode.TreeItemCollapsibleState.Collapsed));
            return Promise.resolve(groups);
        }
    }
    updateGroupData(uin: `${number}`, data: FriendGroupItemType[]) {
        this.uin = uin;
        this.friendList = data;
        this._onDidChangeTreeData.fire(undefined);
    }
}

class FriendItem extends vscode.TreeItem {
    constructor(
        public readonly id: string,
        public readonly label: string,
        private remark: string,
        private avatarUrl: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.remark}`;
        this.description = this.remark;
        if (this.avatarUrl.length > 0) {
            this.iconPath = vscode.Uri.parse(this.avatarUrl);
        }
    }
    
}