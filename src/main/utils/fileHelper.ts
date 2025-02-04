import path from 'path';
import fs from 'fs';
import { FileNode } from '../../types/backend';

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
    console.error(`Error saving file ${filePath}:`, error);
    return false;
  }
};
