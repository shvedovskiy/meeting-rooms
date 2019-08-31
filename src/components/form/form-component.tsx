import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { useForm, StateValues } from 'components/utils/use-form';
import classes from './form.module.scss';
import { Button } from 'components/ui/button/button';
import sizeContext from 'context/size-context';
import { Input } from 'components/ui/input/input';
import { RoomData, RoomCard, UserData } from 'components/timesheet/types';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/time-picker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { EditFormFields, validation } from './common';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { PageType, PageData } from 'context/page-context';

type Props = {
  type: NonNullable<PageType>;
  formData?: PageData;
  users: UserData[];
  rooms: RoomData[];
  onClose: () => void;
};

function getRecommendation(
  event: PageData,
  rooms: RoomData[]
): [RoomCard | null, RoomCard[]] {
  let eventRoom: RoomCard | null = null;
  const recommendedRooms = rooms.map(r => {
    if (event.room && r.id === event.room.id) {
      eventRoom = {
        ...r,
        startTime: event.startTime!,
        endTime: event.endTime!,
      };
      return eventRoom;
    }
    return {
      ...r,
      startTime: '13:00',
      endTime: '14:00',
    };
  });
  return [eventRoom, recommendedRooms];
}

const defaultFormData = {
  title: '',
  startTime: '',
  endTime: '',
  date: null,
  users: null,
  room: null,
};

export const FormComponent = ({
  type,
  formData = {},
  users,
  rooms,
  onClose,
}: Props) => {
  const [eventRoom, recommendedRooms] = useMemo(
    () => getRecommendation(formData, rooms),
    [formData, rooms]
  );
  const [formState, { field, form }] = useForm<EditFormFields>({
    ...defaultFormData,
    ...formData,
    room: eventRoom,
  });
  const size = useContext(sizeContext);

  function handleCancel() {
    if (onClose) {
      onClose();
    }
  }

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
          <span>–</span>
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
          <div className={classNames(classes.inputError, classes.timeErrors)}>
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
    <div
      className={classNames(classes.formArea, {
        [classes.lg]: size === 'large',
      })}
    >
      <form
        id="eventForm"
        className={classes.form}
        {...form({
          name: 'form',
          onSubmit(values: StateValues<EditFormFields>) {
            debugger;
          },
        })}
      >
        {renderForm()}
      </form>
      <div className={classes.actions}>
        <Button className={classes.action} onClick={handleCancel}>
          Отмена
        </Button>
        <Button
          use="primary"
          type="submit"
          form="eventForm"
          className={classes.action}
          disabled={Object.values(formState.validity).some(v => v === false)}
        >
          {type === 'add' ? 'Создать встречу' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
};
