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
};

export const Editor: React.FC<Props> = ({ filePath, content, setContent }) => {
  if (!filePath) return <p>Select a file to view its content</p>;

  return (
    <div className={styles.container}>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={content}
        onChange={(val) => setContent(val)}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="426px"
      />
    </div>
  );
};
