import { BrowserWindow } from 'electron';
import { registerCliHandlers, registerProjectHandlers } from './ipcHandlers';

const registerHandlers = (mainWindow: BrowserWindow) => {
  registerCliHandlers(mainWindow);
  registerProjectHandlers();
};

export default registerHandlers;
