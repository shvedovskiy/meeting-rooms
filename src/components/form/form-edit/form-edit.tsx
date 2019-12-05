import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FormUI } from '../form-ui/form-ui';
import { Error } from 'components/error/error';
import { CreatedEvent, FormEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { FormPageProps as Props, EventToMove } from '../form-common/types';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import {
  USERS_QUERY,
  UsersQueryType as UsersQuery,
} from 'service/apollo/queries';
import {
  UPDATE_EVENT_MUTATION as UPDATE,
  MOVE_EVENTS_MUTATION as MOVE,
  REMOVE_EVENT_MUTATION as REMOVE,
  UpdateEventMutation,
  RemoveEventMutation,
  MoveEventsMutation,
  UpdateEventVars,
} from 'service/apollo/mutations';
import {
  updateCacheAfterStoring as updateCacheAfterUpdating,
  updateCacheAfterMoving,
  updateCacheAfterRemoving,
  refetchQueriesAfterStoring as refetchCacheAfterUpdaring,
  refetchQueriesAfterMoving,
  refetchQueriesAfterRemoving,
} from 'service/apollo/cache';
import {
  generateUpdateModal,
  generateFailedSaveModal,
  generateFailedRemoveModal,
} from '../form-common/modals';
import { compareFormStates } from '../form-common/compare-form-states';
import { FormFields } from '../form-common/validators';
import classes from '../form.module.scss';

export const FormEdit: FC<Props> = ({
  formData: initialValues,
  onMount,
  onClose: closePage,
}) => {
  const [modal, setModal] = useState<ModalDef | null>(null);
  const [vars, setVars] = useState<Partial<UpdateEventVars>>({});
  const eventsToMove = useRef<EventToMove[]>([]);
  const closeModal = useCallback(() => setModal(null), []);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<UsersQuery>(USERS_QUERY);
  const [updateEvent, { loading: updating }] = useMutation<UpdateEventMutation>(
    UPDATE,
    {
      onCompleted({ updateEvent }) {
        setModal(generateUpdateModal(updateEvent, closePage));
      },
      onError({ message }) {
        const modalConfig = generateFailedSaveModal(
          message,
          () => {
            updateEvent({ variables: vars });
            closeModal();
          },
          closeModal
        );
        setModal(modalConfig);
      },
      update(cache, { data }) {
        updateCacheAfterUpdating(cache, data);
      },
      refetchQueries({ data }) {
        const { date: oldDate, room: oldRoom } = initialValues || {};
        return refetchCacheAfterUpdaring(data, (oldRoom || {}).id, oldDate);
      },
    }
  );
  const [moveEvents, { loading: moving }] = useMutation<MoveEventsMutation>(
    MOVE,
    {
      onCompleted() {
        if (Object.keys(vars).length) {
          updateEvent({ variables: vars });
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
    }
  );
  const [removeEvent, { loading: removing }] = useMutation<RemoveEventMutation>(
    REMOVE,
    {
      onCompleted: closePage,
      onError({ message }) {
        const modalConfig = generateFailedRemoveModal(
          message,
          () => {
            if (initialValues && initialValues.id) {
              removeEvent({ variables: { id: initialValues.id } });
            }
            closeModal();
          },
          closeModal
        );
        setModal(modalConfig);
      },
      update(cache, { data }) {
        updateCacheAfterRemoving(cache, data);
      },
      refetchQueries: ({ data }) => refetchQueriesAfterRemoving(data),
    }
  );

  // Hide loading spinner:
  useEffect(() => {
    if (!usersLoading) {
      onMount();
    }
  }, [onMount, usersLoading]);

  if (usersLoading) {
    return null;
  }
  if (usersError || !usersData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(formValues: CreatedEvent) {
    const diff = compareFormStates(
      formValues as FormFields,
      initialValues as FormEvent
    );
    if (['input', 'roomId', 'userIds'].some(i => diff.hasOwnProperty(i))) {
      const variables: UpdateEventVars = {
        id: (initialValues as FormEvent).id,
        ...diff,
      };
      setVars(variables);
      const inputsToMove: UpdateEventVars[] = eventsToMove.current.map(
        ({ prevRoom, ...eventData }) => eventData
      );
      if (inputsToMove.length) {
        moveEvents({ variables: { events: inputsToMove } });
      } else {
        updateEvent({ variables });
      }
    }
  }

  function handleRemove() {
    if (initialValues && initialValues.id) {
      removeEvent({ variables: { id: initialValues.id } });
    }
  }

  return (
    <>
      {(updating || moving || removing) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        mode="edit"
        users={usersData.users}
        initialValues={initialValues}
        eventsToMove={eventsToMove}
        onClose={closePage}
        onRemove={handleRemove}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
