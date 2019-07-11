import React, { FC, useEffect } from 'react';

import { PageProps } from 'components/page/types';

type Props = PageProps;

export const AddPage: FC<Props> = ({ onMount, onClose }) => {
  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

  function handleClick() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <div>
      Add page <button onClick={handleClick}>Close</button>
    </div>
  );
};
