import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import cls from './spinner.module.scss';
import transitionClasses from './spinner-transition.module.scss';

type Props = {
  fullscreen?: boolean;
  transparent?: boolean;
  enterAnimation?: boolean;
};

export const Spinner = ({
  fullscreen = false,
  transparent = false,
  enterAnimation = true,
}: Props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(true);
  }, []);

  return (
    <CSSTransition
      in={enterAnimation ? showSpinner : true}
      enter={enterAnimation}
      exit={false}
      classNames={transitionClasses}
      unmountOnExit
      timeout={200}
    >
      <div
        className={cn(cls.loader, {
          [cls.transparent]: transparent,
          [cls.fullscreen]: fullscreen,
        })}
      >
        <div className="vertical-helper" />
        <div className="spinner" />
      </div>
    </CSSTransition>
  );
};
