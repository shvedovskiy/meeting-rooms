import React, { MutableRefObject } from 'react';
import cn from 'classnames';

import { FormActions } from '../form-actions/form-actions';
import { Input } from 'components/ui/input/input';
import { CalendarInput } from 'components/ui/calendar/calendar-input/calendar-input';
import { TimePicker } from 'components/ui/timepicker/time-picker';
import { Selectpicker } from 'components/ui/selectpicker/selectpicker';
import { OptionPicker } from 'components/ui/option-picker/option-picker';
import { UserData, CreatedEvent } from 'components/timesheet/types';
import { useForm } from 'components/common/use-form';
import { useSizeCtx } from 'context/size-context';
import { PageMode, PageData } from 'context/page-context';
import { useRecommendation } from './use-recommendation';
import {
  validation,
  blurValidation,
  emptyValidation,
  FormFields,
  FormErrors,
} from '../form-common/validators';
import {
  defaultFormValues,
  recommendationNeeded,
  roomsShouldDisplay,
  handleFormChange,
  MovedEvent,
} from './utils';
import classes from './form-ui.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  users: UserData[];
  initialValues?: PageData;
  movedEvents: MutableRefObject<MovedEvent[]>;
  onClose: () => void;
  onRemove?: () => void;
  onSubmit: (values: CreatedEvent) => void;
};

export const FormUI = ({
  mode,
  users,
  initialValues = {},
  movedEvents,
  onClose,
  onRemove,
  onSubmit,
}: Props) => {
  const size = useSizeCtx();
  const [{ values, validity, errors }, { field, form }] = useForm<
    FormFields,
    FormErrors
  >(
    {
      ...defaultFormValues,
      ...initialValues,
    },
    {
      onChange: handleFormChange,
      submitValidator: emptyValidation,
    }
  );
  const recommendedRooms = useRecommendation(
    values,
    recommendationNeeded(validity, values, initialValues),
    movedEvents
  );

  function renderFormFields() {
    const fields = [
      <div key="title">
        <label htmlFor="title" title="Тема">
          Тема
        </label>
        <Input
          id="title"
          size={size}
          placeholder="О чём будете говорить?"
          {...field({
            name: 'title',
            validate: validation.title,
          })}
          error={validity.title === false}
        />
        {errors.title && <p className={classes.inputError}>{errors.title}</p>}
      </div>,
      <div key="datetime" className={classes.dateTime}>
        <div className={classes.date}>
          <label
            htmlFor="date"
            title={size === 'default' ? 'Дата' : 'Дата и время'}
          >
            {size === 'default' ? 'Дата' : 'Дата и время'}
          </label>
          <CalendarInput
            id="date"
            size={size}
            {...field({
              name: 'date',
              validate: validation.date,
              validateOnBlur: blurValidation.date,
              touchOnChange: true,
            })}
            error={validity.date === false}
          />
          {errors.date && <p className={classes.inputError}>{errors.date}</p>}
        </div>
        <div className={classes.timeContainer}>
          <div className={classes.time}>
            {size === 'default' && <label title="Начало">Начало</label>}
            <TimePicker
              size={size}
              {...field({
                name: 'startTime',
                validate: validation.startTime,
                validateOnBlur: blurValidation.startTime,
                touchOnChange: true,
              })}
              error={validity.startTime === false || validity.time === false}
            />
            {errors.startTime && (
              <p className={classes.inputError}>{errors.startTime}</p>
            )}
          </div>
          <span>&mdash;</span>
          <div className={classes.time}>
            {size === 'default' && <label title="Конец">Конец</label>}
            <TimePicker
              size={size}
              {...field({
                name: 'endTime',
                validate: validation.endTime,
                validateOnBlur: blurValidation.endTime,
                touchOnChange: true,
              })}
              error={validity.endTime === false || validity.time === false}
            />
            {errors.endTime && (
              <p className={classes.inputError}>{errors.endTime}</p>
            )}
          </div>
        </div>
        {errors.time && (
          <p className={cn(classes.inputError, classes.timeErrors)}>
            {errors.time}
          </p>
        )}
      </div>,
      <div key="users" className={classes.users}>
        <label htmlFor="users" title="Участники">
          Участники
        </label>
        <Selectpicker
          id="selectpicker"
          items={users}
          size={size}
          placeholder="Например, Тор Одинович"
          {...field({
            name: 'users',
            validate: validation.users,
          })}
          error={validity.users === false}
        />
        {errors.users && <p className={classes.inputError}>{errors.users}</p>}
      </div>,
    ];

    if (roomsShouldDisplay(validity, values, initialValues)) {
      const label = values.room
        ? 'Ваша переговорка'
        : 'Рекомендуемые переговорки';
      fields.push(
        <div key="room" className={classes.room}>
          <label htmlFor="room" title={label}>
            {label}
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
          {errors.room && <p className={classes.inputError}>{errors.room}</p>}
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
          {...form<CreatedEvent>({
            name: 'form',
            onSubmit,
          })}
        >
          <div className={classes.formError}>
            {errors.form && (
              <p className={classes.formErrorMessage}>{errors.form}</p>
            )}
          </div>
          {renderFormFields()}
        </form>
        <FormActions
          mode={mode}
          initialValues={initialValues}
          values={values}
          validity={validity}
          closePage={onClose}
          removeEvent={onRemove}
        />
      </div>
    </>
  );
};
