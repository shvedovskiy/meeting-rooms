import React from 'react';
// @ts-ignore TODO https://github.com/DefinitelyTyped/DefinitelyTyped/pull/36058
import withSizes from 'react-sizes';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Modal } from 'components/ui/modal/modal';
import SizeContext, { SizeContextType } from 'context/size-context';
import { isMobile } from 'service/sizes';
import { Input } from 'components/ui/input/input';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { ItemType } from 'components/ui/selectpicker/option/option';

type Props = {
  size: SizeContextType;
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

const AppComponent = ({ size }: Props) => (
  <SizeContext.Provider value={size}>
    <Header>
      <Button use="primary">Создать встречу</Button>
    </Header>
    <Modal
      icon="🙅🏻"
      title="Modal Title"
      text="Modal Text"
      buttons={[{ id: '1', text: 'Text 1' }, { id: '2', text: 'Text 1' }]}
    />
    {/*
    <Tooltip trigger={<button className="button"> Right Top </button>}>
      <div>Test</div>
    </Tooltip> */}

    <div style={{ marginLeft: '30px', width: '250px' }}>
      <Input size={size} placeholder="Например, Тор Одинович" />
      <Selectpicker
        items={items}
        size={size}
        placeholder="Например, Тор Одинович"
      />
    </div>
  </SizeContext.Provider>
);

const mapSizesToProps = ({ width }: { width: number }) => ({
  size: isMobile(width) ? 'large' : 'default',
});

export const App = withSizes(mapSizesToProps)(AppComponent);
