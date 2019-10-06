import { format, parseISO } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import { ServerEvent } from 'components/timesheet/types';
import { Props as ModalDef } from 'components/ui/modal/modal';

function generateSuccessfulModal(
  title: string,
  eventData: ServerEvent,
  closeModal: () => void
) {
  const {
    date,
    startTime,
    endTime,
    room: { title: roomTitle, floor },
  } = eventData;

  const dateStr = format(parseISO(date), 'd MMMM', {
    locale: ruLocale,
  });

  const modalConfig: ModalDef = {
    icon: '🎉',
    iconLabel: 'none',
    title,
    text: [
      `${dateStr}, ${startTime}\u2013${endTime}`,
      `${roomTitle}\u00A0·\u00A0${floor} этаж`,
    ],
    buttons: [
      {
        id: '1',
        text: 'Хорошо',
        use: 'primary',
        onClick: () => closeModal(),
      },
    ],
    onBackdropClick: () => closeModal(),
  };
  return modalConfig;
}

export function generateCreateModal(
  eventData: ServerEvent,
  closeModal: () => void
) {
  return generateSuccessfulModal('Встреча создана!', eventData, closeModal);
}

export function generateUpdateModal(
  eventData: ServerEvent,
  closeModal: () => void
) {
  return generateSuccessfulModal('Встреча обновлена!', eventData, closeModal);
}
