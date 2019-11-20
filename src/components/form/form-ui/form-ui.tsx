import React, { useRef, MutableRefObject } from 'react';
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
  validateOnSubmit,
  FormFields,
} from '../form-common/validators';
import { UpdateEventVariables } from 'service/mutations';
import {
  defaultFormValues,
  recommendationNeeded,
  roomsDisplayed,
  handleFormChange,
} from './utils';
import classes from './form-ui.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  users: UserData[];
  onClose: () => void;
  onRemove: () => void;
  onSubmit: (
    values: CreatedEvent,
    movedEvents: MutableRefObject<UpdateEventVariables[]>
  ) => void;
  initialValues?: PageData;
};

export const FormUI = ({
  mode,
  initialValues = {},
  users,
  onClose,
  onRemove,
  onSubmit: submitForm,
}: Props) => {
  const size = useSizeCtx();
  const movedEvents = useRef<UpdateEventVariables[]>([]);
  const [{ values, validity, errors }, { field, form }] = useForm<FormFields>(
    {
      ...defaultFormValues,
      ...initialValues,
    },
    {
      onChange: handleFormChange,
      submitValidator: validateOnSubmit,
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
        <label htmlFor="title">Тема</label>
        <Input
          id="title"
          size={size}
          placeholder="О чём будете говорить?"
          {...field({ name: 'title', validate: () => true })}
          error={validity.title === false}
        />
        {errors.title && (
          <div className={classes.inputError}>{errors.title}</div>
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
            error={validity.date === false}
          />
          {errors.date && (
            <div className={classes.inputError}>{errors.date}</div>
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
                validateOnBlur: blurValidation.startTime,
                touchOnChange: true,
              })}
              error={validity.startTime === false || validity.time === false}
            />
            {errors.startTime && (
              <div className={classes.inputError}>{errors.startTime}</div>
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
                validateOnBlur: blurValidation.endTime,
                touchOnChange: true,
              })}
              error={validity.endTime === false || validity.time === false}
            />
            {errors.endTime && (
              <div className={classes.inputError}>{errors.endTime}</div>
            )}
          </div>
        </div>
        {errors.time && (
          <div className={cn(classes.inputError, classes.timeErrors)}>
            {errors.time}
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
          error={validity.users === false}
        />
        {errors.users && (
          <div className={classes.inputError}>{errors.users}</div>
        )}
      </div>,
    ];

    if (roomsDisplayed(validity, values, initialValues)) {
      fields.push(
        <div key="room" className={classes.room}>
          <label htmlFor="room">
            {values.room ? 'Ваша переговорка' : 'Рекомендуемые переговорки'}
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
          {errors.room && (
            <div className={classes.inputError}>{errors.room}</div>
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
          {...form<CreatedEvent>({
            name: 'form',
            onSubmit(formValues: CreatedEvent) {
              submitForm(formValues, movedEvents);
            },
          })}
        >
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
