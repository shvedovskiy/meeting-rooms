import React, { useContext } from 'react';

import { Button } from 'components/ui/button/button';
import { StateValidity } from 'components/utils/use-form';
import { FormFields } from '../service/validators';
import { compareFormStates } from '../service/common';
import { PageMode, PageData } from 'context/page-context';
import sizeContext from 'context/size-context';
import classes from './form-actions.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  initialValues: PageData;
  values: FormFields;
  validity: StateValidity<FormFields>;
  closePage: () => void;
  openModal: () => void;
};

function isSubmitBlocked(
  formType: NonNullable<PageMode>,
  initialValues: PageData,
  values: FormFields,
  validity: StateValidity<FormFields>
) {
  const fieldsValidities = Object.values(validity);
  switch (formType) {
    case 'add':
      return (
        // Number of fields
        Object.values(values).filter(Boolean).length < 6 ||
        fieldsValidities.some(v => v === false)
      );

    case 'edit':
      if (fieldsValidities.some(v => v === false)) {
        return true;
      }
      const { input, roomId, userIds } = compareFormStates(
        values,
        initialValues
      );
      if ([input, roomId, userIds].some(Boolean)) {
        return false;
      }
      return true;
    default:
      return false;
  }
}

export const FormActions = ({
  mode,
  initialValues,
  values,
  validity,
  closePage,
  openModal,
}: Props) => {
  const size = useContext(sizeContext);
  const props = {
    size,
    className: classes.action,
  };

  return (
    <>
      <Button onClick={() => closePage()} {...props}>
        Отмена
      </Button>
      {mode === 'edit' && size === 'default' && (
        <Button danger onClick={() => openModal()} {...props}>
          Удалить встречу
        </Button>
      )}
      <Button
        use="primary"
        type="submit"
        form="eventForm"
        disabled={isSubmitBlocked(mode, initialValues, values, validity)}
        {...props}
      >
        {mode === 'add' ? 'Создать встречу' : 'Сохранить'}
      </Button>
    </>
  );
};
