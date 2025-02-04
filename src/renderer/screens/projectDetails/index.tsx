import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './projectDetails.module.scss';
import { useAppContext, useIpcPromise } from '../../hooks';
import { FileNode } from '../../../types/backend';
import { TreeViewer, Editor } from '../../components';

type Params = {
  id: string;
};

const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const { projects } = useAppContext();
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

  if (!project || !project.path) {
    navigate('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Project details {project.name}</h1>
      <button
        type="button"
        onClick={async () => {
          const res = await invokeGetDirectories({ path: project.path! });
          setDirectories(res);
        }}
      >
        List Dir
      </button>
      <div className={styles.content}>
        {directories && (
          <div className={styles.treeViewContainer}>
            <TreeViewer
              node={directories}
              onFileSelect={async (filePath) => {
                setSelectedFilePath(filePath);
                const content = await invokeGetFileContent({ path: filePath });
                setFileContent(content);
              }}
            />
          </div>
        )}
        {fileContent && (
          <Editor
            filePath={selectedFilePath}
            content={fileContent}
            setContent={setFileContent}
            saveFile={async (filePath, content) => {
              await invokeSaveFileContent({
                path: filePath,
                content,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
