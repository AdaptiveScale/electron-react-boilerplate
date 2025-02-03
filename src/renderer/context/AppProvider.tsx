import React from 'react';
import { AppContextType } from '../../types/frontend';
import { Splash } from '../components';
import { useIpcPromise } from '../hooks';
import { Project } from '../../types/backend';

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
});

const AppProvider: React.FC<Props> = ({ children }) => {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const invokeGetProjects = useIpcPromise<undefined, Project[]>('project:list');
  const invokeSaveProject = useIpcPromise<{ name: string }>('project:add');
  const invokeUpdateProject = useIpcPromise<Project>('project:update');
  const invokeDeleteProject = useIpcPromise<{ id: string }, boolean>(
    'project:delete',
  );

  const [loadingStage, setLoadingStage] =
    React.useState<string>('Loading projects!');

  const [projects, setProjects] = React.useState<Project[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProject, setSelectedProject] = React.useState<Project>();

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
      setTimeout(() => resolve('Data loaded'), 500);
    });
    setLoadingStage('Getting everything ready!');
    await new Promise((resolve) => {
      setTimeout(() => resolve('Data loaded'), 1000);
    });
    setLoadingStage('Opening project!');
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
      selectedProject,
      onSaveProject: handleSaveProject,
      onUpdateProject: handleUpdateProject,
      onDeleteProject: handleDeleteProject,
      onSelectProject: handleSelectProject,
    };
  }, [isInitializing, projects, selectedProject]);

  if (isInitializing) {
    return <Splash loaderMessage={loadingStage} />;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider };
