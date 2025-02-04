import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './projectDetails.module.scss';
import { useAppContext, useIpcPromise } from '../../hooks';
import { FileNode } from '../../../types/backend';
import { Editor, TreeViewer } from '../../components';

const ProjectDetails: React.FC = () => {
  const { projects, onDeleteProject } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const { output, error, isRunning, runCommand, sendInput, stopCommand } =
  //   useCli();
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

  const project = React.useMemo(
    () => projects.find((_project) => _project.id === id),
    [id, projects],
  );

  const fetchDirectories = async () => {
    if (project && project.path) {
      const res = await invokeGetDirectories({ path: project.path });
      setDirectories(res);
    }
  };

  const handleDBTAction = async () => {
    fetchDirectories();
  };

  const handleTranspileAction = async () => {
    fetchDirectories();
  };

  useEffect(() => {
    if (project && project.path) {
      fetchDirectories();
    }
  }, [project]);

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
          <button type="button" onClick={handleDBTAction}>
            DBT
          </button>
          <button type="button" onClick={handleTranspileAction}>
            Transpile
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
    </div>
  );
};

export default ProjectDetails;
