import React, { lazy, useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaLayout } from 'use-media';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { ItemType } from 'components/ui/selectpicker/option/option';
import { Page } from 'components/page/page';
import pageTransitionClasses from 'components/page/page-transition.module.scss';
import SizeContext from 'context/size-context';
import { OptionType } from 'components/ui/option-picker/option/option';
import { Timesheet } from 'components/timesheet/timesheet';
import classes from './app.module.scss';

const AddPage = lazy(() => import('components/add-page'));
const EditPage = lazy(() => import('components/edit-page'));

type Props = {
  onMount: () => void;
};

const items: ItemType[] = [
  {
    id: '1',
    value: 'text 1',
    homeFloor: 1,
    avatarUrl: 'https://via.placeholder.com/24',
  },
  {
    id: '2',
    value: 'text 2',
    homeFloor: 1,
    avatarUrl: 'https://via.placeholder.com/24',
  },
  {
    id: '3',
    value: 'text 3',
    homeFloor: 1,
    avatarUrl: 'https://via.placeholder.com/24',
  },
  {
    id: '4',
    value: 'text 4',
    homeFloor: 1,
    avatarUrl: 'https://via.placeholder.com/24',
  },
  {
    id: '5',
    value: 'text 5',
    homeFloor: 1,
    avatarUrl: 'https://via.placeholder.com/24',
  },
];

const rooms: OptionType[] = [
  {
    startTime: '08:00',
    endTime: '20:00',
    title: 'ASlo',
    floor: 1,
  },
  {
    startTime: '08:00',
    endTime: '20:00',
    title: 'ASlo 2',
    floor: 1,
  },
  {
    startTime: '08:00',
    endTime: '20:00',
    title: 'ASlo 3',
    floor: 1,
  },
  {
    startTime: '08:00',
    endTime: '20:00',
    title: 'ASlo 4',
    floor: 1,
  },
  {
    startTime: '08:00',
    endTime: '20:00',
    title: 'ASlo 5',
    floor: 1,
  },
];

export const App = ({ onMount }: Props) => {
  const [open, setOpen] = useState<'add' | 'edit' | null>(null);
  const openPage = useCallback(
    (name: 'add' | 'edit') => {
      setOpen(name);
    },
    [setOpen]
  );
  const closePage = useCallback(() => {
    setOpen(null);
  }, [setOpen]);
  const size = useMediaLayout({ maxWidth: 554 }) ? 'large' : 'default';

  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <SizeContext.Provider value={size}>
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
                onClose: closePage,
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
      {/* <Tooltip trigger={<button className="button"> Right Top </button>}></Tooltip> */}
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
  );
};
