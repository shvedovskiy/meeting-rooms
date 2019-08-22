import React, { useEffect, useState, useCallback, useContext } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Page } from 'components/page/page';
import { Timesheet } from 'components/timesheet/timesheet';
import PageContext, { PageType, PageFn } from 'context/page-context';
import classes from './app.module.scss';
import pageTransitionClasses from 'components/page/page-transition.module.scss';
import { ContextData } from './types';
import { Error } from 'components/error/error';
import sizeContext from 'context/size-context';
import { UsersRoomsQueryType as QueryType } from 'service/queries';

type Props = {
  appData?: QueryType;
};

export const AppComponent = ({ appData }: Props) => {
  const [page, setPage] = useState<PageType | null>(null);
  const [contextData, setContextData] = useState<ContextData>(null!);
  const size = useContext(sizeContext) || 'default';

  useEffect(() => {
    if (appData) {
      setContextData(ctx => ({
        ...ctx,
        ...appData,
      }));
    }
  }, [appData]);

  const openPage = useCallback<PageFn>((type, eventData = {}) => {
    setPage(type);
    setContextData(ctx => ({
      ...ctx,
      event: eventData,
    }));
  }, []);
  function handleOpen() {
    if (!appData) {
      openPage('add');
    }
  }

  return (
    <PageContext.Provider value={openPage}>
      <div
        className={classNames(classes.app, {
          [classes.sm]: size === 'large',
        })}
      >
        <Header>
          {!page && (
            <Button
              use="primary"
              className={classes.headerBtn}
              size={size}
              onClick={handleOpen}
            >
              Создать встречу
            </Button>
          )}
        </Header>
        <main className={classes.content}>
          {!appData ? (
            <Error />
          ) : (
            <>
              <Timesheet />
              <CSSTransition
                appear
                classNames={pageTransitionClasses}
                in={page !== null}
                mountOnEnter
                unmountOnExit
                timeout={350}
              >
                <Page type={page!} pageData={contextData} />
              </CSSTransition>
            </>
          )}
        </main>
      </div>
    </PageContext.Provider>
  );
};
