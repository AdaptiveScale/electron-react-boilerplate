import React from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AddProject, ProjectDetails, Settings, SetupProject } from './screens';
import { AppLayout } from './layouts';
import { AppProvider } from './context';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/setup-project/:id" element={<SetupProject />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

const AppWithProjectProvider: React.FC = () => {
  return (
    <AppProvider>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
    </AppProvider>
  );
};

export default AppWithProjectProvider;
