import yaml from 'js-yaml';
import { Connection } from '../../types/backend';

const saveConnection = (
  yamlString: string,
  connection: Connection,
): string | undefined => {
  try {
    const doc = yaml.load(yamlString) as { connections: Connection[] };
    doc.connections.push(connection);
    return yaml.dump(doc);
  } catch (error) {
    return undefined;
  }
};

export default saveConnection;
