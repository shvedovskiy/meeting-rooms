import React, {
  useRef,
  ReactSVGElement,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  useState,
} from 'react';
import classNames from 'classnames';
import { Override } from 'service/typings';

import { Size } from 'service/sizes';
import { ReactComponent as Close } from './close.svg';
import classes from './input.module.scss';

export type Props = Override<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
    size?: Size;
    sideIcon?: ReactSVGElement;
    sideIconClick?: () => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    onSideIconClick?: (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
    ) => void;
  }
>;

export const Input = (props: Props) => {
  const {
    value,
    size = 'small',
    sideIcon,
    sideIconClick,
    onChange,
    onSideIconClick,
    ...rest
  } = props;
  const [showClose, setShowClose] = useState(value && value.trim() !== '');
  const inputNode = useRef<HTMLInputElement>(null!);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(event, event.target.value);
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

  function handleIconClick(
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) {
    if (onSideIconClick) {
      onSideIconClick(event);
    }
  }

  const inputProps = {
    ...rest,
    type: 'text',
    className: classNames(classes.input, {
      [classes.lg]: size === 'large',
    }),
    ref: inputNode,
    onChange: handleChange,
  };
  const closeIconProps = {
    className: classes.sideIcon,
    onClick: handleCloseClick,
    style: { display: showClose ? 'block' : 'none' },
  };

  return (
    <span className={classes.wrapper}>
      <input {...inputProps} />
      {sideIcon ? (
        <button className={classes.sideIcon} onClick={handleIconClick}>
          {sideIcon}
        </button>
      ) : (
        <button {...closeIconProps}>
          <Close
            width={size === 'large' ? 14 : 12}
            height={size === 'large' ? 14 : 12}
            viewBox="0 0 10 10"
          />
        </button>
      )}
    </span>
  );
};
