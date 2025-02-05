import { ipcMain } from 'electron';
import { ProjectsService } from '../services';
import { Project } from '../../types/backend';

const registerProjectHandlers = () => {
  ipcMain.handle('project:list', async () => {
    return ProjectsService.loadProjects();
  });

  ipcMain.handle('project:add', async (_event, body: { name: string }) => {
    return ProjectsService.addProject(body.name);
  });

  ipcMain.handle('project:update', async (_event, body: Project) => {
    return ProjectsService.updateProject(body);
  });

  ipcMain.handle('project:delete', async (_event, body: { id: string }) => {
    return ProjectsService.deleteProject(body.id);
  });

  ipcMain.handle('project:getPath', async (_event, body: { name: string }) => {
    return ProjectsService.getProjectPath(body.name);
  });

  ipcMain.handle(
    'project:getDirectory',
    async (_event, body: { path: string }) => {
      return ProjectsService.getDirectoryStructure(body.path);
    },
  );

  ipcMain.handle('project:readFile', async (_event, body: { path: string }) => {
    return ProjectsService.readFileContent(body.path);
  });

  ipcMain.handle(
    'project:updateFile',
    async (_event, body: { path: string; content: string }) => {
      return ProjectsService.saveFileContent(body.path, body.content);
    },
  );
};

export default registerProjectHandlers;
