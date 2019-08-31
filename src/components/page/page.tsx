import React, { lazy, Suspense, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import pageContext, { PageType, PageData } from 'context/page-context';
import sizeContext from 'context/size-context';
import classes from './page.module.scss';
import spinnerTransitionClasses from 'components/ui/spinner/spinner-transition.module.scss';

const Form = lazy(() => import('components/form'));

type Props = {
  type: NonNullable<PageType>;
  pageData?: PageData;
};

export const Page = ({ type, pageData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPage = useContext(pageContext);
  const size = useContext(sizeContext);

  function closePage() {
    setPage(null);
  }
  function renderPage() {
    const formProps = {
      type,
      formData: pageData,
      onMount() {
        setIsLoading(false);
      },
      onClose: closePage,
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
            onClick={closePage}
          />
        )}
        <h1 className={classes.title}>
          {type === 'add' ? 'Новая встреча' : 'Редактирование встречи'}
        </h1>
      </div>
      {renderPage()}
    </div>
  );
};
