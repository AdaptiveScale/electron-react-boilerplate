import { BrowserWindow } from 'electron';
import {
  registerCliHandlers,
  registerProjectHandlers,
  registerSettingsHandlers,
} from './ipcHandlers';

const registerHandlers = (mainWindow: BrowserWindow) => {
  registerCliHandlers(mainWindow);
  registerSettingsHandlers(mainWindow);
  registerProjectHandlers();
};

export default registerHandlers;
