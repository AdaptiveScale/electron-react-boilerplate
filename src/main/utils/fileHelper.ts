import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { DataBase, FileNode, SettingsType } from '../../types/backend';
import { DATA_DIR, DB_FILE } from './setupHelpers';

export const getDirectoryStructure = (dirPath: string): FileNode => {
  const result: FileNode = {
    name: path.basename(dirPath),
    path: dirPath,
    type: 'folder',
    children: [],
  };

  try {
    const files = fs.readdirSync(dirPath);

    result.children = files.map((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        return getDirectoryStructure(filePath);
      }
      return { name: file, path: filePath, type: 'file' };
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return result;
};

export const readFileContent = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

export const saveFileContent = (filePath: string, content: string): boolean => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteDirectory = (dirPath: string): boolean => {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error(`Error deleting directory ${dirPath}:`, error);
    return false;
  }
};

export const loadDefaultSettings = (): SettingsType => {
  return {
    rosettaPath: app.isPackaged
      ? path.join(
          process.resourcesPath,
          'bin',
          'rosetta',
          'rosetta-2.7.0-mac_aarch64',
          'bin',
          'rosetta',
        )
      : path.join(
          __dirname,
          '../../bin/rosetta/rosetta-2.7.0-mac_aarch64/bin/rosetta',
        ),
    rosettaVersion: '2.7.0',
    projectsDirectory: DATA_DIR,
  };
};

export const loadDatabaseFile = (): DataBase => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { projects: [], settings: loadDefaultSettings() };
  }
};

export const updateDatabase = <K extends keyof DataBase>(
  key: K,
  value: DataBase[K],
) => {
  const data = loadDatabaseFile();
  data[key] = value;
  saveFileContent(DB_FILE, JSON.stringify(data, null, 2));
};
