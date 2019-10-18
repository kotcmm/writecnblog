import * as vscode from 'vscode';
import { blogOperate } from './blog-operate';
import { CategoryInfoStruct } from '../rpc/rpc-package';

export class BlogCategoriesProvider implements vscode.TreeDataProvider<vscode.TreeItem>{

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    private categories: Array<CategoryInfoStruct> | undefined;

    public async refresh(): Promise<any> {
        this.categories = await blogOperate.getCategories();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {

        if (this.categories) {
            return this.categories.map(c => {
                return {
                    id: c.categoryid,
                    label: c.title,
                    description: c.categoryid
                };
            });
        } else {
            this.refresh();
        }
        return [];

    }
}

export const blogCategoriesProvider = new BlogCategoriesProvider();