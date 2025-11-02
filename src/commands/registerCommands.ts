import * as vscode from 'vscode';
import { CommentService } from '../core/CommentService';
import { showCommentInputWebview } from '../utils/commentInputWebview';

export function registerCommands(
  context: vscode.ExtensionContext,
  commentService: CommentService,
  refreshTree: () => void,
): void {
  // Add comment command
  const addCommentDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.addComment',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const line = selection.active.line;

      // Create excerpt based on selection
      let excerpt = '';
      let selectionRange: { start: number; end: number } | undefined =
        undefined;

      if (selection.isEmpty) {
        // Single line comment
        const textLine = document.lineAt(line);
        excerpt = textLine.text.trim();
      } else {
        // Multi-line comment
        const startLine = selection.start.line;
        const endLine = selection.end.line;
        excerpt = `${document.lineAt(startLine).text.trim()} ... ${document.lineAt(endLine).text.trim()}`;
        selectionRange = { start: startLine, end: endLine };
      }

      const comment = await showCommentInputWebview('Add Line Comment');

      if (comment === undefined) {
        // User cancelled input
        return;
      }

      if (comment === '') {
        vscode.window.showErrorMessage('Comment cannot be empty');
        return;
      }

      const fileUri = document.uri.toString();
      const relativePath = vscode.workspace.asRelativePath(document.uri);

      await commentService.add(
        fileUri,
        relativePath,
        line,
        excerpt,
        comment,
        selectionRange,
      );
      refreshTree();
      vscode.window.showInformationMessage('Comment added successfully');
    },
  );

  // Copy all comments command
  const copyAllDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.copyAll',
    async () => {
      const entries = commentService.getAll();
      if (entries.length === 0) {
        vscode.window.showInformationMessage('No comments to copy');
        return;
      }

      let text = '';
      entries.forEach((entry, index) => {
        // Add file path and line info
        if (entry.selection && entry.selection.start !== entry.selection.end) {
          text += `${entry.relativePath}:L${entry.selection.start + 1}-L${entry.selection.end + 1}
`;
        } else {
          text += `${entry.relativePath}:L${entry.line + 1}
`;
        }

        // Add comment text
        text += `${entry.comment}
`;

        // Add separator line between comments (except for the last one)
        if (index < entries.length - 1) {
          text += '=====' + '\n';
        }
      });

      await vscode.env.clipboard.writeText(text);
      vscode.window.showInformationMessage('All comments copied to clipboard');
    },
  );

  // Clear all comments command
  const clearAllDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.clearAll',
    async () => {
      const confirm = await vscode.window.showWarningMessage(
        'Are you sure you want to clear all comments?',
        { modal: true },
        'Yes',
      );

      if (confirm === 'Yes') {
        await commentService.clearAll();
        refreshTree();
        vscode.window.showInformationMessage('All comments cleared');
      }
    },
  );

  // Edit comment command
  const editDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.edit',
    async (item: any) => {
      // Extract the actual CommentEntry from LineNode if needed
      const entry = item?.entry || item;

      if (!entry || !entry.id) {
        vscode.window.showErrorMessage('Invalid comment entry');
        return;
      }

      const newComment = await showCommentInputWebview(
        'Edit Comment',
        entry.comment,
      );

      if (newComment === undefined) {
        // User cancelled input
        return;
      }

      if (newComment === '') {
        vscode.window.showErrorMessage('Comment cannot be empty');
        return;
      }

      await commentService.edit(entry.id, newComment);
      refreshTree();
      vscode.window.showInformationMessage('Comment updated successfully');
    },
  );

  // Delete comment command
  const deleteDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.delete',
    async (item: any) => {
      // Extract the actual CommentEntry from LineNode if needed
      const entry = item?.entry || item;

      if (!entry || !entry.id) {
        vscode.window.showErrorMessage('Invalid comment entry');
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `Are you sure you want to delete the comment on line ${entry.line + 1}?`,
        { modal: true },
        'Yes',
      );

      if (confirm === 'Yes') {
        await commentService.remove(entry.id);
        refreshTree();
        vscode.window.showInformationMessage('Comment deleted');
      }
    },
  );

  // Reveal in editor command
  const revealDisposable = vscode.commands.registerCommand(
    'lineCommentCollector.reveal',
    async (item: any) => {
      // Extract the actual CommentEntry from LineNode if needed
      const entry = item?.entry || item;

      if (!entry || !entry.fileUri) {
        vscode.window.showErrorMessage('Invalid comment entry');
        return;
      }

      try {
        const uri = vscode.Uri.parse(entry.fileUri);
        const document = await vscode.workspace.openTextDocument(uri);
        const editor = await vscode.window.showTextDocument(document);

        // Create range based on selection if available
        let range: vscode.Range;
        if (entry.selection) {
          // Multi-line selection
          const start = new vscode.Position(entry.selection.start, 0);
          const endLine = document.lineAt(entry.selection.end);
          const end = new vscode.Position(
            entry.selection.end,
            endLine.text.length,
          );
          range = new vscode.Range(start, end);
        } else {
          // Single line
          const position = new vscode.Position(entry.line, 0);
          range = new vscode.Range(position, position);
        }

        editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        editor.selection = new vscode.Selection(range.start, range.end);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to open file: ${error}`);
      }
    },
  );

  context.subscriptions.push(
    addCommentDisposable,
    copyAllDisposable,
    clearAllDisposable,
    editDisposable,
    deleteDisposable,
    revealDisposable,
  );
}
