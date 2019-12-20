import React, { Children, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { components } from 'react-select';
import { ValueContainerProps } from 'react-select/src/components/containers';

import { usePortal } from 'components/common/use-portal';
import { UserData } from 'components/timesheet/types';
import cls from './value-container.module.scss';
import selectpickerClasses from '../selectpicker.module.scss';

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
      <div className={cls.valueContainer}>{containerChildren}</div>
      {createPortal(portalChildren, target)}
    </>
  );
};
