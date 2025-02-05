import { ipcMain, BrowserWindow } from 'electron';
import { CliService } from '../services';

const cliService = new CliService();

const registerCliHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.removeHandler('cli:run');
  ipcMain.removeHandler('cli:input');
  ipcMain.removeHandler('cli:stop');
  ipcMain.removeHandler('cli:setPath');
  ipcMain.removeHandler('cli:status');

  ipcMain.removeAllListeners('cli:output');
  ipcMain.removeAllListeners('cli:error');
  ipcMain.removeAllListeners('cli:done');

  ipcMain.handle('cli:run', async (_event, args: string) => {
    try {
      await cliService.runCommand(mainWindow, args);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('cli:status', () => {
    return cliService.getStatus();
  });

  ipcMain.handle('cli:setPath', (_event, input: string) => {
    cliService.setPath(input);
  });

  ipcMain.on('cli:input', (_event, input: string) => {
    cliService.sendInput(input);
  });

  ipcMain.on('cli:stop', () => {
    cliService.stopCommand();
  });
};

export default registerCliHandlers;
