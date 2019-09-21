import React, { useEffect, FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FormUI } from './form-ui/form-ui';
import { Error } from 'components/error/error';
import { Event, CreatedEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { PageMode, PageData } from 'context/page-context';
import {
  USERS_QUERY,
  ROOMS_QUERY,
  UsersQueryType,
  RoomsQueryType,
} from 'service/queries';
import {
  CREATE_EVENT_MUTATION,
  REMOVE_EVENT_MUTATION,
  CreateEventMutationType,
  UpdateEventMutationType,
  UpdateEventVariables,
} from 'service/mutations';
import {
  generateCreateModal,
  generateUpdateModal,
  compareFormStates,
} from './service/common';
import { FormFields } from './service/validators';
import classes from './form-connector.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

export const FormConnector: FC<Props> = ({
  mode,
  formData: initialValues,
  onMount,
  onClose,
}) => {
  const [modal, setModal] = useState<ModalDef | null>(null);
  const [variables, setVariables] = useState<Partial<UpdateEventVariables>>({});

  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
  } = useQuery<UsersQueryType & RoomsQueryType>(gql`
    query UsersRooms {
      ${USERS_QUERY}
      ${ROOMS_QUERY}
    }
  `);
  const [storeEvent, { loading: eventStoring }] = useMutation<
    CreateEventMutationType | UpdateEventMutationType
  >(
    mode === 'add'
      ? CREATE_EVENT_MUTATION
      : gql`
      mutation UpdateEvent(
        $id: ID!
        ${variables.input ? '$input: UpdateEventInput' : ''}
        ${variables.roomId ? '$roomId: ID' : ''}
        ${variables.userIds ? '$userIds: [ID!]' : ''}
      ) {
        updateEvent(
          id: $id
          ${variables.input ? 'input: $input' : ''}
          ${variables.roomId ? 'roomId: $roomId' : ''}
          ${variables.userIds ? 'userIds: $userIds' : ''}) {
          id, title, date, startTime, endTime, room { id, title, floor }
        }
      }
    `,
    {
      onCompleted(response) {
        let modalConfig: ModalDef;
        if (mode === 'add') {
          modalConfig = generateCreateModal(
            (response as CreateEventMutationType).createEvent,
            onClose
          );
        } else {
          modalConfig = generateUpdateModal(
            (response as UpdateEventMutationType).updateEvent,
            onClose
          );
        }
        setModal(modalConfig);
      },
    }
  );
  const [removeEvent, { loading: eventRemoving }] = useMutation(
    REMOVE_EVENT_MUTATION,
    { onCompleted: () => onClose() }
  );

  useEffect(() => {
    if (!fetchLoading) {
      onMount();
    }
  }, [fetchLoading, onMount]);

  useEffect(() => {
    if (Object.keys(variables).length !== 0) {
      storeEvent({ variables });
      setVariables({});
    }
  }, [storeEvent, variables]);

  if (fetchLoading) {
    return null;
  }
  if (fetchError || !fetchData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(formValues: CreatedEvent) {
    const { title, date, startTime, endTime, users, room } = formValues;
    const event = {
      title,
      date,
      startTime,
      endTime,
    };

    if (mode === 'add') {
      storeEvent({
        variables: {
          input: event,
          roomId: room.id,
          userIds: users.map(u => u.id),
        },
      });
      return;
    }

    const { id } = initialValues as Event;
    let variables: UpdateEventVariables = { id };
    const diff = compareFormStates(
      formValues as FormFields,
      initialValues as Event
    );
    if (['input', 'roomId', 'userIds'].some(i => diff.hasOwnProperty(i))) {
      variables = {
        ...variables,
        ...diff,
      };
    }
    setVariables(variables);
  }

  return (
    <>
      {(eventStoring || eventRemoving) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        mode={mode}
        initialValues={initialValues}
        users={fetchData!.users}
        rooms={fetchData!.rooms}
        onClose={onClose}
        onRemove={() => removeEvent({ variables: { id: initialValues!.id } })}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
