import React, { useState, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { useForm, FormState, StateErrors } from 'components/utils/use-form';
import classes from './form.module.scss';
import { Button } from 'components/ui/button/button';
import sizeContext from 'context/size-context';
import { Input } from 'components/ui/input/input';
import {
  RoomData,
  RoomCard,
  UserData,
  NewEvent,
} from 'components/timesheet/types';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/time-picker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { Modal } from 'components/ui/modal/modal';
import { validation, EditFormFields } from './validators';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { PageType, PageData } from 'context/page-context';

type Props = {
  type: NonNullable<PageType>;
  formData?: PageData;
  users: UserData[];
  rooms: RoomData[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSubmit: (values: NewEvent, initialFormData: PageData) => void;
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

function isSubmitBlocked(
  formType: NonNullable<PageType>,
  formState: FormState<EditFormFields, StateErrors<EditFormFields, string>>
) {
  if (formType === 'add') {
    return (
      Object.keys(formState.validity).length <= 6 || // number of fields
      Object.values(formState.validity).some(v => v === false)
    );
  } else {
    // TODO
    return false;
    // let changed = false;
    // for (let [fieldName, fieldValue] of Object.entries(formState.values)) {
    //   // @ts-ignore
    //   if (initialData[fieldName] !== fieldValue) {
    //     changed = true;
    //     break;
    //   }
    // }

    // return changed;
  }
}

const defaultFormData = {
  title: '',
  startTime: '',
  endTime: '',
  date: null,
  users: null,
  room: null,
};

export const FormUI = ({
  type,
  formData = {},
  users,
  rooms,
  onClose,
  onRemove,
  onSubmit,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
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

  function renderFormActions() {
    return (
      <>
        <Button className={classes.action} onClick={() => onClose()}>
          Отмена
        </Button>
        {type === 'edit' && (
          <Button className={classes.action} onClick={() => setModalOpen(true)}>
            Удалить встречу
          </Button>
        )}
        <Button
          use={type === 'add' ? 'primary' : 'default'}
          type="submit"
          form="eventForm"
          className={classes.action}
          // disabled={isSubmitBlocked(type, formState)} <-- TODO
        >
          {type === 'add' ? 'Создать встречу' : 'Сохранить'}
        </Button>
      </>
    );
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
                onRemove(formData.id!);
              },
            },
          ]}
          onBackdropClick={() => setModalOpen(false)}
        />
      )}
      <div
        className={classNames(classes.formArea, {
          [classes.lg]: size === 'large',
        })}
      >
        <form
          id="eventForm"
          className={classes.form}
          {...form<NewEvent>({
            name: 'form',
            onSubmit: (values: NewEvent) => onSubmit(values, formData),
          })}
        >
          {renderForm()}
        </form>
        <div className={classes.actions}>{renderFormActions()}</div>
      </div>
    </>
  );
};
