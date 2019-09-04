import React, { lazy, Suspense, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { format, parseISO } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';
import cn from 'classnames';

import { Spinner } from 'components/ui/spinner/spinner';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { ServerEvent } from 'components/timesheet/types';
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
  const [setPage, setModal] = useContext(pageContext);
  const size = useContext(sizeContext);

  function closePage(eventData?: ServerEvent) {
    setPage(null);
    if (eventData) {
      const {
        date,
        startTime,
        endTime,
        room: { title, floor },
      } = eventData;
      const dateStr = format(parseISO(date), 'd MMMM', {
        locale: ruLocale,
      });
      setModal({
        icon: '🎉',
        iconLabel: 'none',
        title: 'Встреча создана!',
        text: [
          `${dateStr}, ${startTime}–${endTime}`,
          `${title}\u00A0·\u00A0${floor} этаж`,
        ],
        buttons: [
          {
            id: '1',
            text: 'Хорошо',
            use: 'primary',
            onClick() {
              setModal(null);
            },
          },
        ],
        onBackdropClick() {
          setModal(null);
        },
      });
    }
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
