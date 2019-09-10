import React, {
  useState,
  useRef,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';

import { Override } from 'service/typings';
import { Icon } from 'components/ui/icon/icon';
import { Size } from 'context/size-context';
import classes from './input.module.scss';

export type Props = Override<
  InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
    error?: boolean;
    size?: Size;
    sideIcon?: ReactNode | (() => ReactNode);
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onSideIconClick?: (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
    ) => void;
  }
>;

export const Input = (props: Props) => {
  const {
    value,
    error,
    size = 'default',
    sideIcon,
    onChange,
    onBlur,
    onSideIconClick,
    ...rest
  } = props;
  const [showClose, setShowClose] = useState(value && value.trim() !== '');
  const inputNode = useRef<HTMLInputElement>(null!);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(event.target.value);
    }
    if (event.target.value.trim() !== '') {
      setShowClose(true);
    } else {
      setShowClose(false);
    }
  }

  function handleCloseClick(
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    inputNode.current.value = '';
    inputNode.current.focus();
    if (onChange) {
      onChange('');
    }
    setShowClose(false);
  }

  function renderSideIcon() {
    if (!sideIcon) {
      return null;
    }
    const iconContent = sideIcon instanceof Function ? sideIcon() : sideIcon;
    if (onSideIconClick) {
      return (
        <button className={classes.sideIcon} onClick={onSideIconClick}>
          {iconContent}
        </button>
      );
    }
    return <span className={classes.sideIcon}>{iconContent}</span>;
  }

  const inputProps = {
    ...rest,
    type: 'text',
    className: classNames(classes.input, {
      [classes.lg]: size === 'large',
      [classes.error]: error,
    }),
    ref: inputNode,
    value,
    onChange: handleChange,
    onBlur: () => {
      if (onBlur) {
        onBlur();
      }
    },
  };
  const closeIconProps = {
    'aria-label': 'Очистить поле',
    title: 'Очистить поле',
    className: classes.closeIcon,
    onClick: handleCloseClick,
    style: { display: showClose ? 'block' : 'none' },
  };

  return (
    <span className={classes.wrapper}>
      <input {...inputProps} />
      {renderSideIcon() || (
        <button {...closeIconProps}>
          <Icon name="close" size={size} className={classes.icon} />
        </button>
      )}
    </span>
  );
};
