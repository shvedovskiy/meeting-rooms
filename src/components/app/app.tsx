import React, { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaLayout } from 'use-media';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Page } from 'components/page/page';
import pageTransitionClasses from 'components/page/page-transition.module.scss';
import SizeContext from 'context/size-context';
import PageContext, { PageType, PageFn } from 'context/page-context';
import { Timesheet } from 'components/timesheet/timesheet';
import classes from './app.module.scss';
import { Event, NewEvent } from 'components/timesheet/types';

type Props = {
  onMount: () => void;
};

export const App = ({ onMount }: Props) => {
  const [page, setPage] = useState<PageType | null>(null);
  const [contextData, setContextData] = useState<Event | NewEvent>(null!);
  const size = useMediaLayout({ maxWidth: 554 }) ? 'large' : 'default';

  const openPage = useCallback<PageFn>(
    (type, data) => {
      setPage(type);
      if (data) {
        setContextData(data);
      }
    },
    [setPage]
  );
  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <PageContext.Provider value={openPage}>
      <SizeContext.Provider value={size}>
        <Header>
          {!page && (
            <Button
              use="primary"
              className={classes.headerBtn}
              size={size}
              onClick={() => setPage('add')}
            >
              Создать встречу
            </Button>
          )}
        </Header>
        <main className={classes.content}>
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
