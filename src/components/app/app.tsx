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
import SizeProvider, { Size } from 'context/size-context';
import PageProvider, { PageMode, PageModes, PageData, PageFn } from 'context/page-context';
import {
  ROOMS_QUERY,
  EVENTS_QUERY,
  RoomsQueryType,
  EventsQueryType,
} from 'service/apollo/queries';
import cls from './app.module.scss';
import pageTransitionClasses from 'components/page/page-transition.module.scss';

type Props = {
  onLoad: () => void;
};

interface PageDef {
  mode: PageMode;
  data?: PageData;
}

export const App = ({ onLoad }: Props) => {
  const [page, setPage] = useState<PageDef>({ mode: null });
  const size = useMediaLayout({ maxWidth: '34.625em' }) ? Size.LARGE : Size.DEFAULT;
  // Request with this name will be intercepted by the Apollo Client to convert
  // the ISO date string to the Date object:
  const { data, error, loading } = useQuery<RoomsQueryType & EventsQueryType>(gql`
    query RoomsEvents {
      ${ROOMS_QUERY}
      ${EVENTS_QUERY}
    }
  `);

  useEffect(() => {
    if (!loading) {
      onLoad();
    }
  }, [loading, onLoad]);

  const openPage = useCallback<PageFn>((mode, data) => {
    setPage({ mode, data });
  }, []);

  if (loading) {
    return null;
  }

  function renderHeader() {
    if (page.mode == null && data?.rooms.length) {
      return (
        <Header>
          <Button
            use="primary"
            className={cls.headerBtn}
            size={size}
            onClick={() => openPage(PageModes.ADD)}
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
      return <Error className={cls.error} />;
    }
    return (
      <>
        <Timesheet />
        <CSSTransition
          appear
          in={page.mode !== null}
          classNames={pageTransitionClasses}
          mountOnEnter
          unmountOnExit
          timeout={350}
        >
          <Page mode={page.mode!} pageData={page.data} />
        </CSSTransition>
      </>
    );
  }

  return (
    <SizeProvider value={size}>
      <PageProvider value={openPage}>
        <div className={cn(cls.app, { [cls.sm]: size === Size.LARGE })}>
          {renderHeader()}
          <main className={cls.content}>{renderContent()}</main>
        </div>
      </PageProvider>
    </SizeProvider>
  );
};
