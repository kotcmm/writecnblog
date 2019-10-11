import * as vscode from 'vscode';

export class BlogPostProvider implements vscode.TreeDataProvider<BlogPostItem>{

    onDidChangeTreeData?: vscode.Event<BlogPostItem | null | undefined> | undefined;

    getTreeItem(element: BlogPostItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: BlogPostItem | undefined): vscode.ProviderResult<BlogPostItem[]> {
        const treeItem = new BlogPostItem("测试");
        treeItem.contextValue = 'BlogPostItem';
        return [treeItem];
    }
}

export class BlogPostItem extends vscode.TreeItem {

}

export class BlogPostExplorer {

    // private blogPostExplorer: vscode.TreeView<BlogPostItem>;

    constructor(context: vscode.ExtensionContext) {
        const treeDataProvider = new BlogPostProvider();
        vscode.window.createTreeView('blogPostExplorer', { treeDataProvider });
    }
}