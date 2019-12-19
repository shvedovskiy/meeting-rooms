import React, { useState } from 'react';

import { Button } from 'components/ui/button/button';
import { Modal } from 'components/ui/modal/modal';
import { StateValidity } from 'components/common/use-form';
import { FormFields } from '../form-common/validators';
import { compareFormStates } from '../form-common/compare-form-states';
import { PageMode, PageData } from 'context/page-context';
import { useSizeCtx } from 'context/size-context';
import classes from './form-actions.module.scss';

type Props = {
  mode: NonNullable<PageMode>;
  initialValues: PageData;
  values: FormFields;
  validity: StateValidity<FormFields>;
  onClose: () => void;
  onRemove?: () => void;
};

function isSubmitBlocked(
  formType: NonNullable<PageMode>,
  initialValues: PageData,
  values: FormFields,
  validity: StateValidity<FormFields>
) {
  const hasInvalidFields = Object.values(validity).some(v => v === false);
  if (formType === 'add') {
    return hasInvalidFields;
  } else {
    if (!hasInvalidFields) {
      const { input, roomId, userIds } = compareFormStates(values, initialValues);
      if ([input, roomId, userIds].some(Boolean)) {
        return false;
      }
    }
    return true;
  }
}

export const FormActions = ({
  mode,
  initialValues,
  values,
  validity,
  onClose: closePage,
  onRemove: removeEvent,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const size = useSizeCtx();
  const props = {
    size,
    className: classes.action,
  };

  return (
    <>
      {mode === 'edit' && size === 'large' && (
        <div className={classes.formButton}>
          <div className={classes.removeEvent}>
            <Button use="borderless" size={size} danger onClick={() => setModalOpen(true)}>
              Удалить встречу
            </Button>
          </div>
        </div>
      )}
      <div className={classes.actions}>
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
                  removeEvent?.();
                  setModalOpen(false);
                },
              },
            ]}
            onBackdropClick={() => setModalOpen(false)}
          />
        )}
        <Button onClick={() => closePage()} {...props}>
          Отмена
        </Button>
        {mode === 'edit' && size === 'default' && (
          <Button danger onClick={() => setModalOpen(true)} {...props}>
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
      </div>
    </>
  );
};
