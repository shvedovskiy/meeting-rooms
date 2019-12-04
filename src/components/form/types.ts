import { PageData } from 'context/page-context';

export type FormPageProps = {
  formData?: PageData;
  onMount: () => void;
  onClose: () => void;
};
