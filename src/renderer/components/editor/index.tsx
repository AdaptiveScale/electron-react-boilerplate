import React from 'react';
import AceEditor from 'react-ace';
import styles from './editor.module.scss';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

type Props = {
  filePath?: string;
  content: string;
  setContent: (value: string) => void;
  saveFile: (filePath: string, content: string) => void;
};

export const Editor: React.FC<Props> = ({
  filePath,
  content,
  setContent,
  saveFile,
}) => {
  if (!filePath) return <p>Select a file to view its content</p>;

  const handleSave = () => {
    if (filePath) saveFile(filePath, content);
  };

  return (
    <div className={styles.container}>
      <h3>Editing: {filePath}</h3>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={content}
        onChange={(val) => setContent(val)}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="500px"
      />
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};
