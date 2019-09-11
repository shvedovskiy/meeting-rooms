import React, { useEffect, FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FormUI } from './form-ui/form-ui';
import { Error } from 'components/error/error';
import { Event, NewEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { PageType, PageData } from 'context/page-context';
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
  type: NonNullable<PageType>;
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

export const FormConnector: FC<Props> = ({
  type,
  formData,
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
  const [createEvent, { loading: eventCreating }] = useMutation<
    CreateEventMutationType
  >(CREATE_EVENT_MUTATION, {
    onCompleted({ createEvent: eventData }) {
      const modalConfig = generateCreateModal(eventData, onClose);
      setModal(modalConfig);
    },
  });
  const [updateEvent, { loading: eventUpdating }] = useMutation<
    UpdateEventMutationType
  >(
    gql`
      mutation UpdateEvent(
        $id: ID!
        ${variables.input ? ',$input: UpdateEventInput' : ''}
        ${variables.roomId ? ',$roomId: ID' : ''}
        ${variables.userIds ? ',$userIds: [ID!]' : ''}
      ) {
        updateEvent(
          id: $id
          ${variables.input ? ',input: $input' : ''}
          ${variables.roomId ? ',roomId: $roomId' : ''}
          ${variables.userIds ? ',userIds: $userIds' : ''}) {
          id
          title
          date
          startTime
          endTime
          room {
            id
            title
            floor
          }
        }
      }
    `,
    {
      onCompleted({ updateEvent: eventData }) {
        const modalConfig = generateUpdateModal(eventData, onClose);
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
      updateEvent({ variables });
      setVariables({});
    }
  }, [updateEvent, variables]);

  if (fetchLoading) {
    return null;
  }
  if (fetchError || !fetchData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(values: NewEvent, initialValues: Partial<Event>) {
    const { title, date, startTime, endTime, users, room } = values;
    const event = {
      title,
      date,
      startTime,
      endTime,
    };

    if (type === 'add') {
      createEvent({
        variables: {
          input: event,
          roomId: room.id,
          userIds: users.map(u => u.id),
        },
      });
      return;
    }

    const variables: UpdateEventVariables = {
      id: initialValues.id!,
    };

    const { input, roomId, userIds } = compareFormStates(
      values as FormFields,
      initialValues
    );
    if ([input, roomId, userIds].some(Boolean)) {
      setVariables(variables);
    }
  }

  return (
    <>
      {(eventCreating || eventUpdating || eventRemoving) && (
        <Spinner fullscreen transparent />
      )}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        type={type}
        initialValues={formData}
        users={fetchData!.users}
        rooms={fetchData!.rooms}
        onClose={onClose}
        onRemove={id => removeEvent({ variables: { id } })}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
