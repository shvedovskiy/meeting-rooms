import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FormUI } from '../form-ui/form-ui';
import { Error } from 'components/error/error';
import { CreatedEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { FormPageProps as Props, EventToMove } from '../form-common/types';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { USERS_QUERY, UsersQueryType as UsersQuery } from 'service/apollo/queries';
import {
  CREATE_EVENT_MUTATION as CREATE,
  MOVE_EVENTS_MUTATION as MOVE,
  CreateEventMutation,
  MoveEventsMutation,
  CreateEventVars,
  UpdateEventVars,
} from 'service/apollo/mutations';
import {
  updateCacheAfterStoring as updateCacheAfterCreating,
  updateCacheAfterMoving,
  refetchQueriesAfterStoring as refetchQueriesAfterCreating,
  refetchQueriesAfterMoving,
} from 'service/apollo/cache';
import { generateCreateModal, generateFailedSaveModal } from '../form-common/modals';
import classes from '../form.module.scss';

export const FormAdd: FC<Props> = ({ formData, onMount, onClose: closePage }) => {
  const [modal, setModal] = useState<ModalDef | null>(null);
  const [vars, setVars] = useState<Partial<CreateEventVars>>({});
  const eventsToMove = useRef<EventToMove[]>([]);
  const closeModal = useCallback(() => setModal(null), []);

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery<UsersQuery>(
    USERS_QUERY
  );
  const [createEvent, { loading: creating }] = useMutation<CreateEventMutation>(CREATE, {
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
      updateCacheAfterCreating(cache, data);
    },
    refetchQueries: ({ data }: { data: CreateEventMutation }) =>
      refetchQueriesAfterCreating(data),
  });
  const [moveEvents, { loading: moving }] = useMutation<MoveEventsMutation>(MOVE, {
    onCompleted() {
      if (Object.keys(vars).length) {
        createEvent({ variables: vars });
      }
    },
    onError({ message }) {
      const modalConfig = generateFailedSaveModal(
        message,
        () => {
          const inputsToMove: UpdateEventVars[] = eventsToMove.current.map(
            ({ prevRoom, ...eventData }) => eventData
          );
          if (inputsToMove.length) {
            moveEvents({ variables: { events: inputsToMove } });
          }
          closeModal();
        },
        closeModal
      );
      setModal(modalConfig);
    },
    update(cache, { data }) {
      updateCacheAfterMoving(cache, data);
    },
    refetchQueries: ({ data }: { data: MoveEventsMutation }) =>
      refetchQueriesAfterMoving(data, eventsToMove.current),
  });

  // Hide loading spinner:
  useEffect(() => {
    if (!usersLoading) {
      onMount();
    }
  }, [usersLoading, onMount]);

  if (usersLoading) {
    return null;
  }
  if (usersError || !usersData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(formValues: CreatedEvent) {
    const { title, date, startTime, endTime, users, room } = formValues;
    const variables: CreateEventVars = {
      input: { title, date, startTime, endTime },
      roomId: room.id,
      userIds: users.map(u => u.id),
    };
    setVars(variables);

    const inputsToMove: UpdateEventVars[] = eventsToMove.current.map(
      ({ prevRoom, ...eventData }) => eventData
    );
    if (inputsToMove.length) {
      moveEvents({ variables: { events: inputsToMove } });
    } else {
      createEvent({ variables });
    }
  }

  return (
    <>
      {(creating || moving) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        mode="add"
        users={usersData.users}
        initialValues={formData}
        eventsToMove={eventsToMove}
        onClose={closePage}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
