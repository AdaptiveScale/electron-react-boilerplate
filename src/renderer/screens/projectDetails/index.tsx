import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './projectDetails.module.scss';
import { useAppContext } from '../../hooks';

type Params = {
  id: string;
};

const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const { projects } = useAppContext();

  const project = React.useMemo(
    () => projects.find((_project) => _project.id === id),
    [id, projects],
  );

  if (!project) {
    navigate('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>
        Project details {project.name} / {project.path}
      </h1>
    </div>
  );
};

export default ProjectDetails;
