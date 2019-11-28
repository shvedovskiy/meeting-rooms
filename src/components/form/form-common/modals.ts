import { Event } from 'components/timesheet/types';
import { Props as ModalDef } from 'components/ui/modal/modal';
import { format } from 'service/dates';

function generateSuccessfulModal(
  title: string,
  eventData: Event,
  closeModal: () => void
) {
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
        onClick: () => closeModal(),
      },
    ],
    onBackdropClick: () => closeModal(),
  };
  return modalConfig;
}

export function generateCreateModal(eventData: Event, closeModal: () => void) {
  return generateSuccessfulModal('Встреча создана!', eventData, closeModal);
}

export function generateUpdateModal(eventData: Event, closeModal: () => void) {
  return generateSuccessfulModal('Встреча обновлена!', eventData, closeModal);
}
