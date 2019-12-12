import React, { lazy, Suspense, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import ErrorBoundary from 'react-error-boundary';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Error } from 'components/error/error';
import { usePageCtx, PageMode, PageData } from 'context/page-context';
import { useSizeCtx } from 'context/size-context';
import classes from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

const ErrorFallback = () => <Error className={classes.errorMessage} />;
const AddForm = lazy(() => import('components/form/form-add'));
const EditForm = lazy(() => import('components/form/form-edit'));

type Props = {
  mode: NonNullable<PageMode>;
  pageData?: PageData;
};

export const Page = ({ mode, pageData: formData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPage = usePageCtx();
  const size = useSizeCtx();

  const closePage = useCallback(() => setPage(null), [setPage]);

  function renderPage() {
    const formProps = {
      formData,
      onMount() {
        setIsLoading(false);
      },
      onClose: closePage,
    };
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={formProps.onMount}>
        <Suspense fallback={null}>
          {mode === 'add' ? <AddForm {...formProps} /> : <EditForm {...formProps} />}
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
            onClick={closePage}
          />
        )}
        <h1>{mode === 'add' ? 'Новая встреча' : 'Редактирование встречи'}</h1>
      </div>
      {renderPage()}
    </div>
  );
};
