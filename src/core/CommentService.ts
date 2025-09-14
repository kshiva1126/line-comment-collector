import * as vscode from 'vscode';
import { CommentEntry, StateV1 } from './Persist';

export class CommentService {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async add(
    fileUri: string,
    relativePath: string,
    line: number,
    excerpt: string,
    comment: string,
    selection?: { start: number; end: number },
  ): Promise<CommentEntry> {
    const { v4: uuidv4 } = await import('uuid');

    const entry: CommentEntry = {
      id: uuidv4(),
      workspaceFolder: this.getWorkspaceFolder(),
      fileUri,
      relativePath,
      line,
      selection,
      excerpt,
      comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };

    const state = this.load();
    state.entries.push(entry);
    await this.save(state);

    return entry;
  }

  async edit(id: string, newComment: string): Promise<void> {
    const state = this.load();
    const entry = state.entries.find(e => e.id === id);
    if (entry) {
      entry.comment = newComment;
      entry.updatedAt = Date.now();
      await this.save(state);
    }
  }

  async remove(id: string): Promise<void> {
    const state = this.load();
    state.entries = state.entries.filter(e => e.id !== id);
    await this.save(state);
  }

  async clearAll(): Promise<void> {
    const state: StateV1 = { entries: [] };
    await this.save(state);
  }

  getAll(): CommentEntry[] {
    return this.load().entries;
  }

  getByFile(fileUri: string): CommentEntry[] {
    return this.load().entries.filter(entry => entry.fileUri === fileUri);
  }

  private getWorkspaceFolder(): string {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return '';
    }
    return folders[0].uri.toString();
  }

  private load(): StateV1 {
    const state = this.context.workspaceState.get<StateV1>(
      'lineCommentCollector:v1',
    );
    return state || { entries: [] };
  }

  private async save(state: StateV1): Promise<void> {
    await this.context.workspaceState.update('lineCommentCollector:v1', state);
  }
}
