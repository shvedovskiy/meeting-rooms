import React from 'react';
import classNames from 'classnames';
import { OptionProps } from 'react-select/src/components/Option';

import { UserData } from 'components/timesheet/types';
import classes from './option.module.scss';

export const Option = (props: OptionProps<UserData>) => {
  const {
    data,
    className,
    isSelected,
    isFocused,
    innerRef,
    innerProps,
  } = props;
  const elementClasses = classNames(classes.selectOption, className, {
    [classes.focused]: isFocused,
  });
  return (
    <div
      className={elementClasses}
      ref={innerRef}
      {...innerProps}
      aria-selected={isFocused || isSelected ? 'true' : 'false'}
      role="option"
    >
      <div className={classes.iconContainer}>
        <img
          className={classes.icon}
          src={data.avatarUrl}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className={classes.optionText}>
        {data.login}&nbsp;·&nbsp;
        <span className={classes.homeFloor}>{data.homeFloor}&nbsp;этаж</span>
      </div>
    </div>
  );
};
