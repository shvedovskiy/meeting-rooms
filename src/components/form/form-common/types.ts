import { PageData } from 'context/page-context';
import { UpdateEventVariables } from 'service/apollo/mutations';

export type FormPageProps = {
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};

export type MovedEvent = UpdateEventVariables & { prevRoom: string };
export type RoomMovedEvents = Map<string, UpdateEventVariables[]>;
export interface DayTable {
  [roomId: string]: string[];
}
