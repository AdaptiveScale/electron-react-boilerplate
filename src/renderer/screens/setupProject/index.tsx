import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './setupProject.module.scss';
import { useAppContext, useCli, useIpcPromise } from '../../hooks';
import { Project } from '../../../types/backend';

const drivers = [
  { value: 1, label: 'Google Cloud BigQuery 4.2' },
  { value: 2, label: 'Snowflake 3.13.19' },
  { value: 3, label: 'PostgreSQL 42.3.7' },
  { value: 4, label: 'MySQL 8.0.30' },
  { value: 5, label: 'Kinetica 7.1.7.7' },
  { value: 6, label: 'Google Cloud Spanner 2.6.2' },
  { value: 7, label: 'SQL Server 12.2.0' },
  { value: 8, label: 'DB2 jcc4' },
  { value: 9, label: 'Oracle 23.2.0.0' },
  { value: 10, label: 'Redshift 42-2.1.0.30' },
];

type Params = {
  id: string;
};

const SetupProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const { projects, onDeleteProject, onUpdateProject } = useAppContext();
  const { output, error, isRunning, runCommand, sendInput, stopCommand } =
    useCli();
  const invokeGetProjectPath = useIpcPromise<{ name: string }, string>(
    'project:getPath',
  );

  const [commandInput, setCommandInput] = React.useState<string>('');
  const [isAskingForDrivers, setIsAskingForDrivers] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [hasSelectedSourceDriver, setHasSelectedSourceDriver] =
    React.useState(false);
  const [hasSelectedTargetDriver, setHasSelectedTargetDriver] =
    React.useState(false);
  const [disableSelect, setDisableSelect] = React.useState(false);

  const project = React.useMemo(
    () => projects.find((_project) => _project.id === id),
    [id, projects],
  );

  const handleSetupSuccess = async (data: Project) => {
    const path = await invokeGetProjectPath({ name: data.name });
    onUpdateProject({
      ...data,
      isCompleted: true,
      path,
    });
    navigate(`/project-details/${data?.id}`);
  };

  const handleDriverSelection = async (value: string) => {
    setCommandInput(value);
    sendInput(value);
    setDisableSelect(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    if (hasSelectedSourceDriver) {
      setHasSelectedTargetDriver(true);
    }
    setHasSelectedSourceDriver(true);
    setCommandInput('');
    setDisableSelect(false);
  };

  React.useEffect(() => {
    if (!isAskingForDrivers) {
      const out = output.join('');
      if (out.includes('Downloadable drivers')) {
        setIsAskingForDrivers(true);
      }
    }
  }, [output]);

  React.useEffect(() => {
    if (hasStarted && !isRunning && project) {
      if (error) {
        // TODO handle error
      }
      handleSetupSuccess(project);
    }
  }, [isRunning, error]);

  if (!project) {
    navigate('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Setup project {project.name}</h1>
      {isAskingForDrivers &&
        (!hasSelectedSourceDriver || !hasSelectedTargetDriver) && (
          <select
            onChange={(e) => handleDriverSelection(e.target.value)}
            className="border p-2 rounded"
            disabled={disableSelect}
            value={commandInput}
          >
            <option value="">
              Select {hasSelectedSourceDriver ? 'Target' : 'Source'}
            </option>
            {drivers.map((db) => (
              <option key={db.value} value={db.value}>
                {db.label}
              </option>
            ))}
          </select>
        )}
      {!isRunning && (
        <button
          type="button"
          onClick={async () => {
            await runCommand(`init ${project?.name}`);
            setHasStarted(true);
          }}
        >
          Init Project
        </button>
      )}
      {isRunning && (
        <button type="button" onClick={() => stopCommand()}>
          Stop
        </button>
      )}
      <button
        disabled={isRunning}
        type="button"
        onClick={() => onDeleteProject(project)}
      >
        Delete project
      </button>
    </div>
  );
};

export default SetupProject;
