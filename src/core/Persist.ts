export type CommentEntry = {
  id: string; // uuid
  workspaceFolder: string; // ルート名 or URI
  fileUri: string; // vscode.Uri.toString()
  relativePath: string; // 表示用
  line: number; // 0-based
  selection?: { start: number; end: number }; // optional: column range
  excerpt: string; // 行の抜粋（最大N文字にトリム）
  comment: string; // ユーザー入力
  createdAt: number;
  updatedAt: number;
  version: 1;
};

export type StateV1 = {
  entries: CommentEntry[];
};
