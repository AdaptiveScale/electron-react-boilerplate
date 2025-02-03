import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './addProject.module.scss';
import { useAppContext } from '../../hooks';

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { onSaveProject, projects } = useAppContext();

  const [name, setName] = React.useState<string>('');

  const canSubmit = (pName: string) => {
    if (pName === '') {
      return false;
    }
    const projectNames = projects.map((project) => project.name);
    return !projectNames.includes(pName);
  };

  return (
    <div className={styles.container}>
      <h1>Add Project</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (canSubmit(name)) {
            const newProject = await onSaveProject(name);
            if (newProject) navigate(`/setup-project/${newProject.id}`);
          }
        }}
      >
        <input
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />

        <button disabled={!canSubmit(name)} type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddProject;
