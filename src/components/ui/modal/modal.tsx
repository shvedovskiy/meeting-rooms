import React, { useState, useEffect } from 'react';
import AriaModal from 'react-aria-modal';
import { CSSTransition } from 'react-transition-group';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { Button, ButtonType } from '../button/button';
import { useSizeCtx, Size } from 'context/size-context';
import cls from './modal.module.scss';
import transitionClasses from './modal-transition.module.scss';

export type ModalButtonType = ButtonType & { id: string; text: string };

export type Props = {
  icon?: string;
  iconLabel?: string;
  title?: string;
  text?: string | string[];
  buttons?: ModalButtonType[];
  onBackdropClick?: () => void;
  enterAnimation?: boolean;
};

export const Modal = ({
  icon,
  iconLabel,
  title,
  text,
  buttons,
  onBackdropClick,
  enterAnimation = true,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const size = useSizeCtx() ?? Size.DEFAULT;

  useEffect(() => {
    setShowModal(true);
  }, []);

  function renderText(text?: string | string[]) {
    if (typeof text === 'string') {
      return <p className={cls.modalText}>{text}</p>;
    } else if (Array.isArray(text)) {
      return text.map((t, idx) => (
        <p key={idx} className={cls.modalText}>
          {t}
        </p>
      ));
    }
  }

  return (
    <CSSTransition
      classNames={transitionClasses}
      enter={enterAnimation}
      exit={false}
      in={enterAnimation ? showModal : true}
      timeout={200}
      unmountOnExit
    >
      <AriaModal
        alert
        aria-modal
        dialogClass={cn(cls.modal, { [cls.lg]: size === Size.LARGE })}
        dialogStyle={{ textAlign: 'center', verticalAlign: 'initial' }}
        focusDialog
        onExit={onBackdropClick}
        titleId="modal-title"
        underlayColor="rgba(0, 16, 33, 0.8)"
        underlayClickExits
        verticallyCenter
      >
        {icon && (
          <span className={cls.modalIcon}>
            <Emoji symbol={icon} label={iconLabel} />
          </span>
        )}
        {title && (
          <h1 className={cls.modalTitle} id="modal-title">
            {title}
          </h1>
        )}
        {renderText(text)}
        {buttons && (
          <div className={cls.modalButtons}>
            {buttons.map(({ id, text, ...rest }: ModalButtonType) => (
              <Button key={id} {...rest} size={size}>
                {text}
              </Button>
            ))}
          </div>
        )}
      </AriaModal>
    </CSSTransition>
  );
};
