import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import classes from './spinner.module.scss';
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
      classNames={transitionClasses}
      enter={enterAnimation}
      exit={false}
      in={enterAnimation ? showSpinner : true}
      timeout={200}
      unmountOnExit
    >
      <div
        className={cn(classes.loader, {
          [classes.transparent]: transparent,
          [classes.fullscreen]: fullscreen,
        })}
      >
        <div className="vertical-helper" />
        <div className="spinner" />
      </div>
    </CSSTransition>
  );
};
