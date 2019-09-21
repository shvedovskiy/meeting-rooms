import React, { lazy, Suspense, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import pageContext, { PageMode, PageData } from 'context/page-context';
import sizeContext from 'context/size-context';
import classes from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

const Form = lazy(() => import('components/form'));

type Props = {
  mode: NonNullable<PageMode>;
  pageData?: PageData;
};

export const Page = ({ mode, pageData: formData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPage = useContext(pageContext);
  const size = useContext(sizeContext);

  function onPageClosed() {
    setPage(null); // TODO use bind
  }

  function renderPage() {
    const formProps = {
      mode,
      formData,
      onMount() {
        setIsLoading(false);
      },
      onClose: onPageClosed,
    };
    return (
      <Suspense fallback={null}>
        <Form {...formProps} />
      </Suspense>
    );
  }

  return (
    <div
      className={cn(classes.page, {
        [classes.lg]: size === 'large',
      })}
    >
      <CSSTransition
        classNames={spinnerTransitionClasses}
        enter={false}
        in={isLoading}
        timeout={200}
        unmountOnExit
      >
        <Spinner />
      </CSSTransition>
      <div className={classes.header}>
        {size === 'default' && (
          <IconButton
            ariaLabel="Отмена"
            icon="close"
            className={classes.closePage}
            onClick={onPageClosed}
          />
        )}
        <h1 className={classes.title}>
          {mode === 'add' ? 'Новая встреча' : 'Редактирование встречи'}
        </h1>
      </div>
      {renderPage()}
    </div>
  );
};
