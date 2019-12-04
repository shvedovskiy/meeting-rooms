import React, { FC, useEffect, useState, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FormUI } from '../form-ui/form-ui';
import { Error } from 'components/error/error';
import { CreatedEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { FormPageProps } from '../types';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { MovedEvent } from '../form-ui/utils';
import {
  USERS_QUERY,
  UsersQueryType as UsersQuery,
} from 'service/apollo/queries';
import {
  CREATE_EVENT_MUTATION,
  CreateEventMutationType as CreateMutation,
  CreateEventVariables,
  UpdateEventMutationType as UpdateMutation,
  UPDATE_EVENT_MUTATION,
} from 'service/apollo/mutations';
import {
  updateCacheAfterUpdating,
  refetchQueriesAfterStoring,
} from 'service/apollo/cache';
import {
  generateCreateModal,
  generateFailedSaveModal,
} from '../form-common/modals';
import classes from '../form.module.scss';

export const FormAdd: FC<FormPageProps> = ({ onMount, onClose: closePage }) => {
  const [modal, setModal] = useState<ModalDef | null>(null);
  const [vars, setVars] = useState<Partial<CreateEventVariables>>({});
  const movedEvents = useRef<MovedEvent[]>([]);
  const closeModal = useCallback(() => setModal(null), []);

  const {
    data: usersData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<UsersQuery>(USERS_QUERY);
  const [createEvent, { loading: creating }] = useMutation<CreateMutation>(
    CREATE_EVENT_MUTATION,
    {
      onCompleted({ createEvent }) {
        setModal(generateCreateModal(createEvent, closePage));
      },
      onError({ message }) {
        const modalConfig = generateFailedSaveModal(
          message,
          () => {
            createEvent({ variables: vars });
            closeModal();
          },
          closeModal
        );
        setModal(modalConfig);
      },
      update(cache, { data }) {
        updateCacheAfterUpdating(cache, data);
      },
      refetchQueries: ({ data }) => refetchQueriesAfterStoring(data),
    }
  );
  const [moveEvent, { loading: moving }] = useMutation<UpdateMutation>(
    UPDATE_EVENT_MUTATION,
    {
      update(cache, { data }) {
        updateCacheAfterUpdating(cache, data);
      },
    }
  );

  // Hide loading spinner:
  useEffect(() => {
    if (!queryLoading) {
      onMount();
    }
  }, [queryLoading, onMount]);

  if (queryLoading) {
    return null;
  }
  if (queryError || !usersData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(formValues: CreatedEvent) {
    for (const { prevRoom, ...eventData } of movedEvents.current) {
      moveEvent({
        variables: eventData,
        refetchQueries: ({ data }) =>
          refetchQueriesAfterStoring(data, prevRoom),
      });
    }
    const { title, date, startTime, endTime, users, room } = formValues;
    const variables: CreateEventVariables = {
      input: {
        title,
        date,
        startTime,
        endTime,
      },
      roomId: room.id,
      userIds: users.map(u => u.id),
    };
    setVars(variables);
    createEvent({ variables });
  }

  return (
    <>
      {(creating || moving) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        mode="add"
        users={usersData.users}
        movedEvents={movedEvents}
        onClose={closePage}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
