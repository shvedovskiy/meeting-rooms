import { format, parseISO } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import { RoomData, RoomCard, ServerEvent } from 'components/timesheet/types';
import { Props as ModalDef } from 'components/ui/modal/modal';
import { PageData } from 'context/page-context';

export function getRecommendation(
  event: PageData,
  rooms: RoomData[]
): [RoomCard | null, RoomCard[]] {
  let eventRoom: RoomCard | null = null;
  const recommendedRooms = rooms.map(r => {
    if (event.room && r.id === event.room.id) {
      eventRoom = {
        ...r,
        startTime: event.startTime!,
        endTime: event.endTime!,
      };
      return eventRoom;
    }
    return {
      ...r,
      startTime: '13:00',
      endTime: '14:00',
    };
  });
  return [eventRoom, recommendedRooms];
}

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
