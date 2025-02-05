import React from 'react';
import { toast } from 'react-toastify';
import styles from './addConnectionModal.module.scss';
import { Project } from '../../../../types/backend';
import { Modal } from '../modal';
import { DB_TYPES } from '../../../constants';
import { useIpcPromise } from '../../../hooks';
import { saveConnection } from '../../../helpers';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCallback: () => void;
  project: Project;
  yamlContent: string;
};

export const AddConnectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessCallback,
  project,
  yamlContent,
}) => {
  const invokeSaveFileContent = useIpcPromise<
    { path: string; content: string },
    boolean
  >('project:updateFile');

  const [state, setState] = React.useState({
    name: '',
    databaseName: '',
    schemaName: '',
    dbType: '',
    url: '',
    userName: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContent = saveConnection(yamlContent, state);
    if (!updatedContent) {
      toast.error('Failed to add connection!');
      return;
    }
    invokeSaveFileContent({
      path: `${project.path}/main.conf`,
      content: updatedContent,
    });
    onSuccessCallback();
    toast.success('Connection added successfully!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Connection">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="databaseName">Database Name</label>
          <input
            type="text"
            id="databaseName"
            name="databaseName"
            value={state.databaseName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="schemaName">Schema Name</label>
          <input
            type="text"
            id="schemaName"
            name="schemaName"
            value={state.schemaName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dbType">Database Type</label>
          <select
            id="dbType"
            name="dbType"
            value={state.dbType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Database Type
            </option>
            {DB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            name="url"
            value={state.url}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={state.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
