import { BrowserWindow } from 'electron';
import { registerCliHandlers } from './ipcHandlers';

const registerHandlers = (mainWindow: BrowserWindow) => {
  registerCliHandlers(mainWindow);
};

export default registerHandlers;
