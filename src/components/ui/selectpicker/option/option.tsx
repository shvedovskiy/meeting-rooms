import React from 'react';
import cn from 'classnames';
import { OptionProps } from 'react-select/src/components/Option';

import { Avatar } from 'components/ui/avatar/avatar';
import { UserData } from 'components/timesheet/types';
import cls from './option.module.scss';

export const Option = (props: OptionProps<UserData>) => {
  const { className, isSelected, isFocused, innerRef, innerProps } = props;
  const data = props.data as UserData;
  const elementClasses = cn(cls.selectOption, className, {
    [cls.focused]: isFocused,
  });

  return (
    <div
      className={elementClasses}
      ref={innerRef}
      {...innerProps}
      aria-selected={isFocused || isSelected ? 'true' : 'false'}
      role="option"
    >
      <div className={cls.iconContainer}>
        <Avatar avatarPath={data.avatarUrl} size="default" />
      </div>
      <div className={cls.optionText} title={`${data.login}·${data.homeFloor} этаж`}>
        <span className={cls.login}>{data.login}&nbsp;·</span>&nbsp;
        <span className={cls.homeFloor}>{data.homeFloor}&nbsp;этаж</span>
      </div>
    </div>
  );
};
