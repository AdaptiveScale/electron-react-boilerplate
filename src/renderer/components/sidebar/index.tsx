import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { icons } from '../../../../assets';
import { useAppContext } from '../../hooks';

export const Sidebar: React.FC = () => {
  const { projects } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      {projects.map((project) => (
        <button
          type="button"
          onClick={() => {
            if (project.isCompleted) {
              navigate(`/project-details/${project.id}`);
              return;
            }
            navigate(`/setup-project/${project.id}`);
          }}
          key={project.name}
          className={styles.projectIcon}
        >
          {project.name[0].toUpperCase()}
        </button>
      ))}
      <Link to="/add-project" className={styles.projectIcon}>
        <img src={icons.add} alt="add" width={36} />
      </Link>
      <Link
        to="/settings"
        className={`${styles.projectIcon} ${styles.settingsIcon}`}
      >
        <img src={icons.settings} alt="settings" width={36} />
      </Link>
    </div>
  );
};
