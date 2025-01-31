import React from 'react';
import useIpcPromise from './useIpcPromise';

const useCli = () => {
  const [path, setPath] = React.useState<string>('');
  const [output, setOutput] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  const invokePathUpdate = useIpcPromise<string>('cli:setPath');
  const invokeCliRun = useIpcPromise<string[]>('cli:run');
  const getCliStatus = useIpcPromise<undefined, { path: string }>('cli:status');

  const getStatus = async () => {
    const response = await getCliStatus();
    setPath(response.path);
  };

  React.useEffect(() => {
    getStatus();
    const handleOutput = (_event: any, arg: unknown) => {
      const data = arg as string;
      setOutput((prev) => [...prev, data]);
    };

    const handleError = (_event: any, arg: unknown) => {
      const data = arg as string;
      setError(data);
    };

    const handleDone = () => {
      setIsRunning(false);
    };

    window.electron.ipcRenderer.on('cli:output', handleOutput);
    window.electron.ipcRenderer.on('cli:error', handleError);
    window.electron.ipcRenderer.on('cli:done', handleDone);

    return () => {
      window.electron.ipcRenderer.removeListener('cli:output', handleOutput);
      window.electron.ipcRenderer.removeListener('cli:error', handleError);
      window.electron.ipcRenderer.removeListener('cli:done', handleDone);
    };
  }, []);

  const runCommand = async (command: string) => {
    setOutput([]);
    setError(null);
    setIsRunning(true);
    await invokeCliRun(command.split(' '));
  };

  const sendInput = (input: string) => {
    window.electron.ipcRenderer.sendMessage('cli:input', input);
  };

  const stopCommand = () => {
    window.electron.ipcRenderer.sendMessage('cli:stop');
    setIsRunning(false);
  };

  const updatePath = async (input: string) => {
    setPath(input);
    await invokePathUpdate(input);
  };

  return {
    output,
    error,
    isRunning,
    runCommand,
    sendInput,
    stopCommand,
    path,
    updatePath,
  };
};

export default useCli;
