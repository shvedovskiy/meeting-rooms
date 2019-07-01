import React, {
  useRef,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  useState,
} from 'react';
import classNames from 'classnames';
import { Override } from 'service/typings';

import { CloseIcon } from '../close-icon/close-icon';
import { Size } from 'context/size-context';
import classes from './input.module.scss';

export type Props = Override<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
    size?: Size;
    sideIcon?: ReactNode | (() => ReactNode);
    onChange?: (value: string) => void;
    onSideIconClick?: (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
    ) => void;
  }
>;

export const Input = (props: Props) => {
  const {
    value,
    size = 'default',
    sideIcon,
    onChange,
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

  function handleCloseClick() {
    setShowClose(false);
    inputNode.current.value = '';
    inputNode.current.focus();
  }

  function renderSideIcon() {
    if (!sideIcon) {
      return null;
    }
    let iconContent = sideIcon instanceof Function ? sideIcon() : sideIcon;
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
    }),
    ref: inputNode,
    value,
    onChange: handleChange,
  };
  const closeIconProps = {
    className: classes.closeIcon,
    onClick: handleCloseClick,
    style: { display: showClose ? 'block' : 'none' },
  };

  return (
    <span className={classes.wrapper}>
      <input {...inputProps} />
      {renderSideIcon() || (
        <button {...closeIconProps}>
          <CloseIcon className={classes.iconElement} size={size} />
        </button>
      )}
    </span>
  );
};
