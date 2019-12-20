import React, {
  useState,
  useRef,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  InputHTMLAttributes,
} from 'react';
import cn from 'classnames';

import { Override } from 'service/typings';
import { Icon } from 'components/ui/icon/icon';
import { Size } from 'context/size-context';
import cls from './input.module.scss';

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
    size = Size.DEFAULT,
    sideIcon,
    onChange,
    onBlur,
    onSideIconClick,
    ...rest
  } = props;
  const [showClose, setShowClose] = useState(value?.trim() !== '');
  const inputNode = useRef<HTMLInputElement>(null!);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
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
    onChange?.('');
    setShowClose(false);
  }

  function renderSideIcon() {
    if (!sideIcon) {
      return null;
    }
    const iconContent = sideIcon instanceof Function ? sideIcon() : sideIcon;
    if (onSideIconClick) {
      return (
        <button type="button" className={cls.sideIcon} onClick={onSideIconClick}>
          {iconContent}
        </button>
      );
    }
    return <span className={cls.sideIcon}>{iconContent}</span>;
  }

  const inputProps = {
    ...rest,
    type: 'text',
    className: cn(cls.input, {
      [cls.lg]: size === Size.LARGE,
      [cls.error]: error,
    }),
    ref: inputNode,
    value,
    onChange: handleChange,
    onBlur,
  };
  const closeIconProps = {
    'aria-label': 'Очистить поле',
    type: 'button' as const,
    title: 'Очистить поле',
    className: cls.closeIcon,
    onClick: handleCloseClick,
    style: { display: showClose ? 'block' : 'none' },
  };

  return (
    <span className={cls.wrapper}>
      <input {...inputProps} />
      {renderSideIcon() ?? (
        <button {...closeIconProps}>
          <Icon name="close" size={size} className={cls.icon} />
        </button>
      )}
    </span>
  );
};
