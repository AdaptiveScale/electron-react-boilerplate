import React from 'react';
import { Tooltip } from 'react-tooltip';

type Props = {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

const generateUniqueId = (() => {
  let counter = 0;
  // eslint-disable-next-line no-plusplus
  return () => `tooltip-${counter++}`;
})();

export const CustomToolTip: React.FC<Props> = ({
  content,
  children,
  placement,
}) => {
  const id = React.useMemo(() => generateUniqueId(), []);

  const childWithTooltipId = React.cloneElement(children, {
    'data-tooltip-id': id,
  });

  return (
    <>
      {childWithTooltipId}
      <Tooltip
        id={id}
        place={placement}
        style={{ position: 'fixed' }}
        content={content}
      />
    </>
  );
};
