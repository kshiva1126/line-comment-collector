import * as vscode from 'vscode';
import { CommentEntry } from './Persist';

export class DecoratorService {
  private static decorationType: vscode.TextEditorDecorationType;

  static init() {
    this.decorationType = vscode.window.createTextEditorDecorationType({
      gutterIconPath: vscode.Uri.file(
        __dirname + '/../../images/comment-icon.svg',
      ),
      gutterIconSize: 'contain',
      backgroundColor: new vscode.ThemeColor('editor.lineHighlightBackground'),
      isWholeLine: true,
    });
  }

  static dispose() {
    if (this.decorationType) {
      this.decorationType.dispose();
    }
  }

  static updateDecorations(editor: vscode.TextEditor, entries: CommentEntry[]) {
    const decorations: vscode.DecorationOptions[] = [];

    entries.forEach(entry => {
      if (entry.fileUri === editor.document.uri.toString()) {
        decorations.push({
          range: new vscode.Range(entry.line, 0, entry.line, 0),
        });
      }
    });

    editor.setDecorations(this.decorationType, decorations);
  }
}
