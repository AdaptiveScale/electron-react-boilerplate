import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { icons } from '../../../../assets';
import { useAppContext } from '../../hooks';
import { CustomToolTip } from '../customToolTip';

export const Sidebar: React.FC = () => {
  const { projects } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <CustomToolTip content="Add Project" placement="right">
        <Link to="/add-project" className={styles.projectIcon}>
          <img src={icons.add} alt="add" width={36} />
        </Link>
      </CustomToolTip>
      {projects.map((project, index) => (
        <CustomToolTip
          content={project.name}
          placement="right"
          key={project.id}
        >
          <button
            type="button"
            onClick={() => {
              if (project.isCompleted) {
                navigate(`/project-details/${project.id}`);
                return;
              }
              navigate(`/setup-project/${project.id}`);
            }}
            className={styles.projectIcon}
            style={{ marginBottom: index === projects.length - 1 ? 86 : 0 }}
          >
            {project.name[0].toUpperCase()}
          </button>
        </CustomToolTip>
      ))}

      <CustomToolTip content="Settings" placement="right">
        <Link
          to="/settings"
          className={styles.projectIcon}
          style={{
            position: 'fixed',
            bottom: 10,
            color: '#000',
            background: '#fff',
          }}
        >
          <img src={icons.settings} alt="settings" width={36} />
        </Link>
      </CustomToolTip>
    </div>
  );
};
