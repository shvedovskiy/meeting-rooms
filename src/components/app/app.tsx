import React, { useEffect } from 'react';
import { useMediaLayout } from 'use-media';
import { useQuery } from '@apollo/react-hooks';

import SizeContext from 'context/size-context';
import {
  GET_USERS_ROOMS,
  UsersRoomsQueryType as QueryType,
} from 'service/queries';
import { AppComponent } from './app-component';

type Props = {
  onLoad: () => void;
};

export const App = ({ onLoad }: Props) => {
  const size = useMediaLayout({ maxWidth: '34.625em' }) ? 'large' : 'default';
  const { loading, data: fetchData } = useQuery<QueryType>(GET_USERS_ROOMS);

  useEffect(() => {
    if (loading === false) {
      onLoad();
    }
  }, [onLoad, loading]);

  if (loading) {
    return null;
  }
  return (
    <SizeContext.Provider value={size}>
      <AppComponent appData={fetchData} />
      {/* <Modal
        icon="🙅🏻"
        title="Modal Title"
        text="Modal Text"
        buttons={[{ id: '1', text: 'Text 1' }, { id: '2', text: 'Text 1' }]}
      /> */}
    </SizeContext.Provider>
  );
};
