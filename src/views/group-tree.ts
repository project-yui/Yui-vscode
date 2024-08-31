import * as vscode from 'vscode';
import * as fs from 'fs';
import { useLogger } from '../common/log';
import { GroupDetailInfoResp, GroupGroupItemType, GroupItemType } from './types';

const log = useLogger('GroupTree');
export class GroupTreeProvider implements vscode.TreeDataProvider<GroupItem> {
    public static readonly viewId = 'yukihana.groupTreeView';
    private groupList: GroupGroupItemType[] = [];
    
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    constructor() { }

    getTreeItem(element: GroupItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GroupItem): Thenable<GroupItem[]> {
        log.info('get children:', element);
        if (element) {
            const group = this.groupList.find(e => `${e.id}` === element.id);
            const ret = group?.groupList.map(e => new GroupItem(e.id, e.name, e.code, e.avatarUrl, vscode.TreeItemCollapsibleState.None));
            
            return Promise.resolve(ret || []);
        }
        else
        {
            const groups = this.groupList.map<GroupItem>(e => new GroupItem(`${e.id}`, e.name, '', '', vscode.TreeItemCollapsibleState.Collapsed));
            return Promise.resolve(groups);
        }
    }
    updateGroupData(list: GroupDetailInfoResp[]) {
        // 置顶群聊
        const topGroup: GroupGroupItemType = {
          id: 0,
          name: "置顶群聊",
          type: "top",
          groupList: []
        };
        // 未命名
        const unnameGroup: GroupGroupItemType = {
          id: 1,
          name: "未命名的群聊",
          type: "unname",
          groupList: []
        };
        // 我创建的群聊
        const createGroup: GroupGroupItemType = {
          id: 2,
          name: "我创建的群聊",
          type: 'create',
          groupList: []
        };
        // 我管理的群聊
        const manageGroup: GroupGroupItemType = {
          id: 3,
          name: "我管理的群聊",
          type: 'manage',
          groupList: []
        };
        // 加入的其它群聊
        const joinGroup: GroupGroupItemType = {
          id: 4,
          name: "我加入的群聊",
          type: 'join',
          groupList: []
        };
        let i = 5;
        for(const group of list)
        {
            if (group.top)
            {
                const g: GroupItemType = {
                    id: `${i++}`,
                    code: group.code,
                    name: group.name,
                    avatarUrl: group.avatar_url,
                    role: group.role,
                    top: group.top,
                    toppedTimestamp: group.topped_timestamp,
                };
                topGroup.groupList.push(g);
            }
            if (group.is_conf)
            {
                const g: GroupItemType = {
                    id: `${i++}`,
                    code: group.code,
                    name: group.name,
                    avatarUrl: group.avatar_url,
                    role: group.role,
                    top: group.top,
                    toppedTimestamp: group.topped_timestamp,
                };
                unnameGroup.groupList.push(g);
            }
            const g: GroupItemType = {
                id: `${i++}`,
                code: group.code,
                name: group.name,
                avatarUrl: group.avatar_url,
                role: group.role,
                top: group.top,
                toppedTimestamp: group.topped_timestamp,
            };
            if (g.role === 'manager')
            {
                manageGroup.groupList.push(g);
            }
            else if (g.role === 'owner')
            {
                createGroup.groupList.push(g);
            }
            else
            {
                joinGroup.groupList.push(g);
            }
        }
        this.groupList = [topGroup, unnameGroup, createGroup, manageGroup, joinGroup];
        this._onDidChangeTreeData.fire(undefined);
    }
}

class GroupItem extends vscode.TreeItem {
    constructor(
        public readonly id: string,
        public readonly label: string,
        private groupCode: string,
        private avatarUrl: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.groupCode}`;
        this.description = this.groupCode;
        if (this.avatarUrl.length > 0) {
            this.iconPath = vscode.Uri.parse(this.avatarUrl);
        }
        if (collapsibleState === vscode.TreeItemCollapsibleState.None)
        {
            this.command = { command: 'yukihana.openGroup', title: "Open Group Chat", arguments: [this.groupCode], };
        }
    }
    
}