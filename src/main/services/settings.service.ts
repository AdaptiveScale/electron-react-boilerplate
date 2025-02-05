import fs from 'fs';
import { DB_FILE } from '../utils/setupHelpers';
import { SettingsType } from '../../types/backend';
import {
  loadDatabaseFile,
  loadDefaultSettings,
  updateDatabase,
} from '../utils/fileHelper';

export default class SettingsService {
  static loadSettings(): SettingsType {
    const dataBase = loadDatabaseFile();
    if (!dataBase.settings) {
      const defaultSettings = loadDefaultSettings();
      updateDatabase<'settings'>('settings', defaultSettings);
      return defaultSettings;
    }
    return dataBase.settings;
  }

  static saveSettings(settings: SettingsType) {
    updateDatabase<'settings'>('settings', settings);
    const { projects } = loadDatabaseFile();
    fs.writeFileSync(DB_FILE, JSON.stringify({ projects, settings }, null, 2));
  }
}
