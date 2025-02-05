import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './projectDetails.module.scss';
import { useAppContext, useIpcPromise } from '../../hooks';
import { Connection, FileNode } from '../../../types/backend';
import {
  ExtractModal,
  Editor,
  TreeViewer,
  AddConnectionModal,
} from '../../components';
import { extractConnections } from '../../helpers';

const ProjectDetails: React.FC = () => {
  const { projects, onDeleteProject } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const invokeGetDirectories = useIpcPromise<{ path: string }, FileNode>(
    'project:getDirectory',
  );
  const invokeGetFileContent = useIpcPromise<{ path: string }, string>(
    'project:readFile',
  );
  const invokeSaveFileContent = useIpcPromise<
    { path: string; content: string },
    boolean
  >('project:updateFile');

  const [directories, setDirectories] = React.useState<FileNode>();
  const [selectedFilePath, setSelectedFilePath] = React.useState<string>();
  const [fileContent, setFileContent] = React.useState<string>();
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [mainConf, setMainConf] = React.useState<string>();
  const [isExtractModalOpen, setIsExtractModalOpen] = React.useState(false);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] =
    React.useState(false);

  const project = React.useMemo(
    () => projects.find((_project) => _project.id === id),
    [id, projects],
  );

  const fetchDirectories = async () => {
    if (project && project.path) {
      const res = await invokeGetDirectories({ path: project.path });
      setDirectories(res);
      const mainConfRes = await invokeGetFileContent({
        path: `${project.path}/main.conf`,
      });
      setMainConf(mainConfRes);
      setConnections(extractConnections(mainConfRes));
    }
  };

  React.useEffect(() => {
    if (project && project.path) {
      fetchDirectories();
    }
  }, [project]);

  React.useEffect(() => {
    if (id) {
      setSelectedFilePath(undefined);
    }
  }, [id]);

  if (!project || !project.path) {
    navigate('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Project Details: {project.name}</h2>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => onDeleteProject(project)}
            style={{ background: 'red' }}
          >
            Delete
          </button>
          <button onClick={() => setIsExtractModalOpen(true)} type="button">
            Extract
          </button>
          <button
            onClick={() => setIsAddConnectionModalOpen(true)}
            type="button"
          >
            Add Connection
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          {directories && (
            <TreeViewer
              node={directories}
              onFileSelect={async (filePath) => {
                const content = await invokeGetFileContent({ path: filePath });
                setSelectedFilePath(filePath);
                setFileContent(content);
              }}
            />
          )}
          <button type="button" onClick={fetchDirectories}>
            Refresh Directories
          </button>
        </div>
        <div className={styles.main}>
          {selectedFilePath && (
            <div>
              <Editor
                filePath={selectedFilePath}
                content={fileContent ?? ''}
                setContent={setFileContent}
              />
              <button
                type="button"
                onClick={async () => {
                  await invokeSaveFileContent({
                    path: selectedFilePath,
                    content: fileContent ?? '',
                  });
                  fetchDirectories();
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
      <ExtractModal
        isOpen={isExtractModalOpen}
        onClose={() => setIsExtractModalOpen(false)}
        connections={connections}
        projectPath={project.path}
        successCallback={async () => {
          await fetchDirectories();
          setIsExtractModalOpen(false);
        }}
      />
      {mainConf && (
        <AddConnectionModal
          isOpen={isAddConnectionModalOpen}
          onClose={() => setIsAddConnectionModalOpen(false)}
          onSuccessCallback={() => {}}
          project={project}
          yamlContent={mainConf}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
