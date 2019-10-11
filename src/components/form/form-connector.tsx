import React, { useEffect, FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FormUI } from './form-ui/form-ui';
import { Error } from 'components/error/error';
import { CreatedEvent, FormEvent } from 'components/timesheet/types';
import { Spinner } from 'components/ui/spinner/spinner';
import { Props as ModalDef, Modal } from 'components/ui/modal/modal';
import { PageMode, PageData } from 'context/page-context';
import { USERS_QUERY, UsersQueryType as UsersQuery } from 'service/queries';
import {
  CREATE_EVENT_MUTATION,
  REMOVE_EVENT_MUTATION,
  CreateEventMutationType,
  UpdateEventMutationType,
  UpdateEventVariables,
} from 'service/mutations';
import { generateCreateModal, generateUpdateModal } from './form-common/modals';
import { compareFormStates } from './form-common/compare-form-states';
import { FormFields } from './form-common/validators';
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
  const [vars, setVars] = useState<Partial<UpdateEventVariables>>({});

  const { data: usersData, loading, error } = useQuery<UsersQuery>(gql`
    query {
      ${USERS_QUERY}
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
        ${vars.input ? '$input: UpdateEventInput' : ''}
        ${vars.roomId ? '$roomId: ID' : ''}
        ${vars.userIds ? '$userIds: [ID!]' : ''}
      ) {
        updateEvent(
          id: $id
          ${vars.input ? 'input: $input' : ''}
          ${vars.roomId ? 'roomId: $roomId' : ''}
          ${vars.userIds ? 'userIds: $userIds' : ''}) {
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
    if (!loading) {
      onMount();
    }
  }, [loading, onMount]);

  useEffect(() => {
    if (Object.keys(vars).length !== 0) {
      storeEvent({ variables: vars });
      setVars({});
    }
  }, [storeEvent, vars]);

  if (loading) {
    return null;
  }
  if (error || !usersData) {
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
    setVars(variables);
  }

  return (
    <>
      {(eventStoring || eventRemoving) && <Spinner fullscreen transparent />}
      {modal && <Modal {...modal} enterAnimation={false} />}
      <FormUI
        mode={mode}
        initialValues={initialValues}
        users={usersData!.users}
        onClose={onClose}
        onRemove={() => removeEvent({ variables: { id: initialValues!.id } })}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
