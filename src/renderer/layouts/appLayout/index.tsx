import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './appLayout.module.css';
import { Navbar } from '../../components';

export const AppLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <Outlet />
    </div>
  );
};
