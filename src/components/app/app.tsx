import React, { lazy, useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaLayout } from 'use-media';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Page } from 'components/page/page';
import pageTransitionClasses from 'components/page/page-transition.module.scss';
import SizeContext from 'context/size-context';
import PageContext, { PageType } from 'context/page-context';
import { Timesheet } from 'components/timesheet/timesheet';
import classes from './app.module.scss';

const AddPage = lazy(() => import('components/add-page'));
const EditPage = lazy(() => import('components/edit-page'));

type Props = {
  onMount: () => void;
};

// const items: ItemType[] = [
//   {
//     id: '1',
//     value: 'text 1',
//     homeFloor: 1,
//     avatarUrl: 'https://via.placeholder.com/24',
//   },
//   {
//     id: '2',
//     value: 'text 2',
//     homeFloor: 1,
//     avatarUrl: 'https://via.placeholder.com/24',
//   },
//   {
//     id: '3',
//     value: 'text 3',
//     homeFloor: 1,
//     avatarUrl: 'https://via.placeholder.com/24',
//   },
//   {
//     id: '4',
//     value: 'text 4',
//     homeFloor: 1,
//     avatarUrl: 'https://via.placeholder.com/24',
//   },
//   {
//     id: '5',
//     value: 'text 5',
//     homeFloor: 1,
//     avatarUrl: 'https://via.placeholder.com/24',
//   },
// ];

// const rooms: OptionType[] = [
//   {
//     startTime: '08:00',
//     endTime: '20:00',
//     title: 'ASlo',
//     floor: 1,
//   },
//   {
//     startTime: '08:00',
//     endTime: '20:00',
//     title: 'ASlo 2',
//     floor: 1,
//   },
//   {
//     startTime: '08:00',
//     endTime: '20:00',
//     title: 'ASlo 3',
//     floor: 1,
//   },
//   {
//     startTime: '08:00',
//     endTime: '20:00',
//     title: 'ASlo 4',
//     floor: 1,
//   },
//   {
//     startTime: '08:00',
//     endTime: '20:00',
//     title: 'ASlo 5',
//     floor: 1,
//   },
// ];

export const App = ({ onMount }: Props) => {
  const [open, setOpen] = useState<PageType | null>(null);
  const size = useMediaLayout({ maxWidth: 554 }) ? 'large' : 'default';

  const openPage = useCallback(
    (page: PageType) => {
      setOpen(page);
    },
    [setOpen]
  );
  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <PageContext.Provider value={openPage}>
      <SizeContext.Provider value={size}>
        <Header>
          <Button
            use="primary"
            className={classes.headerBtn}
            size={size}
            onClick={() => setOpen('add')}
          >
            Создать встречу
          </Button>
        </Header>
        <main className={classes.content}>
          <Timesheet />
          <CSSTransition
            appear
            classNames={pageTransitionClasses}
            in={open !== null}
            mountOnEnter
            unmountOnExit
            timeout={350}
          >
            <Page>
              {(callback: () => void) => {
                const props = {
                  onMount: callback,
                  onClose: () => setOpen(null),
                };
                if (open === 'add') {
                  return <AddPage {...props} />;
                } else {
                  return <EditPage {...props} />;
                }
              }}
            </Page>
          </CSSTransition>
        </main>

        {/* <Modal
        icon="🙅🏻"
        title="Modal Title"
        text="Modal Text"
        buttons={[{ id: '1', text: 'Text 1' }, { id: '2', text: 'Text 1' }]}
      /> */}
        {/* <TimePicker value={new Date()} size={size} /> */}
        {/* <div style={{ width: '450px' }}>
        <OptionPicker size={size} items={rooms} />
        <Selectpicker
          items={items}
          size={size}
          placeholder="Например, Тор Одинович"
        />
      </div> */}
      </SizeContext.Provider>
    </PageContext.Provider>
  );
};
