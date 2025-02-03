import React from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import {
  AddProject,
  CliExecutor,
  ProjectDetails,
  Settings,
  SetupProject,
} from './screens';
import { AppLayout } from './layouts';
import { AppProvider } from './context';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="" element={<CliExecutor />} />
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
    </AppProvider>
  );
};

export default AppWithProjectProvider;
