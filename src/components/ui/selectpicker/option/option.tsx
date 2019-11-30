import React from 'react';
import cn from 'classnames';
import { OptionProps } from 'react-select/src/components/Option';

import { UserData } from 'components/timesheet/types';
import classes from './option.module.scss';
import { Avatar } from 'components/ui/avatar/avatar';

export const Option = (props: OptionProps<UserData>) => {
  const { className, isSelected, isFocused, innerRef, innerProps } = props;
  const data = props.data as UserData;
  const elementClasses = cn(classes.selectOption, className, {
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
        <Avatar avatarPath={data.avatarUrl} size="default" />
      </div>
      <div className={classes.optionText}>
        <span className={classes.login}>{data.login}&nbsp;·</span>&nbsp;
        <span className={classes.homeFloor}>{data.homeFloor}&nbsp;этаж</span>
      </div>
    </div>
  );
};
