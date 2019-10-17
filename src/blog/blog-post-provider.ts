import * as vscode from 'vscode';
import * as path from 'path';
import { blogFile } from './blog-file';
import { PostState, PostBaseInfo } from './shared';

export class BlogPostProvider implements vscode.TreeDataProvider<BlogPostItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    public async refresh(): Promise<any> {
        this._onDidChangeTreeData.fire();
    }

    private context: vscode.ExtensionContext | undefined;

    public initialize(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    getTreeItem(element: BlogPostItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: BlogPostItem | undefined): vscode.ProviderResult<BlogPostItem[]> {
        const postBaseInfos = blogFile.readPosts();
        return postBaseInfos.sort((a, b) => {
            return a.state - b.state;
        }).map<BlogPostItem>((postBaseInfo) => {
            return {
                label: postBaseInfo.title,
                postBaseInfo: postBaseInfo,
                contextValue: this.getContextValue(postBaseInfo),
                command: {
                    command: 'writeCnblog.openPost', title: "打开文章", arguments: [vscode.Uri.file(postBaseInfo.fsPath)]
                },
                iconPath: this.getIcon(postBaseInfo.state)
            };
        });
    }

    private getContextValue(postBaseInfo: PostBaseInfo): string {
        if (postBaseInfo.state === PostState.M) {
            return 'BlogPostItem-diff';
        } else if (postBaseInfo.state === PostState.U) {
            return 'BlogPostItem-create';
        }
        return 'BlogPostItem';
    }

    private getIcon(state?: PostState): string | undefined {
        if (this.context === undefined) {
            throw new Error("context需要初始化");
        }
        switch (state) {
            case PostState.U:
                return this.context.asAbsolutePath(path.join('resources', 'U.svg'));
            case PostState.M:
                return this.context.asAbsolutePath(path.join('resources', 'M.svg'));
            case PostState.D:
                return this.context.asAbsolutePath(path.join('resources', 'D.svg'));
            default:
                return undefined;
        }


    }
}

export const blogPostProvider = new BlogPostProvider();

export class BlogPostItem extends vscode.TreeItem {
    postBaseInfo: PostBaseInfo | undefined;
}
