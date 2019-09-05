import React, { useEffect, FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FormUI } from './form-ui';
import { Error } from 'components/error/error';
import { NewEvent } from 'components/timesheet/types';
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
  REMOVE_EVENT_MUTATION,
  CREATE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
  CreateEventMutationType,
  UpdateEventMutationType,
} from 'service/mutations';
import { generateCreateModal, generateUpdateModal } from './common';
import classes from './form.module.scss';

type Props = {
  type: NonNullable<PageType>;
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

interface UploadConfig {
  [mutation: string]: {
    resolver: (oprions: any) => {};
    variables: Record<string, any> | null;
  };
}

export const Form: FC<Props> = ({ onMount, onClose, ...formProps }) => {
  const [modal, setModal] = useState<ModalDef | null>(null);

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
  >(UPDATE_EVENT_MUTATION, {
    onCompleted({ updateEvent: eventData }) {
      const modalConfig = generateUpdateModal(eventData, onClose);
      setModal(modalConfig);
    },
  });
  const [removeEvent, { loading: eventRemoving }] = useMutation(
    REMOVE_EVENT_MUTATION,
    { onCompleted: () => onClose() }
  );

  useEffect(() => {
    if (!fetchLoading) {
      onMount();
    }
  }, [fetchLoading, onMount]);

  if (fetchLoading) {
    return null;
  }
  if (fetchError || !fetchData) {
    return <Error className={classes.loadingError} />;
  }

  function handleFormSubmit(values: NewEvent, initialFormData: PageData) {
    // TODO validate fields
    const { title, date, startTime, endTime, users, room } = values;
    const event = {
      title,
      date,
      startTime,
      endTime,
    };

    if (formProps.type === 'add') {
      createEvent({
        variables: {
          input: event,
          roomId: room.id,
          userIds: users.map(u => u.id),
        },
      });
      return;
    }

    const uploadConfig: UploadConfig = {
      updateEvent: {
        resolver: updateEvent,
        variables: { input: event },
      },
      // addUsersToEvent: {
      //   resolver: addUsersToEvent,
      //   variables: null,
      // },
      // removeUsersFromEvent: {
      //   resolver: removeUsersFromEvent,
      //   variables: null,
      // },
      // changeEventRoom: {
      //   resolver: changeEventRoom,
      //   variables: null,
      // },
    };

    if (initialFormData.room && initialFormData.room.id !== room.id) {
      uploadConfig.changeEventRoom.variables = {
        id: values.id,
        roomId: room.id,
      };
    }

    if (initialFormData.users) {
      const usersToAdd: string[] = [];
      const usersToRemove: string[] = [];
      for (let user of users) {
        if (!initialFormData.users.find(u => u.id === user.id)) {
          usersToAdd.push(user.id);
        }
      }
      if (usersToAdd.length) {
        uploadConfig.addUsersToEvent.variables = {
          id: values.id,
          userIds: usersToAdd,
        };
      }
      for (let user of initialFormData.users) {
        if (!users.find(u => u.id === user.id)) {
          usersToRemove.push(user.id);
        }
      }
      if (usersToRemove.length) {
        uploadConfig.removeUsersFromEvent.variables = {
          id: values.id,
          userIds: usersToRemove,
        };
      }
    }

    for (let mutation of Object.values(uploadConfig)) {
      if (mutation.variables !== null) {
        mutation.resolver({ variables: mutation.variables });
      }
    }
  }

  return (
    <>
      {(eventCreating || eventRemoving) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        {...formProps}
        users={fetchData!.users}
        rooms={fetchData!.rooms}
        onClose={onClose}
        onRemove={id => removeEvent({ variables: { id } })}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
