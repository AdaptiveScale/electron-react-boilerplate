import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.container}>
      <Link to="/">Home</Link>
      <Link to="/cli">CLI Test</Link>
    </nav>
  );
};
