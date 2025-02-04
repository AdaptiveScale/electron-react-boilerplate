import React from 'react';
import { AppContextType } from '../../types/frontend';
import { Splash } from '../components';
import { useIpcPromise } from '../hooks';
import { Project, SettingsType } from '../../types/backend';

type Props = {
  children: React.ReactNode;
};

export const AppContext = React.createContext<AppContextType>({
  projects: [],
  onSaveProject: () => {
    return new Promise(() => {});
  },
  onUpdateProject: () => {},
  onDeleteProject: () => {},
  onSelectProject: () => {},
  settings: {} as SettingsType,
  onSettingsUpdate: () => {},
});

const AppProvider: React.FC<Props> = ({ children }) => {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const invokeGetProjects = useIpcPromise<undefined, Project[]>('project:list');
  const invokeSaveProject = useIpcPromise<{ name: string }>('project:add');
  const invokeUpdateProject = useIpcPromise<Project>('project:update');
  const invokeDeleteProject = useIpcPromise<{ id: string }, boolean>(
    'project:delete',
  );
  const invokeGetSettings = useIpcPromise<undefined, SettingsType>(
    'settings:load',
  );
  const invokeSaveSettings = useIpcPromise<SettingsType, void>('settings:save');

  const [loadingStage, setLoadingStage] =
    React.useState<string>('Loading settings!');

  const [settings, setSettings] = React.useState<SettingsType>(
    {} as SettingsType,
  );
  const [projects, setProjects] = React.useState<Project[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProject, setSelectedProject] = React.useState<Project>();

  const handleLoadSettings = React.useCallback(async () => {
    const data = await invokeGetSettings();
    setSettings(data);
  }, []);

  const handleSaveSettings = React.useCallback(async (body: SettingsType) => {
    await invokeSaveSettings(body);
  }, []);

  const handleLoadProjects = React.useCallback(async () => {
    const data = await invokeGetProjects();
    setProjects(data);
  }, []);

  const handleSaveProject = React.useCallback(
    async (name: string): Promise<Project | undefined> => {
      await invokeSaveProject({ name });
      await handleLoadProjects();
      const data = await invokeGetProjects();
      setProjects(data);
      const newProject = data.find((project) => project.name === name);
      setSelectedProject(newProject);
      return newProject;
    },
    [],
  );

  const handleUpdateProject = React.useCallback(async (project: Project) => {
    await invokeUpdateProject(project);
    await handleLoadProjects();
  }, []);

  const handleDeleteProject = React.useCallback(async (project: Project) => {
    const isSuccess = await invokeDeleteProject({ id: project.id });
    if (isSuccess) {
      await handleLoadProjects();
    }
  }, []);

  const handleSelectProject = (id: string) => {
    setSelectedProject(projects.find((project) => project.id === id));
  };

  const fetchProjects = async (): Promise<void> => {
    await new Promise((resolve) => {
      setTimeout(() => resolve('Loading settings'), 500);
    });
    setLoadingStage('Loading projects!');
    await handleLoadSettings();
    await new Promise((resolve) => {
      setTimeout(() => resolve('Loading data'), 1000);
    });
    setLoadingStage('Getting everything ready!');
    await handleLoadProjects();
    await new Promise((resolve) => {
      setTimeout(() => resolve('Data loaded'), 1000);
    });
    setIsInitializing(false);
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const value: AppContextType = React.useMemo(() => {
    return {
      projects,
      settings,
      selectedProject,
      onSaveProject: handleSaveProject,
      onUpdateProject: handleUpdateProject,
      onDeleteProject: handleDeleteProject,
      onSelectProject: handleSelectProject,
      onSettingsUpdate: handleSaveSettings,
    };
  }, [isInitializing, projects, selectedProject, settings]);

  if (isInitializing) {
    return <Splash loaderMessage={loadingStage} />;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider };
