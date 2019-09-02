import React, { useEffect, FC } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Error } from 'components/error/error';
import { FormUI } from './form-ui';
import { PageType, PageData } from 'context/page-context';
import { USERS_ROOMS_QUERY, UsersRoomsQueryType } from 'service/queries';
import classes from './form.module.scss';

type Props = {
  type: NonNullable<PageType>;
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

export const Form: FC<Props> = ({ onMount, ...formProps }) => {
  const { data, loading, error } = useQuery<UsersRoomsQueryType>(
    USERS_ROOMS_QUERY
  );

  useEffect(() => {
    if (!loading) {
      onMount();
    }
  }, [loading, onMount]);

  if (loading) {
    return null;
  }
  if (error || !data) {
    return <Error className={classes.loadingError} />;
  }
  return <FormUI {...formProps} users={data!.users} rooms={data!.rooms} />;
};
