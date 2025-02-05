import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './appLayout.module.scss';
import { Menu, Sidebar } from '../../components';

export const AppLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Menu />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
