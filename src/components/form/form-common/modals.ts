import { Event } from 'components/timesheet/types';
import { Props as ModalDef } from 'components/ui/modal/modal';
import { format } from 'service/dates';

function generateSuccessfulModal(title: string, eventData: Event, closeModal: () => void) {
  const {
    date,
    startTime,
    endTime,
    room: { title: roomTitle, floor },
  } = eventData;

  const modalConfig: ModalDef = {
    icon: '🎉',
    iconLabel: 'none',
    title,
    text: [
      `${format(date)}, ${startTime}\u2013${endTime}`,
      `${roomTitle}\u00A0·\u00A0${floor} этаж`,
    ],
    buttons: [
      {
        id: '1',
        text: 'Хорошо',
        use: 'primary',
        onClick: closeModal,
      },
    ],
    onBackdropClick: closeModal,
  };
  return modalConfig;
}

function generateFailedModal(
  title: string,
  text: string,
  retry: () => void,
  closeModal: () => void
) {
  return {
    icon: '🧯',
    iconLabel: 'none',
    title,
    text,
    buttons: [
      {
        id: '1',
        text: 'Повторить',
        use: 'primary',
        onClick: retry,
      },
    ],
    onBackdropClick: closeModal,
  } as ModalDef;
}

export const generateCreateModal = generateSuccessfulModal.bind(null, 'Встреча создана!');

export const generateUpdateModal = generateSuccessfulModal.bind(null, 'Встреча обновлена!');

export const generateFailedSaveModal = generateFailedModal.bind(
  null,
  'При сохранении события произошла ошибка'
);

export const generateFailedRemoveModal = generateFailedModal.bind(
  null,
  'При удалении события произошла ошибка'
);
