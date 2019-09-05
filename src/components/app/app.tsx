import React, { useState, useEffect, useCallback } from 'react';
import { useMediaLayout } from 'use-media';
import { CSSTransition } from 'react-transition-group';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cn from 'classnames';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Page } from 'components/page/page';
import { Error } from 'components/error/error';
import { Timesheet } from 'components/timesheet/timesheet';
import SizeContext from 'context/size-context';
import PageContext, { PageType, PageData, PageFn } from 'context/page-context';
import {
  ROOMS_QUERY,
  EVENTS_QUERY,
  RoomsQueryType,
  EventsQueryType,
} from 'service/queries';
import classes from './app.module.scss';
import pageTransitionClasses from 'components/page/page-transition.module.scss';

type Props = {
  onLoad: () => void;
};

interface PageDef {
  type: PageType;
  data?: PageData;
}

export const App = ({ onLoad }: Props) => {
  const [page, setPage] = useState<PageDef>({ type: null });

  const size = useMediaLayout({ maxWidth: '34.625em' }) ? 'large' : 'default';
  const { data, error, loading } = useQuery<RoomsQueryType & EventsQueryType>(
    gql`
    query RoomsEvents {
      ${ROOMS_QUERY}
      ${EVENTS_QUERY}
    }
  `
  );

  useEffect(() => {
    if (!loading) {
      onLoad();
    }
  }, [loading, onLoad]);

  const openPage = useCallback<PageFn>((pageType, pageData) => {
    setPage({
      type: pageType,
      data: pageData,
    });
  }, []);

  if (loading) {
    return null;
  }

  function renderHeader() {
    if (page.type === null && data && data.rooms.length) {
      return (
        <Header>
          <Button
            use="primary"
            className={classes.headerBtn}
            size={size}
            onClick={() => openPage('add')}
          >
            Создать встречу
          </Button>
        </Header>
      );
    }
    return <Header />;
  }

  function renderContent() {
    if (error) {
      return <Error className={classes.error} />;
    }

    return (
      <>
        <Timesheet />
        <CSSTransition
          appear
          classNames={pageTransitionClasses}
          in={page.type !== null}
          mountOnEnter
          unmountOnExit
          timeout={350}
        >
          <Page type={page.type!} pageData={page.data} />
        </CSSTransition>
      </>
    );
  }

  return (
    <SizeContext.Provider value={size}>
      <PageContext.Provider value={openPage}>
        <div
          className={cn(classes.app, {
            [classes.sm]: size === 'large',
          })}
        >
          {renderHeader()}
          <main className={classes.content}>{renderContent()}</main>
        </div>
      </PageContext.Provider>
    </SizeContext.Provider>
  );
};
