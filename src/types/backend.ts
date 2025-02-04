export type Project = {
  id: string;
  name: string;
  path?: string;
  createdAt: string;
  isCompleted: boolean;
};

export type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};
