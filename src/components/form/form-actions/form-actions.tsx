import React, { useState, useCallback } from 'react';

import { Button } from 'components/ui/button/button';
import { Modal } from 'components/ui/modal/modal';
import { StateValidity } from 'components/common/use-form';
import { FormFields } from '../form-common/validators';
import { compareFormStates } from '../form-common/compare-form-states';
import { PageMode, PageData, PageModes } from 'context/page-context';
import { useSizeCtx, Size } from 'context/size-context';
import cls from './form-actions.module.scss';

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
  if (formType === PageModes.ADD) {
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

export function FormActions({
  mode,
  initialValues,
  values,
  validity,
  onClose: closePage,
  onRemove: removeEvent,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const size = useSizeCtx() ?? Size.DEFAULT;
  const buttonProps = {
    size,
    className: cls.action,
  };

  const showModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      {mode === PageModes.EDIT && size === Size.LARGE && (
        <div className={cls.formButton}>
          <div className={cls.removeEvent}>
            <Button use="borderless" size={size} danger onClick={showModal}>
              Удалить встречу
            </Button>
          </div>
        </div>
      )}
      <div className={cls.actions}>
        {modalOpen && (
          <Modal
            icon="🙅🏻"
            iconLabel="none"
            title="Встреча будет удалена безвозвратно"
            buttons={[
              {
                id: '1',
                text: 'Отмена',
                onClick: closeModal,
              },
              {
                id: '2',
                text: 'Удалить',
                onClick() {
                  removeEvent?.();
                  closeModal();
                },
              },
            ]}
            onBackdropClick={closeModal}
          />
        )}
        <Button onClick={closePage} {...buttonProps}>
          Отмена
        </Button>
        {mode === PageModes.EDIT && size === Size.DEFAULT && (
          <Button danger onClick={showModal} {...buttonProps}>
            Удалить встречу
          </Button>
        )}
        <Button
          use="primary"
          type="submit"
          form="eventForm"
          disabled={isSubmitBlocked(mode, initialValues, values, validity)}
          {...buttonProps}
        >
          {mode === PageModes.ADD ? 'Создать встречу' : 'Сохранить'}
        </Button>
      </div>
    </>
  );
}
