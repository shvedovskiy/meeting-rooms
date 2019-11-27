import { InputClassNames } from 'react-day-picker';

export interface CustomInputClassNames extends InputClassNames {
  lg: string;
}

export const module: CustomInputClassNames = {
  container: string,
  overlayWrapper: string,
  overlay: string,
};

export default module;
