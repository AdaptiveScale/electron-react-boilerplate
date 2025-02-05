export type Project = {
  id: string;
  name: string;
  path?: string;
  createdAt: string;
  isCompleted: boolean;
};

export type SettingsType = {
  rosettaPath: string;
  rosettaVersion: string;
  projectsDirectory: string;
};

export type FileDialogProperties = 'openFile' | 'openDirectory';

export type DataBase = {
  projects: Project[];
  settings: SettingsType;
};

export type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

export type Connection = {
  name: string;
  databaseName: string;
  schemaName: string;
  dbType: string;
  url: string;
  userName: string;
  password: string;
};
