import * as vscode from 'vscode';
import * as path from 'path';
import { blogFile } from './blog-file';
import { blogOperate } from './blog-operate';
import { PostState, PostBaseInfo } from './shared';

export class BlogPostProvider implements vscode.TreeDataProvider<BlogPostItem>, vscode.FileSystemProvider {

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    public async refresh(): Promise<any> {
        let posts = await blogOperate.getRecentPosts(40);
        await blogFile.pullPosts(posts);
        this._onDidChangeTreeData.fire();
    }

    private _onDidChangeFile: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    constructor(private context: vscode.ExtensionContext) {
        this._onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    }

    get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
        return this._onDidChangeFile.event;
    }

    watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
        throw new Error("Method not implemented.");
    }

    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        throw new Error("Method not implemented.");
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw new Error("Method not implemented.");
    }

    createDirectory(uri: vscode.Uri): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
    readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    delete(uri: vscode.Uri, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    getTreeItem(element: BlogPostItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: BlogPostItem | undefined): vscode.ProviderResult<BlogPostItem[]> {
        const postBaseInfos = blogFile.readPosts();
        return postBaseInfos.map<BlogPostItem>((postBaseInfo) => {
            return {
                label: postBaseInfo.title,
                postBaseInfo: postBaseInfo,
                contextValue: 'BlogPostItem',
                command: {
                    command: 'writeCnblog.openPost', title: "打开文章", arguments: [vscode.Uri.file(postBaseInfo.fsPath!)]
                },
                iconPath: this.getIcon(postBaseInfo.state)
            };
        });
    }

    private getIcon(state?: PostState): string | undefined {
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

export class BlogPostItem extends vscode.TreeItem {
    postBaseInfo: PostBaseInfo | undefined;
}
