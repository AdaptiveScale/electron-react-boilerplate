import { ipcMain } from 'electron';
import { initializeDataStorage } from '../utils/setupHelpers';
import { ProjectsService } from '../services';
import { Project } from '../../types/backend';

const registerProjectHandlers = () => {
  initializeDataStorage();
  //
  // ipcMain.removeHandler('project:list');
  // ipcMain.removeHandler('project:update');
  // ipcMain.removeHandler('project:delete');
  // ipcMain.removeHandler('project:add');

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
};

export default registerProjectHandlers;
