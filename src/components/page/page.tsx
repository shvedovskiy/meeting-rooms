import React, { lazy, Suspense, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import ErrorBoundary from 'react-error-boundary';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Error } from 'components/error/error';
import { usePageCtx, PageMode, PageData, PageModes } from 'context/page-context';
import { useSizeCtx, Size } from 'context/size-context';
import cls from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

const ErrorFallback = () => <Error className={cls.errorMessage} />;
const AddForm = lazy(() => import('components/form/form-add'));
const EditForm = lazy(() => import('components/form/form-edit'));

type Props = {
  mode: NonNullable<PageMode>;
  pageData?: PageData;
};

export const Page = ({ mode, pageData: formData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPage = usePageCtx();
  const size = useSizeCtx() ?? Size.DEFAULT;

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
          {mode === PageModes.ADD ? <AddForm {...formProps} /> : <EditForm {...formProps} />}
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className={cn(cls.page, { [cls.lg]: size === Size.LARGE })}>
      <CSSTransition
        enter={false}
        in={isLoading}
        classNames={spinnerTransitionClasses}
        unmountOnExit
        timeout={200}
      >
        <Spinner />
      </CSSTransition>
      <div className={cls.header}>
        {size === Size.DEFAULT && (
          <IconButton
            ariaLabel="Отмена"
            icon="close"
            className={cls.closePage}
            onClick={closePage}
          />
        )}
        <h1>{mode === PageModes.ADD ? 'Новая встреча' : 'Редактирование встречи'}</h1>
      </div>
      {renderPage()}
    </div>
  );
};
