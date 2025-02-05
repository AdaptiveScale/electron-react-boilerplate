import { Project, SettingsType } from './backend';

export type AppContextType = {
  projects: Project[];
  selectedProject?: Project;
  onSelectProject: (id: string) => void;
  onSaveProject: (name: string) => Promise<Project | undefined>;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  settings: SettingsType;
  onSettingsUpdate: (settings: SettingsType) => void;
};
