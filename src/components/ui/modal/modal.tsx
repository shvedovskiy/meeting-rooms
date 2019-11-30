import React, { useState, useEffect } from 'react';
import AriaModal from 'react-aria-modal';
import { CSSTransition } from 'react-transition-group';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import classes from './modal.module.scss';
import transitionClasses from './modal-transition.module.scss';
import { Button, ButtonType } from '../button/button';
import { useSizeCtx } from 'context/size-context';

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
  const size = useSizeCtx() || 'default';

  useEffect(() => {
    setShowModal(true);
  }, []);

  function onExit() {
    if (onBackdropClick) {
      onBackdropClick();
    }
  }

  function renderText(text?: string | string[]) {
    if (typeof text === 'string') {
      return <p className={classes.modalText}>{text}</p>;
    } else if (Array.isArray(text)) {
      return text.map((t, idx) => (
        <p key={idx} className={classes.modalText}>
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
        alert={true}
        aria-modal={true}
        dialogClass={cn(classes.modal, {
          [classes.lg]: size === 'large',
        })}
        dialogStyle={{ textAlign: 'center', verticalAlign: 'initial' }}
        focusDialog={true}
        onExit={onExit}
        titleId="modal-title"
        underlayColor="rgba(0, 16, 33, 0.8)"
        verticallyCenter={true}
      >
        {icon && (
          <span className={classes.modalIcon}>
            <Emoji symbol={icon} label={iconLabel} />
          </span>
        )}
        {title && (
          <h1 className={classes.modalTitle} id="modal-title">
            {title}
          </h1>
        )}
        {renderText(text)}
        {buttons && (
          <div className={classes.modalButtons}>
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
