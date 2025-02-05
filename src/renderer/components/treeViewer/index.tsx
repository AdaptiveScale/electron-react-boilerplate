import React, { useState } from 'react';
import styles from './treeViewer.module.scss';
import { FileNode } from '../../../types/backend';

type Props = {
  node: FileNode;
  onFileSelect: (filePath: string) => void;
};

export const TreeViewer: React.FC<Props> = ({ node, onFileSelect }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setExpanded(!expanded);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div className={styles.treeNode}>
      <div
        tabIndex={0}
        onKeyDown={() => {}}
        role="button"
        className={styles.nodeLabel}
        onClick={handleToggle}
      >
        {node.type === 'folder' ? (
          <span className={expanded ? styles.expanded : styles.collapsed}>
            📂
          </span>
        ) : (
          <span style={{ marginRight: 6 }}>📄</span>
        )}
        {node.name}
      </div>
      {expanded && node.children && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeViewer
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
