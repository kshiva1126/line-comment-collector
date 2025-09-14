import * as vscode from 'vscode';
import { CommentService } from '../core/CommentService';
import { CommentEntry } from '../core/Persist';
import { FileNode, LineNode } from './TreeNodes';

export class CommentTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor(private readonly commentService: CommentService) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: vscode.TreeItem,
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (!element) {
      // Root level - return files
      const entries = this.commentService.getAll();
      const fileMap = new Map<string, CommentEntry[]>();

      // Group entries by file
      entries.forEach(entry => {
        if (fileMap.has(entry.relativePath)) {
          fileMap.get(entry.relativePath)!.push(entry);
        } else {
          fileMap.set(entry.relativePath, [entry]);
        }
      });

      // Convert to FileNodes
      const fileNodes: FileNode[] = [];
      fileMap.forEach((entries, relativePath) => {
        fileNodes.push(new FileNode(relativePath, entries));
      });

      return Promise.resolve(fileNodes);
    } else if (element instanceof FileNode) {
      // File level - return line comments
      const lineNodes: LineNode[] = [];
      element.entries.forEach(entry => {
        lineNodes.push(new LineNode(entry));
      });
      return Promise.resolve(lineNodes);
    } else {
      // Line level - no children
      return Promise.resolve([]);
    }
  }
}
