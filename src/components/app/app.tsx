import React, { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaLayout } from 'use-media';
import { useQuery } from '@apollo/react-hooks';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Page } from 'components/page/page';
import { Timesheet } from 'components/timesheet/timesheet';
import SizeContext from 'context/size-context';
import PageContext, { PageType, PageFn } from 'context/page-context';
import classes from './app.module.scss';
import pageTransitionClasses from 'components/page/page-transition.module.scss';
import { QueryType, ContextData } from './types';
import { GET_USERS_ROOMS } from 'service/queries';
import { Error } from 'components/error/error';

type Props = {
  onLoad: () => void;
};

export const App = ({ onLoad }: Props) => {
  const [page, setPage] = useState<PageType | null>(null);
  const [contextData, setContextData] = useState<ContextData>(null!);
  const size = useMediaLayout({ maxWidth: 554 }) ? 'large' : 'default';

  const { loading, data: fetchData } = useQuery<QueryType>(GET_USERS_ROOMS);

  useEffect(() => {
    if (loading === false) {
      onLoad();
    }
  }, [onLoad, loading]);
  useEffect(() => {
    if (typeof fetchData !== 'undefined') {
      setContextData(ctx => ({
        ...ctx,
        ...fetchData,
      }));
    }
  }, [fetchData]);

  const openPage = useCallback<PageFn>((type, eventData = {}) => {
    setPage(type);
    setContextData(ctx => ({
      ...ctx,
      event: eventData,
    }));
  }, []);
  function handleOpen() {
    if (typeof fetchData !== 'undefined') {
      openPage('add');
    }
  }

  if (loading) {
    return null;
  }
  return (
    <PageContext.Provider value={openPage}>
      <SizeContext.Provider value={size}>
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
          {!fetchData ? (
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

        {/* <Modal
        icon="🙅🏻"
        title="Modal Title"
        text="Modal Text"
        buttons={[{ id: '1', text: 'Text 1' }, { id: '2', text: 'Text 1' }]}
      /> */}
      </SizeContext.Provider>
    </PageContext.Provider>
  );
};
