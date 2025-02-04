import React from 'react';
import styles from './settings.module.scss';
import { useAppContext, useIpcPromise } from '../../hooks';
import { FileDialogProperties, SettingsType } from '../../../types/backend';
import { icons } from '../../../../assets';

const Settings: React.FC = () => {
  const { settings, onSettingsUpdate } = useAppContext();
  const invokeDialog = useIpcPromise<
    { property: FileDialogProperties },
    string
  >('settings:dialog');
  const [localSettings, setLocalSettings] =
    React.useState<SettingsType>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleFilePicker = async (name: keyof SettingsType, isDir: boolean) => {
    const filePaths = await invokeDialog({
      property: isDir ? 'openDirectory' : 'openFile',
    });
    if (filePaths.length > 0) {
      setLocalSettings((prevSettings) => ({
        ...prevSettings,
        [name]: filePaths[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsUpdate(localSettings);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="rosettaPath">Rosetta Path</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="rosettaPath"
                name="rosettaPath"
                value={localSettings.rosettaPath}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleFilePicker('rosettaPath', false)}
              >
                <img src={icons.folder} alt="search" width={20} height={20} />
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectsDirectory">Projects Directory</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="projectsDirectory"
                name="projectsDirectory"
                value={localSettings.projectsDirectory}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleFilePicker('projectsDirectory', true)}
              >
                <img src={icons.folder} alt="search" width={20} height={20} />
              </button>
            </div>
          </div>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
