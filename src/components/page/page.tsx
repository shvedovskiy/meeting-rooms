import React, { Suspense, useState, useCallback, ReactElement } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Spinner } from 'components/ui/spinner/spinner';
import classes from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

type Props = {
  children: (callback: () => void) => ReactElement;
};

export const Page = (props: Props) => {
  const { children } = props;

  const [isLoading, setIsLoading] = useState(true);
  const setLoadingCallback = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className={classes.page}>
      <CSSTransition
        classNames={spinnerTransitionClasses}
        enter={false}
        in={isLoading}
        timeout={200}
        unmountOnExit
      >
        <Spinner />
      </CSSTransition>
      <Suspense fallback={null}>{children(setLoadingCallback)}</Suspense>
    </div>
  );
};
