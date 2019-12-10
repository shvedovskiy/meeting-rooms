import React, { Children, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { components } from 'react-select';
import { ValueContainerProps } from 'react-select/src/components/containers';

import { usePortal } from 'components/common/use-portal';
import classes from './value-container.module.scss';
import selectpickerClasses from '../selectpicker.module.scss';
import { UserData } from 'components/timesheet/types';

export const ValueContainer = ({ children, selectProps }: ValueContainerProps<UserData>) => {
  const target = usePortal(
    selectProps.containerId as string,
    selectpickerClasses.selectedContainer
  );
  const childrenArray = Children.toArray(children as ReactElement);
  const portalChildren = childrenArray.filter(c => c && c.type === components.MultiValue);
  const containerChildren = childrenArray.filter(c => !c || c.type !== components.MultiValue);

  return (
    <>
      <div className={classes.valueContainer}>{containerChildren}</div>
      {createPortal(portalChildren, target)}
    </>
  );
};
