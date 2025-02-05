import yaml from 'js-yaml';
import { Connection } from '../../types/backend';

const extractConnections = (yamlString: string): Connection[] => {
  try {
    const doc = yaml.load(yamlString) as any;
    return doc.connections || [];
  } catch (error) {
    return [];
  }
};

export default extractConnections;
