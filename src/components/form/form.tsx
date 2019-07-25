import React, { FC, useEffect, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { useForm, StateValues } from 'components/utils/use-form';

import classes from './form.module.scss';
import { Button } from 'components/ui/button/button';
import sizeContext from 'context/size-context';
import { Input } from 'components/ui/input/input';
import {
  Event,
  UserData,
  RoomData,
  RoomCard,
  NewEvent,
} from 'components/timesheet/types';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/timepicker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { EditFormFields, validation } from './common';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { PageType } from 'context/page-context';

type Props = {
  type: PageType;
  eventData: Event | NewEvent;
  users?: UserData[];
  rooms: RoomData[];
  onMount?: () => void;
  onClose?: () => void;
};

function getRecommendation(
  eventData: Event | NewEvent,
  rooms: RoomData[]
): [RoomCard | null, RoomCard[]] {
  let eventRoom: RoomCard | null = null;
  const recommendedRooms = rooms.map(r => {
    if (eventData.room && r.id === eventData.room.id) {
      eventRoom = {
        ...r,
        startTime: eventData.startTime!,
        endTime: eventData.endTime!,
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

const defaultEventData = {
  title: '',
  startTime: null,
  endTime: null,
  date: null,
  participants: null,
  room: null,
};

export const Form: FC<Props> = ({
  type,
  eventData,
  users,
  rooms,
  onMount,
  onClose,
}) => {
  const [eventRoom, recommendedRooms] = useMemo(
    () => getRecommendation(eventData, rooms),
    [eventData, rooms]
  );
  const [formState, { field, form }] = useForm<EditFormFields>({
    ...defaultEventData,
    ...eventData,
    room: eventRoom,
  });
  const size = useContext(sizeContext);

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

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
            {/* https://github.com/wojtekmaj/react-time-picker/issues/18 */}
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
      <div key="participants" className={classes.participants}>
        <label htmlFor="participants">Участники</label>
        <Selectpicker
          id="selectpicker"
          items={users || []}
          size={size}
          placeholder="Например, Тор Одинович"
          {...field({
            name: 'participants',
            validate: validation.participants,
          })}
          error={formState.validity.participants === false}
        />
        {formState.errors.participants && (
          <div className={classes.inputError}>
            {formState.errors.participants}
          </div>
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