import React from 'react';

import { Header } from '../header/header';
import { Button } from '../ui/button/button';
import { Modal } from '../ui/modal/modal';
import { Tooltip } from '../ui/tooltip/tooltip';

export const App: React.FC = () => (
  <>
    <Header>
      <Button use="primary">Создать встречу</Button>
    </Header>
    <Modal
      icon="🙅🏻"
      title="Modal Title"
      text="Modal Text"
      buttons={[{ id: '1', text: 'Text 1' }, { id: '2', text: 'Text 1' }]}
    />
    <Tooltip trigger={<button className="button"> Right Top </button>}>
      <div>Test</div>
    </Tooltip>
  </>
);
