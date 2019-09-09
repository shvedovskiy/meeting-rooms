import React from 'react';

import { Button } from 'components/ui/button/button';
import { FormState, StateErrors } from 'components/utils/use-form';
import { EditFormFields } from '../service/validators';
import { PageType } from 'context/page-context';
import classes from './form-actions.module.scss';

type Props = {
  type: NonNullable<PageType>;
  closePage: () => void;
  openModal: () => void;
};

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

export const FormActions = ({ type, closePage, openModal }: Props) => (
  <>
    <Button className={classes.action} onClick={() => closePage()}>
      Отмена
    </Button>
    {type === 'edit' && (
      <Button className={classes.action} onClick={() => openModal()}>
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
