import React from 'react';
import cn from 'classnames';

import { FormActions } from '../form-actions/form-actions';
import { Input } from 'components/ui/input/input';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/time-picker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { UserData, CreatedEvent } from 'components/timesheet/types';
import { useForm, StateValidity } from 'components/utils/use-form';
import { useSizeCtx } from 'context/size-context';
import { PageMode, PageData } from 'context/page-context';
import { useRecommendation } from '../service/use-recommendation';
import { validation, FormFields } from '../service/validators';
import classes from './form-ui.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  users: UserData[];
  onClose: () => void;
  onRemove: () => void;
  onSubmit: (values: CreatedEvent) => void;
} & typeof defaultProps;

const defaultProps = {
  initialValues: {},
};

const defaultFormValues = {
  title: '',
  startTime: '',
  endTime: '',
  date: null,
  users: null,
  room: null,
};

function isRoomSelectorAllowed(
  mode: NonNullable<PageMode>,
  validity: StateValidity<FormFields>,
  initialValues: PageData
) {
  const { date, startTime, endTime, time } = validity;
  const {
    date: initDate,
    startTime: initStartTime,
    endTime: initEndTime,
  } = initialValues;
  const selectorAllowedForAdd =
    mode === 'add' &&
    [date, startTime, endTime].every(Boolean) &&
    time !== false;
  const selectorAllowedForPartialAdd =
    mode === 'add' &&
    [initDate, initStartTime, initEndTime].every(Boolean) &&
    [date, startTime, endTime, time].every(v => v !== false);
  const selectorAllowedForEdit =
    mode === 'edit' && ![date, startTime, endTime, time].some(v => v === false);
  return (
    selectorAllowedForAdd ||
    selectorAllowedForPartialAdd ||
    selectorAllowedForEdit
  );
}

export const FormUI = (props: Props) => {
  const { mode, initialValues, users, onClose, onRemove, onSubmit } = props;

  const size = useSizeCtx();
  const [eventRoom, recommendedRooms] = useRecommendation(initialValues);
  const [formState, { field, form }] = useForm<FormFields>({
    ...defaultFormValues,
    ...initialValues,
    room: eventRoom,
  });

  function renderFormFields() {
    const fields = [
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
    ];

    if (isRoomSelectorAllowed(mode, formState.validity, initialValues)) {
      fields.push(
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
        </div>
      );
    }

    return fields;
  }

  return (
    <>
      <div
        className={cn(classes.formArea, {
          [classes.lg]: size === 'large',
        })}
      >
        <form
          id="eventForm"
          className={classes.form}
          {...form<CreatedEvent>({ name: 'form', onSubmit })}
        >
          {renderFormFields()}
        </form>
        <FormActions
          mode={mode}
          initialValues={initialValues}
          values={formState.values}
          validity={formState.validity}
          closePage={onClose}
          removeEvent={onRemove}
        />
      </div>
    </>
  );
};

FormUI.defaultProps = defaultProps;
