import { ClassNames } from 'react-day-picker';

interface CustomClassNames extends ClassNames {
  weekend: string;
}

export const module: CustomClassNames = {
  body: string,
  caption: string,
  container: string,
  day: string,
  disabled: string,
  month: string,
  months: string,
  navBar: string,
  navButtonInteractionDisabled: string,
  navButtonPrev: string,
  navButtonNext: string,
  outside: string,
  selected: string,
  today: string,
  week: string,
  weekday: string,
  weekdays: string,
  weekdaysRow: string,
  weekend: string,
  weekNumber: string,
  wrapper: string,
};

export default module;
