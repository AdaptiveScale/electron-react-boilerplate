import React from 'react';
import { toast } from 'react-toastify';
import { Modal } from '../modal';
import { Connection } from '../../../../types/backend';
import { useAppContext, useCli } from '../../../hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  connections: Connection[];
  projectPath: string;
  successCallback: () => void;
};

export const ExtractModal: React.FC<Props> = ({
  isOpen,
  onClose,
  connections,
  projectPath,
  successCallback,
}) => {
  const { settings } = useAppContext();
  const { error, isRunning, runCommand, isSuccess } = useCli();
  const [selectedConnection, setSelectedConnection] =
    React.useState<string>('');

  React.useEffect(() => {
    if (error) {
      toast.error('Extraction failed');
      return;
    }
    if (isSuccess) {
      toast.success('Extraction completed successfully');
      successCallback();
    }
  }, [isSuccess, error]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Extract Modal">
      <select
        onChange={(event) => setSelectedConnection(event.target.value)}
        value={selectedConnection}
      >
        <option value="">Select a connection</option>
        {connections.map((connection) => (
          <option key={connection.name} value={connection.name}>
            {connection.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={!selectedConnection || isRunning}
        onClick={async () => {
          await runCommand(
            `cd ${projectPath} && ${settings.rosettaPath} extract -s ${selectedConnection}`,
          );
        }}
      >
        Extract
      </button>
    </Modal>
  );
};
