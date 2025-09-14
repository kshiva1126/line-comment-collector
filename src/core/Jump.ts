import * as vscode from 'vscode';
import { CommentEntry } from './Persist';

export class JumpService {
  static async toComment(entry: CommentEntry): Promise<void> {
    try {
      const uri = vscode.Uri.parse(entry.fileUri);
      const document = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(document);

      const position = new vscode.Position(entry.line, 0);
      const range = new vscode.Range(position, position);
      editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
      editor.selection = new vscode.Selection(position, position);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open file: ${error}`);
    }
  }
}
