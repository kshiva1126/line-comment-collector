import * as vscode from 'vscode';
import { CommentEntry } from '../core/Persist';

export class FileNode extends vscode.TreeItem {
  public readonly entries: CommentEntry[];

  constructor(
    public readonly relativePath: string,
    entries: CommentEntry[],
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed,
  ) {
    super(relativePath, collapsibleState);
    this.entries = entries;
    this.contextValue = 'file';
    this.iconPath = new vscode.ThemeIcon('file-code');
  }
}

export class LineNode extends vscode.TreeItem {
  constructor(
    public readonly entry: CommentEntry,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None,
  ) {
    super(`${entry.line + 1}: ${entry.excerpt}`, collapsibleState);
    this.description = entry.comment;
    this.contextValue = 'comment';
    this.iconPath = new vscode.ThemeIcon('comment');
    this.command = {
      command: 'lineCommentCollector.reveal',
      title: 'Reveal in Editor',
      arguments: [entry],
    };
  }
}
