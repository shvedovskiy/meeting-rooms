import React from 'react';
// @ts-ignore TODO
import withSizes from 'react-sizes';

import { Header } from 'components/header/header';
import { Button } from 'components/ui/button/button';
import { Modal } from 'components/ui/modal/modal';
import { Input } from 'components/ui/input/input';
import SizeContext, { SizeContextType } from 'context/size-context';
import { isMobile } from 'service/sizes';

type Props = {
  size: SizeContextType;
};

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
    {/* <Input size={isMobile} /> */}
  </SizeContext.Provider>
);

const mapSizesToProps = ({ width }: { width: number }) => ({
  size: isMobile(width) ? 'large' : 'default',
});

export const App = withSizes(mapSizesToProps)(AppComponent);
