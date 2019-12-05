import { PageData } from 'context/page-context';
import { UpdateEventVars } from 'service/apollo/mutations';

export type FormPageProps = {
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

export type EventToMove = UpdateEventVars & { prevRoom: string };
export type RoomMovedEvents = Map<string, UpdateEventVars[]>;
export interface DayTable {
  [roomId: string]: string[];
}
