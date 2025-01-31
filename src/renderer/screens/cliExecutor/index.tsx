import React from 'react';
import styles from './clieExecutor.module.css';
import { useCli } from '../../hooks';

const CliExecutor: React.FC = () => {
  const {
    output,
    error,
    isRunning,
    runCommand,
    sendInput,
    stopCommand,
    path,
    updatePath,
  } = useCli();
  const [command, setCommand] = React.useState<string>('');
  const [userInput, setUserInput] = React.useState<string>('');

  return (
    <div className={styles.container}>
      <h2>Run CLI</h2>
      <input
        type="text"
        disabled={isRunning}
        value={path}
        onChange={(e) => updatePath(e.target.value)}
        placeholder="CLI Path"
      />
      <input
        type="text"
        disabled={isRunning}
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Args..."
      />
      <div className={styles.buttons}>
        <button
          type="button"
          onClick={() => runCommand(command)}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button
          className={styles.stopButton}
          type="button"
          onClick={stopCommand}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>
      {isRunning && (
        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input for CLI"
          />
          <button type="button" onClick={() => sendInput(userInput)}>
            Send Input
          </button>
        </div>
      )}
      <pre style={{ color: 'green', background: '#000', padding: 10 }}>
        {output.join('\n')}
      </pre>
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
    </div>
  );
};

export default CliExecutor;
