import * as vscode from 'vscode';

export class Logger {
  private static outputChannel: vscode.OutputChannel;

  static init() {
    this.outputChannel = vscode.window.createOutputChannel(
      'Line Comment Collector',
    );
  }

  static log(message: string) {
    this.outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`);
  }

  static show() {
    this.outputChannel.show();
  }

  static dispose() {
    this.outputChannel.dispose();
  }
}
