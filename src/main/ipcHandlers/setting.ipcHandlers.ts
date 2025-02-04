import { BrowserWindow, dialog, ipcMain } from 'electron';
import { initializeDataStorage } from '../utils/setupHelpers';
import { SettingsService } from '../services';
import { FileDialogProperties, SettingsType } from '../../types/backend';

const registerSettingsHandlers = (mainWindow: BrowserWindow) => {
  initializeDataStorage();

  ipcMain.handle('settings:load', async () => {
    return SettingsService.loadSettings();
  });

  ipcMain.handle('settings:save', async (_event, body: SettingsType) => {
    return SettingsService.saveSettings(body);
  });

  ipcMain.handle(
    'settings:dialog',
    async (_event, body: { property: FileDialogProperties }) => {
      console.log('property', body.property);
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: [body.property],
      });
      return result.filePaths;
    },
  );
};

export default registerSettingsHandlers;
