import React, { useState, useContext, useMemo } from 'react';
import cn from 'classnames';

import { FormActions } from '../form-actions/form-actions';
import { Input } from 'components/ui/input/input';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/time-picker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { Modal } from 'components/ui/modal/modal';
import { RoomData, UserData, NewEvent } from 'components/timesheet/types';
import { useForm } from 'components/utils/use-form';
import sizeContext from 'context/size-context';
import { PageType, PageData } from 'context/page-context';
import { getRecommendation } from '../service/common';
import { validation, FormFields } from '../service/validators';
import classes from './form-ui.module.scss';

type Props = {
  type: NonNullable<PageType>;
  initialValues?: PageData;
  users: UserData[];
  rooms: RoomData[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSubmit: (values: NewEvent, initialFormData: PageData) => void;
};

const defaultFormValues = {
  title: '',
  startTime: '',
  endTime: '',
  date: null,
  users: null,
  room: null,
};

export const FormUI = ({
  type,
  initialValues = {},
  users,
  rooms,
  onClose,
  onRemove,
  onSubmit,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [eventRoom, recommendedRooms] = useMemo(
    () => getRecommendation(initialValues, rooms),
    [initialValues, rooms]
  );
  const [formState, { field, form }] = useForm<FormFields>({
    ...defaultFormValues,
    ...initialValues,
    room: eventRoom,
  });
  const size = useContext(sizeContext);

  function renderForm() {
    return [
      <div key="title">
        <label htmlFor="title">Тема</label>
        <Input
          id="title"
          size={size}
          placeholder="О чём будете говорить?"
          {...field({
            name: 'title',
            validate: validation.title,
          })}
          error={formState.validity.title === false}
        />
        {formState.errors.title && (
          <div className={classes.inputError}>{formState.errors.title}</div>
        )}
      </div>,
      <div key="datetime" className={classes.dateTime}>
        <div className={classes.date}>
          <label htmlFor="date">
            {size === 'default' ? 'Дата' : 'Дата и время'}
          </label>
          <CalendarInput
            id="date"
            size={size}
            {...field({
              name: 'date',
              validate: validation.date,
              touchOnChange: true,
            })}
            error={formState.validity.date === false}
          />
          {formState.errors.date && (
            <div className={classes.inputError}>{formState.errors.date}</div>
          )}
        </div>
        <div className={classes.timeContainer}>
          <div className={classes.time}>
            {size === 'default' && <label>Начало</label>}
            <TimePicker
              size={size}
              {...field({
                name: 'startTime',
                validate: validation.startTime,
                touchOnChange: true,
              })}
              error={
                formState.validity.startTime === false ||
                formState.validity.time === false
              }
            />
            {formState.errors.startTime && (
              <div className={classes.inputError}>
                {formState.errors.startTime}
              </div>
            )}
          </div>
          <span>&mdash;</span>
          <div className={classes.time}>
            {size === 'default' && <label>Конец</label>}
            <TimePicker
              size={size}
              {...field({
                name: 'endTime',
                validate: validation.endTime,
                touchOnChange: true,
              })}
              error={
                formState.validity.endTime === false ||
                formState.validity.time === false
              }
            />
            {formState.errors.endTime && (
              <div className={classes.inputError}>
                {formState.errors.endTime}
              </div>
            )}
          </div>
        </div>
        {formState.errors.time && (
          <div className={cn(classes.inputError, classes.timeErrors)}>
            {formState.errors.time}
          </div>
        )}
      </div>,
      <div key="users" className={classes.users}>
        <label htmlFor="users">Участники</label>
        <Selectpicker
          id="selectpicker"
          items={users}
          size={size}
          placeholder="Например, Тор Одинович"
          {...field({
            name: 'users',
            validate: validation.users,
          })}
          error={formState.validity.users === false}
        />
        {formState.errors.users && (
          <div className={classes.inputError}>{formState.errors.users}</div>
        )}
      </div>,
      <div key="room" className={classes.room}>
        <label htmlFor="room">
          {formState.values.room
            ? 'Ваша переговорка'
            : 'Рекомендуемые переговорки'}
        </label>
        <OptionPicker
          id="room"
          size={size}
          items={recommendedRooms}
          {...field({
            name: 'room',
            validate: validation.room,
            touchOnChange: true,
          })}
        />
        {formState.errors.room && (
          <div className={classes.inputError}>{formState.errors.room}</div>
        )}
      </div>,
    ];
  }

  return (
    <>
      {modalOpen && (
        <Modal
          icon="🙅🏻"
          iconLabel="none"
          title="Встреча будет удалена безвозвратно"
          buttons={[
            {
              id: '1',
              text: 'Отмена',
              onClick() {
                setModalOpen(false);
              },
            },
            {
              id: '2',
              text: 'Удалить',
              onClick() {
                onRemove(initialValues.id!);
              },
            },
          ]}
          onBackdropClick={() => setModalOpen(false)}
        />
      )}
      <div
        className={cn(classes.formArea, {
          [classes.lg]: size === 'large',
        })}
      >
        <form
          id="eventForm"
          className={classes.form}
          {...form<NewEvent>({
            name: 'form',
            onSubmit: (submittedValues: NewEvent) =>
              onSubmit(submittedValues, initialValues),
          })}
        >
          {renderForm()}
        </form>
        <div className={classes.actions}>
          <FormActions
            type={type}
            initialValues={initialValues}
            values={formState.values}
            validity={formState.validity}
            closePage={onClose}
            openModal={() => setModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};
