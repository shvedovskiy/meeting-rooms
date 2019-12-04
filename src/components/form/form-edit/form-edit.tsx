import React, { FC, useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FormUI } from '../form-ui/form-ui';
import { Error } from 'components/error/error';
import { CreatedEvent, FormEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { FormPageProps } from '../types';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { MovedEvent } from '../form-ui/utils';
import {
  USERS_QUERY,
  UsersQueryType as UsersQuery,
} from 'service/apollo/queries';
import {
  UPDATE_EVENT_MUTATION,
  REMOVE_EVENT_MUTATION,
  UpdateEventMutationType as UpdateMutation,
  UpdateEventVariables,
  RemoveEventMutationType as RemoveMutation,
} from 'service/apollo/mutations';
import {
  updateCacheAfterUpdating,
  updateCacheAfterRemoving,
  refetchQueriesAfterStoring,
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

export const FormEdit: FC<FormPageProps> = ({
  formData: initialValues,
  onMount,
  onClose,
}) => {
  const [modal, setModal] = useState<ModalDef | null>(null);
  const [vars, setVars] = useState<Partial<UpdateEventVariables>>({});
  const movedEvents = useRef<MovedEvent[]>([]);

  const {
    data: usersData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<UsersQuery>(USERS_QUERY);
  const [updateEvent, { loading: updating }] = useMutation<UpdateMutation>(
    UPDATE_EVENT_MUTATION,
    {
      onCompleted({ updateEvent }) {
        setModal(generateUpdateModal(updateEvent, onClose));
      },
      onError({ message }) {
        const modalConfig = generateFailedSaveModal(
          message,
          () => {
            updateEvent({ variables: vars });
            setModal(null);
          },
          () => setModal(null)
        );
        setModal(modalConfig);
      },
      update(cache, { data }) {
        updateCacheAfterUpdating(cache, data);
      },
      refetchQueries({ data }) {
        const { date: oldDate, room: oldRoom } = initialValues || {};
        return refetchQueriesAfterStoring(data, (oldRoom || {}).id, oldDate);
      },
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
  const [removeEvent, { loading: removing }] = useMutation<RemoveMutation>(
    REMOVE_EVENT_MUTATION,
    {
      onCompleted: onClose,
      onError({ message }) {
        const modalConfig = generateFailedRemoveModal(
          message,
          () => {
            if (initialValues && initialValues.id) {
              removeEvent({ variables: { id: initialValues.id } });
            }
            setModal(null);
          },
          () => setModal(null)
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
    if (!queryLoading) {
      onMount();
    }
  }, [onMount, queryLoading]);

  if (queryLoading) {
    return null;
  }
  if (queryError || !usersData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(formValues: CreatedEvent) {
    const { id } = initialValues as FormEvent;
    let variables: UpdateEventVariables = { id };
    const diff = compareFormStates(
      formValues as FormFields,
      initialValues as FormEvent
    );
    if (['input', 'roomId', 'userIds'].some(i => diff.hasOwnProperty(i))) {
      variables = {
        ...variables,
        ...diff,
      };
    }
    for (const { prevRoom, ...eventData } of movedEvents.current) {
      moveEvent({
        variables: eventData,
        refetchQueries: ({ data }) =>
          refetchQueriesAfterStoring(data, prevRoom),
      });
    }
    setVars(variables);
    updateEvent({ variables });
  }

  function onRemoveEvent() {
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
        movedEvents={movedEvents}
        onClose={onClose}
        onRemove={onRemoveEvent}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
