import React, { lazy, Suspense, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { withErrorBoundary } from 'components/common/with-error-boundary';
import { Error } from 'components/error/error';
import { usePageCtx, PageMode, PageData } from 'context/page-context';
import { useSizeCtx } from 'context/size-context';
import classes from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

const ErrorBoundary = withErrorBoundary(Error);
const Form = lazy(() => import('components/form'));

type Props = {
  mode: NonNullable<PageMode>;
  pageData?: PageData;
};

export const Page = ({ mode, pageData: formData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPage = usePageCtx();
  const size = useSizeCtx();

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
      <ErrorBoundary
        className={classes.errorMessage}
        onError={formProps.onMount}
      >
        <Suspense fallback={null}>
          <Form {...formProps} />
        </Suspense>
      </ErrorBoundary>
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
        <h1>{mode === 'add' ? 'Новая встреча' : 'Редактирование встречи'}</h1>
      </div>
      {renderPage()}
    </div>
  );
};
