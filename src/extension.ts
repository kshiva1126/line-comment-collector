// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentService } from './core/CommentService';
import { CommentTreeProvider } from './tree/CommentTreeProvider';
import { registerCommands } from './commands/registerCommands';
import { DecoratorService } from './core/Decorator';
import { Logger } from './util/logger';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Initialize logger
  Logger.init();
  Logger.log('Extension activated');

  // Initialize services
  const commentService = new CommentService(context);

  // Initialize decorator service
  DecoratorService.init();

  // Create tree provider
  const treeProvider = new CommentTreeProvider(commentService);
  const treeView = vscode.window.createTreeView('lineCommentCollector.tree', {
    treeDataProvider: treeProvider,
  });

  // Function to update badge with comment count
  const updateBadge = () => {
    const count = commentService.getAll().length;
    if (count > 0) {
      treeView.badge = {
        value: count,
        tooltip: `${count} comment${count === 1 ? '' : 's'}`,
      };
    } else {
      treeView.badge = undefined;
    }
  };

  // Initial badge update
  updateBadge();

  // Register commands
  registerCommands(context, commentService, () => {
    treeProvider.refresh();
    updateBadge();
  });

  // Update decorations when active editor changes
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      DecoratorService.updateDecorations(editor, commentService.getAll());
    }
  });

  // Update decorations when text changes
  vscode.workspace.onDidChangeTextDocument(event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
      DecoratorService.updateDecorations(editor, commentService.getAll());
    }
  });

  context.subscriptions.push(treeView);
}

// This method is called when your extension is deactivated
export function deactivate() {
  DecoratorService.dispose();
  Logger.dispose();
}
