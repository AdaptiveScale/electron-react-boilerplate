import React, { ReactNode } from 'react';
import styles from './modal.module.scss';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
};

export const Modal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        {!hideHeader && (
          <div className={styles.header}>
            {title && <h2>{title}</h2>}
            <button type="button" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
